import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
app.use(express.json());

const PORT = 3000;

// Shared Gemini Client
let ai: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  if (!ai) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not configured in your secrets.');
    }
    ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return ai;
}

// API endpoint for general Financial Literacy Coach chat
app.post('/api/chat', async (req, res) => {
  try {
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Invalid messages array provided.' });
    }

    const client = getGeminiClient();

    // Map messages to Gemini API format
    // Filter down to last few messages to conserve tokens if needed
    const lastMessages = messages.slice(-10);
    const contents = lastMessages.map(m => ({
      role: m.sender === 'user' ? 'user' : 'model',
      parts: [{ text: m.text }]
    }));

    const response = await client.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: contents,
      config: {
        systemInstruction: `You are 'Manulife Mentor', a friendly, certified Canadian financial planning expert. 
Your mission is to teach Canadian adults financial literacy with high accuracy, warmth, and zero jargon. 
Always tailor your advice strictly to Canadian laws and systems (CRA rules, RRSPs, TFSAs, Group Pension plans, matching, FHSAs, taxes, Lifelong Learning, and Home Buyers plans).

Keep your answers:
1. Highly scannable with bullet points, brief paragraphs, and bolded key terms.
2. Short and concise (under 250 words) to fit nicely in a chat box.
3. Warm, encouraging, yet professional.

Disclaimers: Include a tiny, humble note at the end stating that your advice is for educational purposes and is not a formal tax/investment solicitation. Use standard Canadian spelling (e.g., colour, saviour, check is cheque, etc.).`,
      },
    });

    const reply = response.text || "I apologize, but I could not formulate a reply. Please try again.";
    res.json({ reply });
  } catch (err: any) {
    console.error('Error in /api/chat:', err);
    res.status(500).json({ 
      error: 'Failed to generate response.', 
      details: err.message || 'Is your GEMINI_API_KEY configured correctly in the Secrets panel?' 
    });
  }
});

// API endpoint for generating a Personalized Canadian Savings Roadmap
app.post('/api/plan', async (req, res) => {
  try {
    const { age, income, currentSavings, pensionMatch, primaryGoal } = req.body;
    
    const client = getGeminiClient();
    
    const prompt = `Please design a highly tailored, custom Canadian savings and tax roadmap for this user:
* Age: ${age} years old
* Annual Gross Income: $${income} CAD
* Current Retirement Savings: $${currentSavings} CAD
* Employer Pension Matching Program: ${pensionMatch ? 'Yes, they have an employer matching program' : 'No employer matching program'}
* Primary Financial Goal: ${primaryGoal}

Based on this, generate a beautifully formatted, structured, and easy-to-understand 3-step action guide:
Step 1: Immediate Priorities (Focus on the Employer Match if available, and establish the target matching amount)
Step 2: TFSA vs RRSP Split (Calculate their income bracket and explain why they should prioritize one over the other first, including the logic of their current tax bracket)
Step 3: Long-term Wealth Strategy (Outline compounding expectations, first home buying rules like the HBP or FHSA if relevant, and general allocation habits)

Keep the plan highly professional, matching the trustworthy, green, polished aesthetic of Manulife Canada. Output in clean Markdown format with headers, bold terms, and beautiful list structures. Add a friendly welcoming summary at the top and a professional checklist at the bottom.`;

    const response = await client.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: {
        systemInstruction: "You are the Manulife Wealth Architect, a senior Canadian retirement and pension coordinator. Write in a clear, precise, reassuring, and highly knowledgeable tone.",
      }
    });

    res.json({ plan: response.text || "Could not generate your savings plan. Please verify your inputs." });
  } catch (err: any) {
    console.error('Error in /api/plan:', err);
    res.status(500).json({ 
      error: 'Failed to generate financial plan.', 
      details: err.message || 'Is your GEMINI_API_KEY configured correctly in the Secrets panel?' 
    });
  }
});

// Setup Vite Dev Server / Static Assets
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Manulife Financial Literacy App server running on port ${PORT}`);
  });
}

startServer();
