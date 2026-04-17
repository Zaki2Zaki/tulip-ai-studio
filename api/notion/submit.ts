// Vercel Serverless Function
// POST /api/notion/submit
// Receives Pipeline Lab diagnostic results and writes to Notion database

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Client } from '@notionhq/client';

const NOTION_API_VERSION = '2022-06-28';

// --- Types ---

interface BaseSubmission {
  source: 'validate' | 'roi-model';
  ctaClicked: string;
  timestamp: string;
}

interface ValidateSubmission extends BaseSubmission {
  source: 'validate';
  selectedFrictionPoints?: string[];
  deepDivePoints?: string[];
  workflowTools?: string[];
}

interface ROIModelSubmission extends BaseSubmission {
  source: 'roi-model';
  studioScale?: string;
  outputType?: string;
  budgetRange?: string;
  outsourcePct?: number;
  rdBudget?: number;
}

type Submission = ValidateSubmission | ROIModelSubmission;

// --- In-memory rate limiting ---

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  if (entry.count >= RATE_LIMIT_MAX) return true;

  entry.count++;
  return false;
}

// --- CORS headers ---

function setCORSHeaders(res: VercelResponse): void {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

// --- Property builders ---

function buildCommonProperties(body: Submission): Record<string, unknown> {
  const label =
    body.source === 'roi-model'
      ? `ROI Model — ${new Date(body.timestamp).toLocaleDateString()}`
      : `Validate — ${new Date(body.timestamp).toLocaleDateString()}`;

  return {
    Name: {
      title: [{ text: { content: label } }],
    },
    'Submission Date': {
      date: { start: body.timestamp },
    },
    'Source Branch': {
      select: {
        name:
          body.source === 'roi-model'
            ? 'ROI Model (Strategic Briefing)'
            : 'Validate (Interactive Demo)',
      },
    },
    'CTA Clicked': {
      select: { name: body.ctaClicked },
    },
    Status: {
      select: { name: 'New' },
    },
    'Full Data': {
      rich_text: [
        { text: { content: JSON.stringify(body, null, 2).slice(0, 2000) } },
      ],
    },
  };
}

function buildValidateProperties(body: ValidateSubmission): Record<string, unknown> {
  return {
    'Friction Points': {
      multi_select: (body.selectedFrictionPoints ?? []).map((fp: string) => ({ name: fp })),
    },
    'Deep Dive Points': {
      rich_text: [{ text: { content: (body.deepDivePoints ?? []).join(', ') } }],
    },
    'Workflow Tools': {
      rich_text: [{ text: { content: (body.workflowTools ?? []).join(', ') } }],
    },
  };
}

function buildROIModelProperties(body: ROIModelSubmission): Record<string, unknown> {
  return {
    'Studio Scale': {
      select: { name: body.studioScale ?? 'Unknown' },
    },
    'Output Type': {
      select: { name: body.outputType ?? 'Unknown' },
    },
    'Investment Range': {
      rich_text: [{ text: { content: body.budgetRange ?? 'Unknown' } }],
    },
    'Outsource Pct': {
      number: body.outsourcePct ?? null,
    },
    'R&D Budget': {
      number: body.rdBudget ?? null,
    },
  };
}

// --- Handler ---

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCORSHeaders(res);

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Rate limiting by IP
  const ip =
    (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ??
    req.socket?.remoteAddress ??
    'unknown';

  if (isRateLimited(ip)) {
    return res.status(429).json({ error: 'Too many requests' });
  }

  const apiKey = process.env.NOTION_API_KEY;
  const databaseId = process.env.NOTION_DATABASE_ID;

  if (!apiKey || !databaseId) {
    return res.status(500).json({ error: 'Notion credentials not configured' });
  }

  const body = req.body as Submission;
  const { source, timestamp } = body;

  if (!source || !timestamp) {
    return res.status(400).json({ error: 'Missing required fields: source, timestamp' });
  }

  try {
    const notion = new Client({ auth: apiKey, notionVersion: NOTION_API_VERSION });

    const commonProps = buildCommonProperties(body);
    let extraProps: Record<string, unknown> = {};

    if (source === 'validate') {
      extraProps = buildValidateProperties(body as ValidateSubmission);
    } else if (source === 'roi-model') {
      extraProps = buildROIModelProperties(body as ROIModelSubmission);
    }

    const page = await notion.pages.create({
      parent: { database_id: databaseId },
      properties: { ...commonProps, ...extraProps } as Parameters<typeof notion.pages.create>[0]['properties'],
    });

    return res.status(200).json({ success: true, notionPageId: page.id });
  } catch (err: unknown) {
    console.error('Handler error:', err);
    return res.status(500).json({ success: false, error: String(err) });
  }
}
