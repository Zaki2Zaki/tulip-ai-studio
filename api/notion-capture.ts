import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Client } from '@notionhq/client';

const DATABASE_ID = '0df0901391874257847311b5676d9a24';

function setCORSHeaders(res: VercelResponse): void {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

function str(val: unknown): string {
  if (val === undefined || val === null) return 'Not provided';
  if (Array.isArray(val)) return val.length > 0 ? val.join(', ') : 'Not provided';
  return String(val) || 'Not provided';
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCORSHeaders(res);

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.NOTION_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Notion credentials not configured' });
  }

  const {
    source,
    ctaLabel,
    // Branch 1 fields
    frictionPoints,
    stageReached,
    recommendedTools,
    // Branch 3 fields
    studioScale,
    outputType,
    budgetRange,
    efficiencyOpportunity,
    yearOneValue,
    returnMultiple,
    timeToValue,
    recommendedTier,
    // Shared
    timestamp,
  } = req.body ?? {};

  if (!source || !timestamp) {
    return res.status(400).json({ error: 'Missing required fields: source, timestamp' });
  }

  try {
    const notion = new Client({ auth: apiKey });

    await notion.pages.create({
      parent: { database_id: DATABASE_ID },
      properties: {
        Name: {
          title: [{ text: { content: `${source} — ${ctaLabel} — ${timestamp}` } }],
        },
        Source: {
          select: { name: str(source) },
        },
        CTA: {
          select: { name: str(ctaLabel) },
        },
        'Studio Scale': {
          select: { name: str(studioScale) },
        },
        'Output Type': {
          select: { name: str(outputType) },
        },
        'Budget Range': {
          rich_text: [{ text: { content: str(budgetRange) } }],
        },
        'Efficiency Opportunity': {
          rich_text: [{ text: { content: str(efficiencyOpportunity) } }],
        },
        'Year One Value': {
          rich_text: [{ text: { content: str(yearOneValue) } }],
        },
        'Return Multiple': {
          rich_text: [{ text: { content: str(returnMultiple) } }],
        },
        'Time to Value': {
          rich_text: [{ text: { content: str(timeToValue) } }],
        },
        'Recommended Tier': {
          select: { name: str(recommendedTier) },
        },
        'Friction Points': {
          rich_text: [{ text: { content: str(frictionPoints) } }],
        },
        'Stage Reached': {
          rich_text: [{ text: { content: str(stageReached) } }],
        },
        'Recommended Tools': {
          rich_text: [{ text: { content: str(recommendedTools) } }],
        },
        Timestamp: {
          date: { start: timestamp },
        },
      } as Parameters<typeof notion.pages.create>[0]['properties'],
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Notion API error:', error);
    return res.status(500).json({ error: 'Failed to save to Notion' });
  }
}
