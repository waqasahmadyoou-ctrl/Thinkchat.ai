import React, { useState, useRef, useEffect } from 'react';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import Sidebar from './Sidebar';
import { useChat } from '../hooks/useChat';
import { AIPersonality, Message } from '../types';
import { Theme } from '../App';
import ThinkChatIcon from './icons/ThinkChatIcon';

const defaultPersonality: AIPersonality = {
  name: 'ThinkChat',
  prompt: 'You are ThinkChat — a professional, friendly, and intelligent AI assistant built to help users think creatively, learn faster, and communicate effectively. Speak naturally, like a knowledgeable friend. Always stay polite, concise, and context-aware. Adapt your tone to the user’s needs — formal for work, friendly for casual chats. Focus on clarity, empathy, and smart problem-solving. Offer ideas, summaries, and suggestions proactively when relevant.',
  icon: ThinkChatIcon
};

interface ChatInterfaceProps {
  onLogoClick: () => void;
  theme: Theme;
  setTheme: React.Dispatch<React.SetStateAction<Theme>>;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ onLogoClick, theme, setTheme }) => {
  const { messages, setMessages, isLoading, error, sendMessage, clearChat } = useChat(defaultPersonality);
  const [chatSessions, setChatSessions] = useState<Record<string, { title: string; messages: Message[] }>>({});
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load chat history from localStorage on initial render
  useEffect(() => {
    try {
      const savedChats = window.localStorage.getItem('thinkchat_history');
      if (savedChats) {
        setChatSessions(JSON.parse(savedChats));
      }
      const lastActiveId = window.localStorage.getItem('thinkchat_last_active');
      if (lastActiveId && savedChats) {
        const parsedChats = JSON.parse(savedChats);
        if(parsedChats[lastActiveId]) {
          setActiveChatId(lastActiveId);
          setMessages(parsedChats[lastActiveId].messages);
        }
      }
    } catch (e) {
      console.error("Failed to load chat history from localStorage", e);
    }
  }, [setMessages]);

  // Save chat history to localStorage whenever it changes
  useEffect(() => {
    if (Object.keys(chatSessions).length > 0) {
      window.localStorage.setItem('thinkchat_history', JSON.stringify(chatSessions));
    }
  }, [chatSessions]);

  // Update the current chat session with new messages
  useEffect(() => {
    if (activeChatId && messages.length > 0) {
      const currentSession = chatSessions[activeChatId];
      if (JSON.stringify(currentSession?.messages) !== JSON.stringify(messages)) {
        setChatSessions(prev => {
          const firstUserMessage = messages.find(m => m.role === 'user');
          const newTitle = prev[activeChatId]?.title || firstUserMessage?.text.substring(0, 40) + (firstUserMessage && firstUserMessage.text.length > 40 ? '...' : '');

          return {
            ...prev,
            [activeChatId]: {
              title: newTitle || 'New Chat',
              messages: messages,
            },
          };
        });
      }
    }
  }, [messages, activeChatId, chatSessions]);


  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleNewChat = () => {
    setActiveChatId(null);
    clearChat();
    window.localStorage.removeItem('thinkchat_last_active');
  };
  
  const handleSelectChat = (id: string) => {
    if (chatSessions[id]) {
      setActiveChatId(id);
      setMessages(chatSessions[id].messages);
      window.localStorage.setItem('thinkchat_last_active', id);
    }
  };

  const handleSendMessage = async (text: string, image?: { data: string; mimeType: string }, fileName?: string) => {
    let currentChatId = activeChatId;
    if (!currentChatId) {
      currentChatId = Date.now().toString();
      setActiveChatId(currentChatId);
      window.localStorage.setItem('thinkchat_last_active', currentChatId);
    }
    await sendMessage(text, image, fileName);
  };

  const chatHistoryForSidebar = Object.entries(chatSessions)
    // FIX: Use a less strict destructuring and a type assertion to prevent a TypeScript error.
    // This safely handles potentially malformed chat session data loaded from localStorage.
    .map(([id, session]) => ({ id, title: (session as { title?: string }).title || "New Chat" }))
    .sort((a, b) => Number(b.id) - Number(a.id)); // Sort by date, newest first

  return (
    <div className="flex h-screen w-full animate-fade-in">
      <Sidebar 
        chatHistory={chatHistoryForSidebar}
        activeChatId={activeChatId}
        onSelectChat={handleSelectChat}
        onNewChat={handleNewChat}
        theme={theme}
        setTheme={setTheme}
        onLogoClick={onLogoClick}
      />
      <main className="flex flex-col flex-1 h-screen bg-light-bg dark:bg-dark-bg">
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ThinkChatIcon className="w-24 h-24 text-primary opacity-50 mb-4"/>
              <h1 className="text-3xl font-bold text-light-text dark:text-dark-text">Hello! I'm ThinkChat.</h1>
              <p className="text-light-accent dark:text-dark-accent mt-2">
                How can I help you think, create, or learn today?
              </p>
            </div>
          ) : (
            messages.map((msg) => (
              <ChatMessage key={msg.id} message={msg} />
            ))
          )}
          {isLoading && messages[messages.length - 1]?.role === 'model' && (
             <div className="flex items-center space-x-3 self-start">
               <div className="p-3 bg-light-card dark:bg-dark-card rounded-2xl flex items-center space-x-2">
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse-fast"></div>
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse-fast animation-delay-200"></div>
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse-fast animation-delay-400"></div>
               </div>
             </div>
          )}
          {error && <div className="text-red-500 text-center p-4 bg-red-500/10 rounded-lg">{error}</div>}
          <div ref={messagesEndRef} />
        </div>
        <ChatInput onSend={handleSendMessage} isLoading={isLoading} />
      </main>
    </div>
  );
};

export default ChatInterface;
