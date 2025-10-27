import React, { useState, useRef, useEffect } from 'react';
import { PaperAirplaneIcon, PaperClipIcon, MicrophoneIcon, StopCircleIcon } from '@heroicons/react/24/solid';
import { FileWithPreview } from '../types';

interface ChatInputProps {
  onSend: (text: string, image?: { data: string; mimeType: string }, fileName?: string) => void;
  isLoading: boolean;
}

// FIX: Augment the window type for the SpeechRecognition API, which is not part of the standard DOM library.
// This resolves TypeScript errors about 'SpeechRecognition' not existing on 'window'.
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

// SpeechRecognition might not exist on all browsers/environments
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

const ChatInput: React.FC<ChatInputProps> = ({ onSend, isLoading }) => {
  const [text, setText] = useState('');
  const [file, setFile] = useState<FileWithPreview | null>(null);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      const recognition = recognitionRef.current;
      recognition.continuous = true;
      recognition.interimResults = true;

      recognition.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }
        setText(text + finalTranscript + interimTranscript);
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
      };
      
      recognition.onend = () => {
        if(isListening){
            recognition.start();
        }
      };
    }
  }, [text, isListening]);

  const handleToggleListening = () => {
    if (!SpeechRecognition) {
      alert("Voice recognition is not supported in your browser.");
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };


  const handleSend = () => {
    if (isLoading || (!text.trim() && !file)) return;
    
    if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = (reader.result as string).split(',')[1];
            onSend(text, { data: base64String, mimeType: file.type }, file.name);
            setFile(null);
            setText('');
        };
        reader.readAsDataURL(file);
    } else {
        onSend(text);
        setText('');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
       if(selectedFile.type.startsWith('image/')) {
            const fileWithPreview = Object.assign(selectedFile, {
                preview: URL.createObjectURL(selectedFile)
            });
            setFile(fileWithPreview);
       } else {
           alert("Only image files are supported for direct analysis.");
       }
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };
  
  useEffect(() => {
      const textarea = textareaRef.current;
      if (textarea) {
          textarea.style.height = 'auto';
          const scrollHeight = textarea.scrollHeight;
          textarea.style.height = `${scrollHeight}px`;
      }
  }, [text]);

  return (
    <div className="bg-light-bg dark:bg-dark-bg p-4 border-t border-gray-200 dark:border-dark-accent/30">
      <div className="max-w-3xl mx-auto bg-light-card dark:bg-dark-card rounded-2xl p-2 flex items-end shadow-sm">
        {file && (
          <div className="p-2 relative">
            <img src={file.preview} alt="preview" className="w-16 h-16 rounded-lg object-cover" />
            <button
              onClick={() => setFile(null)}
              className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
            >
              &times;
            </button>
          </div>
        )}
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message or ask anything..."
          className="flex-1 bg-transparent p-2.5 resize-none border-none focus:ring-0 text-light-text dark:text-dark-text placeholder-light-accent dark:placeholder-dark-accent max-h-48"
          rows={1}
          disabled={isLoading}
        />
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept="image/*"
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="p-2 text-light-accent dark:text-dark-accent hover:text-primary dark:hover:text-primary transition-colors rounded-full"
        >
          <PaperClipIcon className="w-6 h-6" />
        </button>
        <button
          onClick={handleToggleListening}
          className={`p-2 transition-colors rounded-full ${isListening ? 'text-red-500' : 'text-light-accent dark:text-dark-accent hover:text-primary dark:hover:text-primary'}`}
        >
          {isListening ? <StopCircleIcon className="w-6 h-6" /> : <MicrophoneIcon className="w-6 h-6" />}
        </button>
        <button
          onClick={handleSend}
          disabled={isLoading || (!text.trim() && !file)}
          className="p-2.5 bg-primary text-white rounded-full disabled:bg-gray-300 dark:disabled:bg-dark-accent disabled:cursor-not-allowed ml-2 transition-colors"
        >
          <PaperAirplaneIcon className="w-6 h-6" />
        </button>
      </div>
      <p className="text-xs text-center text-light-accent dark:text-dark-accent mt-2">
        ThinkChat can make mistakes. Consider checking important information.
      </p>
    </div>
  );
};

export default ChatInput;
