// Vercel Serverless Function
// POST /api/notion/quote
// Receives quote builder / Calendly booking submissions and writes to Notion

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Client } from '@notionhq/client';

const NOTION_API_VERSION = '2022-06-28';
const FALLBACK_DATABASE_ID = '0df0901391874257847311b5676d9a24';

// --- In-memory rate limiting ---

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 60 * 1000;

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

// --- Handler ---

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCORSHeaders(res);

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const ip =
    (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ??
    req.socket?.remoteAddress ??
    'unknown';

  if (isRateLimited(ip)) return res.status(429).json({ error: 'Too many requests' });

  const apiKey = process.env.NOTION_API_KEY;
  const databaseId = process.env.NOTION_DATABASE_ID ?? FALLBACK_DATABASE_ID;

  if (!apiKey) {
    return res.status(500).json({ error: 'Notion credentials not configured' });
  }

  const {
    selectedServices = [],
    studioScale = '',
    contactName = '',
    contactEmail = '',
    contactCompany = '',
    source = 'Website',
  } = req.body ?? {};

  const notion = new Client({ auth: apiKey, notionVersion: NOTION_API_VERSION });

  try {
    const page = await notion.pages.create({
      parent: { database_id: databaseId },
      properties: {
        Name: {
          title: [{ text: { content: contactName || 'Unknown' } }],
        },
        Email: {
          email: contactEmail || null,
        },
        Company: {
          rich_text: [{ text: { content: contactCompany } }],
        },
        'Studio Scale': {
          select: { name: studioScale || 'Not specified' },
        },
        'Selected Services': {
          multi_select: (selectedServices as string[]).map((s) => ({ name: s })),
        },
        Source: {
          select: { name: source },
        },
        Timestamp: {
          date: { start: new Date().toISOString() },
        },
        Status: {
          select: { name: 'New' },
        },
      } as Parameters<typeof notion.pages.create>[0]['properties'],
    });

    return res.status(200).json({ success: true, id: page.id });
  } catch (err: unknown) {
    console.error('Notion quote error:', err);
    return res.status(500).json({ success: false, error: String(err) });
  }
}
