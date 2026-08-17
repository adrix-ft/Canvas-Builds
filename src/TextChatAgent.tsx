import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Loader2, Bot, User } from 'lucide-react';
import { supabase } from './supabaseClient';
import { useAppContext } from './AppContext';

type Message = {
  id: string;
  role: 'user' | 'model';
  text: string;
};

export const TextChatAgent = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'model', text: 'Hi! I am the Canvas Builds AI assistant. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { addToast } = useAppContext();

  // Scroll to bottom whenever messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  // Fetch the secure token from Supabase when the component mounts
  useEffect(() => {
    const fetchToken = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('gemini-token');
        if (error || !data) throw new Error("Failed to get token");
        setApiKey(data.token);
      } catch (err) {
        console.error("Failed to load chat infrastructure:", err);
      }
    };
    fetchToken();
  }, []);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    if (!apiKey) {
      addToast("Chat is still connecting to the server. Please wait a moment.", "info");
      return;
    }

    const userText = input.trim();
    setInput('');
    
    // Add user message to UI immediately
    const newMessages: Message[] = [
      ...messages, 
      { id: Date.now().toString(), role: 'user', text: userText }
    ];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      // 1. Filter out the initial greeting so the history strictly starts with a "user" role
      const apiMessages = newMessages.filter(msg => msg.id !== '1');

      const payload = {
        systemInstruction: { 
          role: "system", // Strict role definition
          parts: [{ text: "You are a helpful, friendly customer support agent for Canvas Builds. We sell premium React website templates for gifts and special occasions. Keep your answers brief, friendly, and concise." }] 
        },
        contents: apiMessages.map(msg => ({
          role: msg.role,
          parts: [{ text: msg.text }]
        }))
      };

      // 2. FIXED: Upgraded to Gemini 3.1 Flash-Lite for standard text generation
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      // 3. Intercept exact Google error messages
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Google API Rejected the Request:", errorData);
        throw new Error(errorData.error?.message || "API responded with an error");
      }
      
      const data = await response.json();
      const aiResponseText = data.candidates[0].content.parts[0].text;

      // Add AI response to UI
      setMessages(prev => [
        ...prev, 
        { id: (Date.now() + 1).toString(), role: 'model', text: aiResponseText }
      ]);

    } catch (err: any) {
      console.error("Chat Error:", err);
      setMessages(prev => [
        ...prev, 
        { id: Date.now().toString(), role: 'model', text: `Connection Error: ${err.message}` }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-28 z-50 flex flex-col items-end">
      {/* The Chat Window */}
      {isOpen && (
        <div className="mb-4 w-[90vw] sm:w-[350px] bg-white dark:bg-slate-900 border border-[var(--color-bg-secondary)] dark:border-slate-800 shadow-2xl rounded-2xl flex flex-col overflow-hidden origin-bottom-right animate-in fade-in slide-in-from-bottom-5">
          
          {/* Header */}
          <div className="bg-[var(--color-bg-secondary)] dark:bg-slate-800 p-4 flex justify-between items-center border-b border-black/5 dark:border-white/5">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[var(--color-accent-mint)] animate-pulse"></div>
              <h3 className="font-bold text-[var(--color-text-primary)] text-sm">Support Chat</h3>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-[var(--color-text-primary)]/60 hover:text-[var(--color-text-primary)] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Message Area */}
          <div className="flex-1 h-[350px] overflow-y-auto p-4 flex flex-col gap-4 bg-[var(--color-bg-primary)]/30 dark:bg-slate-950/30">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm ${msg.role === 'user' ? 'bg-[var(--color-accent-purple)] text-white' : 'bg-white dark:bg-slate-800 text-[var(--color-text-primary)] border border-black/5 dark:border-white/5'}`}>
                  {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4 text-[var(--color-accent-mint)]" />}
                </div>
                <div className={`max-w-[75%] p-3 rounded-2xl text-sm shadow-sm ${msg.role === 'user' ? 'bg-[var(--color-accent-purple)] text-white rounded-tr-sm' : 'bg-white dark:bg-slate-800 text-[var(--color-text-primary)] border border-black/5 dark:border-white/5 rounded-tl-sm'}`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-2 flex-row">
                <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm bg-white dark:bg-slate-800 border border-black/5 dark:border-white/5">
                  <Bot className="w-4 h-4 text-[var(--color-accent-mint)]" />
                </div>
                <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl rounded-tl-sm shadow-sm border border-black/5 dark:border-white/5 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-[var(--color-text-primary)]/40 rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-[var(--color-text-primary)]/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                  <span className="w-1.5 h-1.5 bg-[var(--color-text-primary)]/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={handleSend} className="p-3 bg-white dark:bg-slate-900 border-t border-[var(--color-bg-secondary)] dark:border-slate-800 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 bg-[var(--color-bg-primary)] dark:bg-slate-950 border border-[var(--color-bg-secondary)] dark:border-slate-800 rounded-xl px-4 py-2 text-sm text-[var(--color-text-primary)] outline-none focus:border-[var(--color-accent-purple)] transition-colors"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="w-10 h-10 bg-[var(--color-accent-purple)] hover:bg-[#6b46c1] text-white rounded-xl flex items-center justify-center shrink-0 transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4 ml-0.5" />}
            </button>
          </form>
        </div>
      )}

      {/* Floating Action Button */}
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          className="w-16 h-16 bg-white dark:bg-slate-800 text-[var(--color-text-primary)] border border-[var(--color-bg-secondary)] dark:border-slate-700 hover:border-[var(--color-accent-purple)] rounded-full flex items-center justify-center shadow-2xl transition-all hover:scale-105 cursor-pointer"
        >
          <MessageSquare className="w-7 h-7 text-[var(--color-accent-purple)]" />
        </button>
      )}
    </div>
  );
};