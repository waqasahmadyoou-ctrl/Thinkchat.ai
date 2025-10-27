
import React from 'react';

const ThinkChatIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2C6.477 2 2 6.477 2 12C2 17.523 6.477 22 12 22C17.523 22 22 17.523 22 12C22 6.477 17.523 2 12 2Z" fill="currentColor" opacity="0.1"/>
        <path d="M12 7V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M9 10L12 7L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M17 14H16C15.4477 14 15 14.4477 15 15V16C15 16.5523 15.4477 17 16 17H17C17.5523 17 18 16.5523 18 16V15C18 14.4477 17.5523 14 17 14Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M7 14H8C8.55228 14 9 14.4477 9 15V16C9 16.5523 8.55228 17 8 17H7C6.44772 17 6 16.5523 6 16V15C6 14.4477 6.44772 14 7 14Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

export default ThinkChatIcon;
