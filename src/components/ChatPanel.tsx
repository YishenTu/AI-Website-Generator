import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, UserType, AIModel } from '../types/types';
import { ModelSelector } from './ModelSelector';

interface ChatPanelProps {
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  onStop: () => void;
  chatModel?: AIModel;
  onChatModelChange?: (model: AIModel) => void;
  isChatAvailable?: boolean;
  title?: string;
}

const PaperAirplaneIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
    <path d="M3.105 3.105a.75.75 0 0 1 .815-.31L18.38 7.24a.75.75 0 0 1 0 1.32l-14.46 4.445a.75.75 0 0 1-.815-.31L.055 9.445a.75.75 0 0 1 .229-1.009L3.105 3.105Z" />
    <path d="M4.215 9.25a.75.75 0 0 1 .229-1.009L10.5 3.105a.75.75 0 0 1 .815.31L18.38 7.24a.75.75 0 0 1 0 1.32l-14.46 4.445a.75.75 0 0 1-.815-.31L.055 9.445a.75.75 0 0 1 .229-1.009l3.93-3.93Z" />
  </svg>
);

const StopIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
    <path fillRule="evenodd" d="M2 5a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3V5zm2 0a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5z" clipRule="evenodd" />
  </svg>
);

export const ChatPanel: React.FC<ChatPanelProps> = ({ 
  messages, 
  onSendMessage, 
  isLoading, 
  onStop, 
  chatModel = AIModel.Gemini,
  onChatModelChange,
  isChatAvailable = true,
  title
}) => {
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim() && !isLoading && isChatAvailable) {
      onSendMessage(inputText);
      setInputText('');
    }
  };

  const isInputDisabled = isLoading || !isChatAvailable;
  
  const getPlaceholderText = () => {
    if (isLoading) return "AI is thinking...";
    if (!isChatAvailable) return "Generating website...";
    return "Describe your changes...";
  };

  return (
    <div className="flex flex-col bg-slate-800 p-4 rounded-lg shadow-lg h-full">
      <div className="flex flex-col items-center mb-3 flex-shrink-0">
        <h2 className="text-xl font-semibold text-sky-400 mb-3">{title || "Refine Website with Chat"}</h2>
        {onChatModelChange && (
          <div className="w-full flex justify-center pb-2 border-b border-slate-700/50">
            <ModelSelector
              selectedModel={chatModel}
              onModelChange={onChatModelChange}
              disabled={isInputDisabled}
              size="small"
            />
          </div>
        )}
      </div>
      
      <div className="flex-grow overflow-y-auto mb-3 pr-1 space-y-3 custom-scrollbar">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === UserType.User ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] p-2.5 rounded-lg text-sm shadow
                ${msg.sender === UserType.User
                  ? 'bg-sky-600 text-white rounded-br-none'
                  : 'bg-slate-700 text-slate-200 rounded-bl-none'
                }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSubmit} className="flex-shrink-0 mt-auto pt-2 border-t border-slate-700/50">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={getPlaceholderText()}
            className="flex-grow p-2.5 bg-slate-700 text-slate-200 border border-slate-600 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-sm"
            disabled={isInputDisabled}
            aria-label="Chat message input"
          />
          {isLoading ? (
             <button
                type="button"
                onClick={onStop}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 px-3 rounded-md flex items-center justify-center transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-slate-800"
                aria-label="Stop refinement"
            >
                <StopIcon className="w-5 h-5" />
            </button>
          ) : (
            <button
                type="submit"
                disabled={isInputDisabled || !inputText.trim()}
                className="bg-sky-600 hover:bg-sky-700 disabled:bg-slate-600 text-white font-semibold py-2.5 px-3 rounded-md flex items-center justify-center transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-slate-800"
                aria-label="Send chat message"
            >
                <PaperAirplaneIcon className="w-5 h-5" />
            </button>
          )}
        </div>
      </form>
    </div>
  );
};
