import { useState, useRef, useCallback, useEffect } from 'react';
import { Message, AIPersonality } from '../types';
import { startChat, sendMessageStream } from '../services/geminiService';
import { Chat } from '@google/genai';

export const useChat = (activePersonality: AIPersonality) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const chatRef = useRef<Chat | null>(null);

  useEffect(() => {
    // Initialize or reset chat when personality changes
    const initialHistory: Message[] = []; // Can be loaded from localStorage if needed
    chatRef.current = startChat(activePersonality.prompt, initialHistory);
    setMessages([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activePersonality]);


  const sendMessage = useCallback(async (text: string, image?: { data: string; mimeType: string }, fileName?: string) => {
    if (!text && !image) return;

    setIsLoading(true);
    setError(null);

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      text,
      image: image ? `data:${image.mimeType};base64,${image.data}` : undefined,
      fileName
    };
    setMessages(prev => [...prev, userMessage]);

    const modelResponseId = (Date.now() + 1).toString();
    const modelMessage: Message = {
      id: modelResponseId,
      role: 'model',
      text: ''
    };
    setMessages(prev => [...prev, modelMessage]);

    try {
      if (!chatRef.current) {
        throw new Error("Chat not initialized");
      }
      
      const stream = await sendMessageStream(chatRef.current, text, image);
      let fullResponse = "";

      for await (const chunk of stream) {
        const chunkText = chunk.text;
        if (chunkText) {
          fullResponse += chunkText;
          setMessages(prev =>
            prev.map(msg =>
              msg.id === modelResponseId ? { ...msg, text: fullResponse } : msg
            )
          );
        }
      }
      // Final update to ensure history in chatRef is correct
      // This is managed by the Chat object itself
      
    } catch (e) {
      console.error(e);
      const errorMessage = e instanceof Error ? e.message : "An unknown error occurred.";
      setError(errorMessage);
       setMessages(prev =>
            prev.map(msg =>
              msg.id === modelResponseId ? { ...msg, text: `Error: ${errorMessage}` } : msg
            )
          );
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearChat = useCallback(() => {
    if(chatRef.current) {
        chatRef.current = startChat(activePersonality.prompt, []);
    }
    setMessages([]);
  }, [activePersonality.prompt]);

  return { messages, setMessages, isLoading, error, sendMessage, clearChat };
};