import React from 'react';
import SparklesIcon from './icons/SparklesIcon';
import FileIcon from './icons/FileIcon';
import BrainIcon from './icons/BrainIcon';
import LockIcon from './icons/LockIcon';
import ThinkChatIcon from './icons/ThinkChatIcon';

interface LandingPageProps {
  onStartChatting: () => void;
}

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; description: string }> = ({ icon, title, description }) => (
  <div className="bg-light-card dark:bg-dark-card p-6 rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300 transform hover:-translate-y-1">
    <div className="text-primary mb-4">{icon}</div>
    <h3 className="text-xl font-bold mb-2 text-light-text dark:text-dark-text">{title}</h3>
    <p className="text-light-accent dark:text-gray-400">{description}</p>
  </div>
);

const LandingPage: React.FC<LandingPageProps> = ({ onStartChatting }) => {
  const features = [
    {
      icon: <SparklesIcon className="w-8 h-8" />,
      title: "Smart Conversations",
      description: "Chat naturally with an intelligent AI that understands context and adapts to your needs."
    },
    {
      icon: <FileIcon className="w-8 h-8" />,
      title: "File Reading",
      description: "Upload documents, PDFs, and images for instant summaries, analysis, and data extraction."
    },
    {
      icon: <BrainIcon className="w-8 h-8" />,
      title: "Expert Avatars",
      description: "Switch between AI personalities like a teacher, analyst, or creative to get tailored responses."
    },
    {
      icon: <LockIcon className="w-8 h-8" />,
      title: "Private & Secure",
      description: "Your conversations are private. We believe in data security and user control, always."
    },
  ];

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <header className="py-4 px-4 sm:px-8">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <ThinkChatIcon className="w-8 h-8 text-primary" />
            <span className="text-2xl font-bold text-light-text dark:text-dark-text">ThinkChat</span>
          </div>
          <button
            onClick={onStartChatting}
            className="hidden sm:inline-block bg-primary text-white font-semibold py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Start Chatting
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 text-center py-16 sm:py-24">
        <h1 className="text-4xl sm:text-6xl font-extrabold text-light-text dark:text-dark-text mb-4 leading-tight">
          Think Smarter. Create Freely. Meet ThinkChat.
        </h1>
        <p className="text-lg sm:text-xl text-light-accent dark:text-gray-400 max-w-2xl mx-auto mb-8">
          Your personal AI assistant for learning, writing, and creativity.
        </p>
        <button
          onClick={onStartChatting}
          className="bg-primary text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
        >
          Start Chatting Free
        </button>
      </main>

      {/* Features Section */}
      <section id="features" className="py-16 sm:py-24 bg-gray-50 dark:bg-dark-bg/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <FeatureCard key={index} {...feature} />
            ))}
          </div>
        </div>
      </section>

      {/* Live Chat Preview Section */}
      <section id="demo" className="py-16 sm:py-24">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Simple, Powerful, Intuitive</h2>
          <p className="text-lg text-light-accent dark:text-gray-400 mb-8 max-w-2xl mx-auto">An interface designed for focus and clarity. No clutter, just your conversation.</p>
          <div className="bg-light-card dark:bg-dark-card p-4 sm:p-6 rounded-2xl shadow-2xl max-w-4xl mx-auto">
            <div className="w-full h-auto aspect-video bg-cover bg-center rounded-lg" style={{backgroundImage: `url('https://picsum.photos/seed/thinkchatdemo/1200/675')`}}>
              {/* This is a placeholder for an interactive demo or video */}
            </div>
          </div>
        </div>
      </section>

      {/* Why ThinkChat Section */}
      <section id="why" className="py-16 sm:py-24 bg-gray-50 dark:bg-dark-bg/50">
        <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Why ThinkChat?</h2>
            <p className="text-lg text-light-accent dark:text-gray-400 mb-8 max-w-3xl mx-auto">
              ThinkChat is designed for everyone. Enjoy real human-like conversations, switch between multiple AI personalities, and get help fast—all for free, in a clean, mobile-friendly interface.
            </p>
             <button
              onClick={onStartChatting}
              className="bg-primary text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Try It Now
            </button>
        </div>
      </section>

      {/* Community & Updates Section */}
      <section id="community" className="py-16 sm:py-24">
        <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Join Our Community</h2>
            <p className="text-lg text-light-accent dark:text-gray-400 mb-8 max-w-2xl mx-auto">
                "ThinkChat has completely changed how I brainstorm and write. It's fast, intuitive, and the AI personalities are a game-changer!" - A Happy User
            </p>
            <div className="max-w-md mx-auto">
                <p className="mb-4">Get notified about new features and updates.</p>
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                    <input type="email" placeholder="Enter your email" className="flex-1 p-3 rounded-lg border border-gray-300 dark:border-dark-accent/50 bg-transparent focus:ring-2 focus:ring-primary focus:border-transparent transition-colors disabled:opacity-50" disabled />
                    <button className="bg-primary text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed" disabled>Subscribe</button>
                </div>
            </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 bg-secondary">
        <div className="container mx-auto px-4 text-center text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} ThinkChat. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;