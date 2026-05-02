export function useNotionCapture() {
  const capture = async (payload: object) => {
    try {
      await fetch('/api/notion-capture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...payload,
          timestamp: new Date().toISOString(),
        }),
      });
    } catch (error) {
      console.error('Notion capture failed:', error);
    }
  };

  return { capture };
}
