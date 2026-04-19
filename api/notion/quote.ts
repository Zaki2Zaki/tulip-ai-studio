// Vercel Serverless Function — POST /api/notion/quote
// Uses native fetch (no SDK dependency)

const DATABASE_ID = process.env.NOTION_DATABASE_ID ?? '0df0901391874257847311b5676d9a24';
const NOTION_API_KEY = process.env.NOTION_API_KEY ?? '';

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  if (!NOTION_API_KEY) {
    return res.status(500).json({ error: 'NOTION_API_KEY not set' });
  }

  const {
    selectedServices = [],
    studioScale = '',
    contactName = '',
    contactEmail = '',
    contactCompany = '',
    source = 'Website',
  } = req.body ?? {};

  const properties: Record<string, any> = {
    Name: {
      title: [{ text: { content: contactName || 'Website Visitor' } }],
    },
    Company: {
      rich_text: [{ text: { content: contactCompany || '' } }],
    },
    'Studio Scale': {
      select: { name: studioScale || 'Not specified' },
    },
    'Selected Services': {
      multi_select: (selectedServices as string[]).filter(Boolean).map((s: string) => ({ name: s })),
    },
    Source: {
      select: { name: source || 'Website' },
    },
    'Meeting date': {
      date: { start: new Date().toISOString() },
    },
    Status: {
      status: { name: 'New' },
    },
  };

  if (contactEmail) {
    properties['Email'] = { email: contactEmail };
  }

  try {
    const response = await fetch('https://api.notion.com/v1/pages', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${NOTION_API_KEY}`,
        'Content-Type': 'application/json',
        'Notion-Version': '2022-06-28',
      },
      body: JSON.stringify({
        parent: { database_id: DATABASE_ID },
        properties,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Notion API error:', JSON.stringify(data));
      return res.status(500).json({ success: false, error: data.message ?? JSON.stringify(data) });
    }

    return res.status(200).json({ success: true, id: data.id });
  } catch (err: unknown) {
    console.error('Handler error:', String(err));
    return res.status(500).json({ success: false, error: String(err) });
  }
}
