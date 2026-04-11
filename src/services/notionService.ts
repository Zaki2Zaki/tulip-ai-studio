// Notion integration service
// Submits Pipeline Lab diagnostic results to Notion database via backend API

export interface ValidateSubmission {
  source: 'validate';
  ctaClicked: 'Book Discovery Call' | 'Email Results';
  timestamp: string;
  selectedFrictionPoints: string[];
  deepDivePoints: string[];
  workflowTools: string[];
}

export interface ROISubmission {
  source: 'roi-model';
  ctaClicked: '30 Mins Validate Meeting' | 'Book Discovery Call' | 'Email Results';
  timestamp: string;
  studioScale: string;
  outputType: string;
  budgetRange: string;
  outsourcePct: string;
  rdBudget: string;
}

export type NotionSubmission = ValidateSubmission | ROISubmission;

export async function submitToNotion(submission: NotionSubmission): Promise<void> {
  try {
    const response = await fetch('/api/notion/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(submission),
    });
    if (!response.ok) {
      console.warn('Notion submission failed silently:', response.status);
    }
  } catch (err) {
    // Non-blocking — never interrupt the user's CTA flow
    console.warn('Notion submission error (non-blocking):', err);
  }
}
