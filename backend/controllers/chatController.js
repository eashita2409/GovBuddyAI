/**
 * chatController.js
 * -----------------
 * This controller handles the /api/chat endpoint.
 *
 * It receives a user message from the request body,
 * sends it to OpenAI with a GovBuddy system prompt,
 * and returns the AI reply as JSON.
 */

const OpenAI = require('openai');

// -----------------------------------------------
// Initialize the OpenAI client.
// The API key is automatically read from the
// OPENAI_API_KEY environment variable.
// -----------------------------------------------
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// -----------------------------------------------
// System Prompt
// This tells OpenAI how GovBuddy AI should behave.
// It's sent as the first "system" message in every
// conversation so the AI always stays in character.
// -----------------------------------------------
const SYSTEM_PROMPT = `You are GovBuddy AI, an intelligent assistant for Indian government schemes, scholarships, forms, RTI guidance, and citizen services.

Your personality:
- Friendly, helpful, and patient
- Clear and simple language (avoid jargon)
- Provide accurate, actionable information
- When relevant, mention official government portals (e.g., scholarships.gov.in, rtionline.gov.in)
- Always encourage users to verify critical details on official sources

You can help with:
- Central and State government scholarships (AICTE, NSP, state portals)
- PM schemes (PM Kisan, PM Awas Yojana, Ayushman Bharat, etc.)
- RTI (Right to Information) filings and guidance
- Government forms, documents, and application processes
- Aadhaar, PAN, ration card, and other ID-related queries
- Employment schemes (MGNREGA, PMEGP, Skill India)
- Education and healthcare government programs

If a query is outside your scope, politely say so and guide the user to the right resource.`;

// -----------------------------------------------
// POST /api/chat — Main controller function
// -----------------------------------------------
const handleChat = async (req, res) => {
  try {
    // 1. Extract the user's message from request body
    const { message } = req.body;

    // 2. Validate — message must be a non-empty string
    if (!message || typeof message !== 'string' || message.trim() === '') {
      return res.status(400).json({
        error: 'Bad Request',
        details: 'The "message" field is required and must be a non-empty string.',
      });
    }

    const userMessage = message.trim();

    // 3. Log the incoming query (useful for debugging)
    console.log(`[GovBuddy] User: "${userMessage}"`);

    // 4. Call the OpenAI Chat Completions API
    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
      messages: [
        // System message sets the AI's role and behaviour
        { role: 'system', content: SYSTEM_PROMPT },
        // User message is what the citizen actually asked
        { role: 'user',   content: userMessage },
      ],
      max_tokens: 600,      // Keep responses concise
      temperature: 0.7,     // Balanced creativity vs accuracy
    });

    // 5. Extract the AI's reply text
    const reply = completion.choices[0].message.content.trim();

    // 6. Log the AI reply (useful for debugging)
    console.log(`[GovBuddy] AI: "${reply.substring(0, 80)}..."`);

    // 7. Send the reply back to the frontend
    return res.status(200).json({ reply });

  } catch (error) {
    // -----------------------------------------------
    // Error Handling
    // -----------------------------------------------

    // OpenAI-specific errors (e.g. invalid API key, quota exceeded)
    if (error.status === 401) {
      console.error('[GovBuddy] OpenAI Auth Error: Invalid API key');
      return res.status(500).json({
        error: 'AI Service Error',
        details: 'Invalid OpenAI API key. Please check your .env file.',
      });
    }

    if (error.status === 429) {
      console.error('[GovBuddy] OpenAI Rate Limit / Quota exceeded');
      return res.status(429).json({
        error: 'Rate Limit Exceeded',
        details: 'OpenAI quota exceeded. Please try again later or upgrade your plan.',
      });
    }

    if (error.status === 503) {
      console.error('[GovBuddy] OpenAI Service Unavailable');
      return res.status(503).json({
        error: 'AI Service Unavailable',
        details: 'OpenAI is temporarily unavailable. Please try again shortly.',
      });
    }

    // Generic / unexpected error
    console.error('[GovBuddy] Unexpected error:', error.message);
    return res.status(500).json({
      error: 'Internal Server Error',
      details: 'Something went wrong. Please try again.',
    });
  }
};

module.exports = { handleChat };
