import type { ComponentType } from 'react';

export interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  image?: string; // base64 encoded image
  fileName?: string;
}

export interface AIPersonality {
  name: string;
  prompt: string;
  // FIX: Use imported ComponentType instead of React.ComponentType to resolve namespace error.
  icon: ComponentType<{ className?: string }>;
}

export type FileWithPreview = File & { preview: string };
