import express from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load from server/.env or root .env
config({ path: path.join(__dirname, '.env') });
if (!process.env.GEMINI_API_KEY) {
  config({ path: path.join(__dirname, '..', '.env') });
}

const app = express();
const PORT = process.env.PORT || 3001;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// Multiple fallback models in order of efficiency and quota
const CANDIDATE_MODELS = [
  process.env.GEMINI_MODEL || 'gemini-3.5-flash-lite',
  'gemini-3.6-flash',
  'gemini-flash-latest'
];

app.use(cors({ origin: ['http://localhost:3500', 'http://localhost:3000', 'http://localhost:5173'] }));
app.use(express.json({ limit: '1mb' }));

// Rate limiting per IP (generous for local dev and multi-component mounts)
const rateLimits = new Map();
const RATE_LIMIT_WINDOW = 60_000;
const MAX_REQUESTS = 120;

function checkRateLimit(ip) {
  const now = Date.now();
  const record = rateLimits.get(ip);
  if (!record || now - record.windowStart > RATE_LIMIT_WINDOW) {
    rateLimits.set(ip, { windowStart: now, count: 1 });
    return true;
  }
  if (record.count >= MAX_REQUESTS) return false;
  record.count++;
  return true;
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    hasKey: !!GEMINI_API_KEY && GEMINI_API_KEY !== 'YOUR_GEMINI_API_KEY_HERE',
    models: CANDIDATE_MODELS 
  });
});

async function callGeminiModel(model, prompt) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`;
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 4096,
      },
      safetySettings: [
        { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_ONLY_HIGH' },
        { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_ONLY_HIGH' },
        { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_ONLY_HIGH' },
        { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_ONLY_HIGH' },
      ],
    }),
  });

  const responseData = await response.json().catch(() => ({}));
  return { ok: response.ok, status: response.status, data: responseData };
}

// Gemini proxy endpoint with multi-model fallback & automatic retry
app.post('/api/ai/generate', async (req, res) => {
  if (!GEMINI_API_KEY || GEMINI_API_KEY === 'YOUR_GEMINI_API_KEY_HERE') {
    return res.status(503).json({ error: 'Gemini API key not configured on the server. Please set GEMINI_API_KEY in server/.env' });
  }

  if (!checkRateLimit(req.ip)) {
    return res.status(429).json({ error: 'Too many requests. Please wait a moment and try again.' });
  }

  const { prompt } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required.' });
  }

  let lastErrorMsg = '';

  for (const model of CANDIDATE_MODELS) {
    try {
      const result = await callGeminiModel(model, prompt);

      if (result.ok) {
        const text = result.data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) {
          return res.json({ text, modelUsed: model });
        }
      }

      // If rate limited (429) or quota exceeded, log and try next model
      const msg = result.data?.error?.message || `Status ${result.status}`;
      lastErrorMsg = msg;
      console.warn(`[Gemini Proxy] Model ${model} returned error: ${msg}. Trying fallback model...`);

      // If it suggested a quick retry delay (e.g. 1-2s), wait briefly
      if (result.status === 429 && msg.includes('retry in')) {
        const match = msg.match(/retry in ([\d\.]+)s/);
        const waitSec = match ? Math.min(2.5, parseFloat(match[1])) : 1.5;
        await new Promise(resolve => setTimeout(resolve, waitSec * 1000));
      }
    } catch (err) {
      lastErrorMsg = err.message;
      console.warn(`[Gemini Proxy] Model ${model} fetch failed: ${err.message}`);
    }
  }

  // If all candidate models failed
  console.error('[Gemini Proxy] All models failed. Last error:', lastErrorMsg);
  res.status(502).json({ 
    error: lastErrorMsg || 'AI service temporarily unavailable. Please try again in a moment.' 
  });
});

app.listen(PORT, () => {
  console.log(`\n🐾 Paltoo API server running on http://localhost:${PORT}`);
  if (!GEMINI_API_KEY || GEMINI_API_KEY === 'YOUR_GEMINI_API_KEY_HERE') {
    console.log('⚠️  GEMINI_API_KEY not set! Edit server/.env with your key.');
  } else {
    console.log(`✅ Gemini API key loaded. Candidate models: ${CANDIDATE_MODELS.join(', ')}`);
  }
});
