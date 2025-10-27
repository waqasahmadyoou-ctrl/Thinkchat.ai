import { GoogleGenAI, Chat, Part, GenerateContentResponse } from "@google/genai";
import { Message } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

// FIX: Switched from deprecated model access and model.startChat to ai.chats.create for initializing a chat session.
export const startChat = (systemInstruction: string, history: Message[]): Chat => {
  const formattedHistory = history.map(msg => ({
    role: msg.role,
    parts: [{ text: msg.text }] // Note: Image history not yet supported this way in Chat object
  }));

  return ai.chats.create({
    model: 'gemini-2.5-flash',
    history: formattedHistory,
    // FIX: Renamed deprecated `generationConfig` to `config`.
    config: {
      temperature: 0.7,
      topP: 0.95,
      topK: 64,
      systemInstruction,
    },
  });
};

export const sendMessageStream = async (chat: Chat, message: string, image?: { data: string, mimeType: string }): Promise<AsyncGenerator<GenerateContentResponse>> => {
  const parts: Part[] = [{ text: message }];

  if (image) {
    parts.unshift({
      inlineData: {
        data: image.data,
        mimeType: image.mimeType,
      }
    });
  }
  
  // FIX: `chat.sendMessageStream` expects an array of Parts directly, not an object containing a `parts` property.
  return chat.sendMessageStream(parts);
};
