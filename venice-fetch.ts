import fetch from 'node-fetch';

const VENICE_API_KEY = process.env.API || 'YOUR_VENICE_API_KEY';
const VENICE_API_URL = 'https://api.venice.ai/v1/chat/completions';

async function veniceChat(messages: {role: string, content: string}[]) {
  const response = await fetch(VENICE_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${VENICE_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'venice-text', // Make sure this is a valid Venice model!
      messages: messages
    })
  });

  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(`HTTP ${response.status} — ${errorData}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

(async () => {
  try {
    const result = await veniceChat([
      { role: 'system', content: 'You are a helpful assistant.' },
      { role: 'user', content: 'What is the capital of France?' }
    ]);
    console.log('Venice reply:', result);
  } catch (err) {
    console.error('Venice API error:', err);
  }
})();
