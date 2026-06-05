const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');

console.log('GEMINI_API_KEY details:', {
  type: typeof process.env.GEMINI_API_KEY,
  value: JSON.stringify(process.env.GEMINI_API_KEY),
  length: process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.length : 0
});

// Generate blog post draft using Google Gemini
router.post('/generate', async (req, res) => {
  const { prompt, tone, length, mode } = req.body || {};

  console.log('GEMINI_API_KEY checked at request level:', process.env.GEMINI_API_KEY ? `Yes (starts with ${process.env.GEMINI_API_KEY.substring(0, 5)}...)` : 'No');

  if (!prompt) {
    return res.status(400).json({ message: 'Prompt is required' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(400).json({ 
      message: 'Google Gemini API key is missing. Please configure GEMINI_API_KEY in the backend .env file.' 
    });
  }

  // Set SSE Headers
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    let systemInstructions = `You are an expert copywriter. Generate a high-quality blog post draft based on the user's prompt, tone, and length.`;
    
    if (mode === 'outline') {
      systemInstructions = `You are an expert copywriter. Generate a structured blog post outline based on the user's prompt and tone.`;
    } else if (mode === 'title') {
      systemInstructions = `You are an expert copywriter. Generate a set of catchy, SEO-friendly titles and a brief description for a blog post based on the user's prompt.`;
    }

    const fullPrompt = `${systemInstructions}
User Prompt: "${prompt}"
Tone: ${tone || 'Professional'}
Length: ${length || 'Medium'}

Format the response EXACTLY as follows. Do not include any markdown fences around the entire block (like \`\`\`json or \`\`\`markdown). Do not deviate from these markers.

---START_CONTENT---
<The generated blog post content in markdown format. If mode is "outline", generate the outline. If mode is "title", generate the list of title suggestions.>
---END_CONTENT---
---METADATA---
Title: <A single catchy, SEO-friendly title for the post>
Excerpt: <A short 1-2 sentence preview/excerpt of the post>
Tags: <3-5 comma-separated tags, all lowercase, e.g. technology, blogging, tutorials>
Category: <A single category from: Technology, Lifestyle, Travel, Food, Health, Business>
`;

    const result = await model.generateContentStream(fullPrompt);

    let accumulated = '';
    let sentIndex = -1;
    const startMarker = '---START_CONTENT---';
    const endMarker = '---END_CONTENT---';

    for await (const chunk of result.stream) {
      const text = chunk.text();
      accumulated += text;

      const startIndex = accumulated.indexOf(startMarker);
      if (startIndex !== -1) {
        const contentStart = startIndex + startMarker.length;
        if (sentIndex === -1) {
          sentIndex = contentStart;
        }

        const endIndex = accumulated.indexOf(endMarker);
        if (endIndex !== -1) {
          if (sentIndex < endIndex) {
            const chunkToSend = accumulated.substring(sentIndex, endIndex);
            res.write(`data: ${JSON.stringify({ type: 'content', text: chunkToSend })}\n\n`);
            sentIndex = endIndex;
          }
        } else {
          // Send content safely up to (length - endMarker.length) to avoid streaming endMarker pieces
          const safeLength = accumulated.length - endMarker.length;
          if (sentIndex < safeLength) {
            const chunkToSend = accumulated.substring(sentIndex, safeLength);
            res.write(`data: ${JSON.stringify({ type: 'content', text: chunkToSend })}\n\n`);
            sentIndex = safeLength;
          }
        }
      }
    }

    // Finished streaming. Check if we ever started content sending
    const metadataIndex = accumulated.indexOf('---METADATA---');
    let title = '';
    let excerpt = '';
    let tags = [];
    let category = '';

    if (metadataIndex !== -1) {
      const metadataPart = accumulated.substring(metadataIndex + '---METADATA---'.length);
      const lines = metadataPart.split('\n');
      for (const line of lines) {
        const matchTitle = line.match(/^Title:\s*(.*)$/i);
        const matchExcerpt = line.match(/^Excerpt:\s*(.*)$/i);
        const matchTags = line.match(/^Tags:\s*(.*)$/i);
        const matchCategory = line.match(/^Category:\s*(.*)$/i);

        if (matchTitle) title = matchTitle[1].trim();
        if (matchExcerpt) excerpt = matchExcerpt[1].trim();
        if (matchTags) {
          tags = matchTags[1].split(',').map(t => t.trim()).filter(Boolean);
        }
        if (matchCategory) category = matchCategory[1].trim();
      }
    }

    if (sentIndex === -1) {
      // Fallback: send the entire accumulated text if markers were missed or if there was an issue
      res.write(`data: ${JSON.stringify({ type: 'content', text: accumulated })}\n\n`);
    }

    // Send final event with parsed metadata
    res.write(`data: ${JSON.stringify({ type: 'done', title, excerpt, tags, category })}\n\n`);
    res.end();

  } catch (error) {
    console.error('AI Generation Error:', error);
    res.write(`data: ${JSON.stringify({ type: 'error', message: error.message })}\n\n`);
    res.end();
  }
});

module.exports = router;
