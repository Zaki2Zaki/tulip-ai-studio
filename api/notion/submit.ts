// Vercel Serverless Function
// POST /api/notion/submit
// Receives Pipeline Lab diagnostic results and writes to Notion database

import type { VercelRequest, VercelResponse } from '@vercel/node';

const NOTION_API_VERSION = '2022-06-28';
const NOTION_API_URL = 'https://api.notion.com/v1/pages';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.NOTION_API_KEY;
  const databaseId = process.env.NOTION_DATABASE_ID;

  if (!apiKey || !databaseId) {
    return res.status(500).json({ error: 'Notion credentials not configured' });
  }

  const body = req.body;
  const { source, ctaClicked, timestamp } = body;

  try {
    const label = source === 'roi-model'
      ? `ROI Model — ${new Date(timestamp).toLocaleDateString()}`
      : `Validate — ${new Date(timestamp).toLocaleDateString()}`;

    const commonProps: Record<string, unknown> = {
      'Name': {
        title: [{ text: { content: label } }],
      },
      'Submission Date': {
        date: { start: timestamp },
      },
      'Source Branch': {
        select: { name: source === 'roi-model' ? 'ROI Model (Strategic Briefing)' : 'Validate (Interactive Demo)' },
      },
      'CTA Clicked': {
        select: { name: ctaClicked },
      },
      'Status': {
        select: { name: 'New' },
      },
      'Full Data': {
        rich_text: [{ text: { content: JSON.stringify(body, null, 2).slice(0, 2000) } }],
      },
    };

    let extraProps: Record<string, unknown> = {};

    if (source === 'validate') {
      extraProps = {
        'Friction Points': {
          multi_select: (body.selectedFrictionPoints ?? []).map((fp: string) => ({ name: fp })),
        },
        'Deep Dive Points': {
          rich_text: [{ text: { content: (body.deepDivePoints ?? []).join(', ') } }],
        },
      };
    }

    if (source === 'roi-model') {
      extraProps = {
        'Studio Scale': {
          select: { name: body.studioScale ?? 'Unknown' },
        },
        'Output Type': {
          select: { name: body.outputType ?? 'Unknown' },
        },
        'Investment Range': {
          rich_text: [{ text: { content: body.budgetRange ?? 'Unknown' } }],
        },
      };
    }

    const notionRes = await fetch(NOTION_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'Notion-Version': NOTION_API_VERSION,
      },
      body: JSON.stringify({
        parent: { database_id: databaseId },
        properties: { ...commonProps, ...extraProps },
      }),
    });

    if (!notionRes.ok) {
      const err = await notionRes.text();
      console.error('Notion API error:', err);
      return res.status(500).json({ success: false, error: err });
    }

    const data = await notionRes.json();
    return res.status(200).json({ success: true, notionPageId: data.id });

  } catch (err: unknown) {
    console.error('Handler error:', err);
    return res.status(500).json({ success: false, error: String(err) });
  }
}
