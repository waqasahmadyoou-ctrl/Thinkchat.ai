import React from 'react';
import { Theme } from '../App';
import ThinkChatIcon from './icons/ThinkChatIcon';
import { SunIcon, MoonIcon, PlusIcon, ChatBubbleLeftEllipsisIcon } from '@heroicons/react/24/outline';

interface SidebarProps {
  chatHistory: { id: string; title: string }[];
  activeChatId: string | null;
  onSelectChat: (id: string) => void;
  onNewChat: () => void;
  theme: Theme;
  setTheme: React.Dispatch<React.SetStateAction<Theme>>;
  onLogoClick: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ chatHistory, activeChatId, onSelectChat, onNewChat, theme, setTheme, onLogoClick }) => {
  return (
    <aside className="hidden md:flex flex-col w-64 lg:w-72 bg-light-card dark:bg-dark-card border-r border-gray-200 dark:border-dark-accent/30 p-4">
      <div className="flex items-center space-x-2 mb-6 cursor-pointer" onClick={onLogoClick}>
        <ThinkChatIcon className="w-8 h-8 text-primary" />
        <span className="text-xl font-bold text-light-text dark:text-dark-text">ThinkChat</span>
      </div>

      <button
        onClick={onNewChat}
        className="flex items-center justify-center w-full bg-primary text-white font-semibold py-2.5 px-4 rounded-lg hover:bg-blue-700 transition-colors mb-6"
      >
        <PlusIcon className="w-5 h-5 mr-2" />
        New Chat
      </button>

      <div className="flex-1 overflow-y-auto">
        <h3 className="text-sm font-semibold text-light-accent dark:text-dark-accent uppercase tracking-wider mb-2 px-2">Recent Chats</h3>
        <div className="space-y-1">
          {chatHistory.length > 0 ? (
            chatHistory.map((chat) => (
              <button
                key={chat.id}
                onClick={() => onSelectChat(chat.id)}
                className={`w-full text-left flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors truncate ${
                  activeChatId === chat.id
                    ? 'bg-primary/10 text-primary dark:bg-primary/20'
                    : 'hover:bg-gray-100 dark:hover:bg-dark-accent/20'
                }`}
              >
                <ChatBubbleLeftEllipsisIcon className="w-5 h-5 flex-shrink-0" />
                <span className="font-medium text-sm flex-1 truncate">{chat.title}</span>
              </button>
            ))
          ) : (
            <p className="text-sm text-light-accent dark:text-dark-accent px-3 py-2">No recent chats.</p>
          )}
        </div>
      </div>

      <div className="mt-auto pt-4 border-t border-gray-200 dark:border-dark-accent/30">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-light-accent dark:text-dark-accent">Theme</span>
          <button
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-dark-accent/30"
          >
            {theme === 'light' ? <MoonIcon className="w-5 h-5" /> : <SunIcon className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;