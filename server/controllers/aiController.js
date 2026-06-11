import { GoogleGenAI } from '@google/genai';

export const handleAIChat = async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ message: 'Message content is required' });
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: message,
      config: {
        systemInstruction: 'You are an expert AI assistant for TeyzixMarket, a professional service marketplace. Help users find gigs, manage project milestones, and understand platform roles. Keep your answers clear and concise.',
      }
    });

    res.status(200).json({ reply: response.text });
  } catch (error) {
    res.status(500).json({ message: 'AI processing failed', error: error.message });
  }
};