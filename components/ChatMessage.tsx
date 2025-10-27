
import React from 'react';
import { Message } from '../types';
import ThinkChatIcon from './icons/ThinkChatIcon';
import { UserIcon } from '@heroicons/react/24/solid';

interface ChatMessageProps {
  message: Message;
}

// A simple markdown-to-html converter
const SimpleMarkdown: React.FC<{ text: string }> = ({ text }) => {
  const parts = text.split(/(\`\`\`[\s\S]*?\`\`\`|\*\*.*?\*\*|\*.*?\*|`.*?`)/g);
  
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith('```') && part.endsWith('```')) {
          const code = part.slice(3, -3).trim();
          return <pre key={i} className="bg-gray-100 dark:bg-black/30 p-3 rounded-lg overflow-x-auto text-sm my-2"><code className="font-mono">{code}</code></pre>;
        }
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={i}>{part.slice(2, -2)}</strong>;
        }
        if (part.startsWith('*') && part.endsWith('*')) {
          return <em key={i}>{part.slice(1, -1)}</em>;
        }
        if (part.startsWith('`') && part.endsWith('`')) {
          return <code key={i} className="bg-gray-200 dark:bg-dark-accent/50 text-red-500 dark:text-red-400 px-1 py-0.5 rounded text-sm font-mono">{part.slice(1, -1)}</code>;
        }
        return <span key={i}>{part}</span>;
      })}
    </>
  );
};

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isModel = message.role === 'model';

  return (
    <div className={`flex items-start gap-3 animate-slide-in-bottom ${isModel ? 'justify-start' : 'justify-end'}`}>
      {isModel && (
        <div className="w-8 h-8 flex-shrink-0 bg-primary/20 rounded-full flex items-center justify-center">
          <ThinkChatIcon className="w-5 h-5 text-primary" />
        </div>
      )}
      <div
        className={`max-w-xl p-3.5 rounded-2xl ${
          isModel ? 'bg-light-card dark:bg-dark-card rounded-tl-none' : 'bg-primary text-white rounded-br-none'
        }`}
      >
        <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap break-words">
           {message.image && (
                <div className="mb-2">
                    <img src={message.image} alt={message.fileName || 'Uploaded image'} className="max-w-xs rounded-lg"/>
                    {message.fileName && <p className={`text-xs mt-1 ${isModel ? 'text-light-accent dark:text-dark-accent' : 'text-blue-100'}`}>{message.fileName}</p>}
                </div>
            )}
            <SimpleMarkdown text={message.text}/>
        </div>
      </div>
       {!isModel && (
        <div className="w-8 h-8 flex-shrink-0 bg-gray-200 dark:bg-dark-accent rounded-full flex items-center justify-center">
          <UserIcon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        </div>
      )}
    </div>
  );
};

export default ChatMessage;
