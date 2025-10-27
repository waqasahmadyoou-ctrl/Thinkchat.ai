
import React, { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage';
import ChatInterface from './components/ChatInterface';

export type Theme = 'light' | 'dark';

function App() {
  const [isChatting, setIsChatting] = useState(false);
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const storedTheme = window.localStorage.getItem('theme') as Theme;
      return storedTheme || 'light';
    }
    return 'light';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    window.localStorage.setItem('theme', theme);
  }, [theme]);

  const handleStartChatting = () => {
    setIsChatting(true);
  };
  
  const handleLogoClick = () => {
    setIsChatting(false);
  };

  return (
    <div className="min-h-screen font-sans text-light-text dark:text-dark-text bg-light-bg dark:bg-dark-bg transition-colors duration-300">
      {isChatting ? (
        <ChatInterface onLogoClick={handleLogoClick} theme={theme} setTheme={setTheme} />
      ) : (
        <LandingPage onStartChatting={handleStartChatting} />
      )}
    </div>
  );
}

export default App;
