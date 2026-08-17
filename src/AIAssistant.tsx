import React, { useState, useRef, useEffect } from 'react';
import { 
  MessageSquare, 
  X, 
  Send, 
  Loader2, 
  Bot, 
  User, 
  Headphones, 
  MessageCircle,
  Square 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from './supabaseClient';
import { useAppContext } from './AppContext';
import { AudioStreamer } from './lib/audioStreamer';

type Message = {
  id: string;
  role: 'user' | 'model';
  text: string;
};

export const AIAssistant = () => {
  const { addToast } = useAppContext();
  
  // -- GLOBAL UI STATE --
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeMode, setActiveMode] = useState<'none' | 'voice' | 'text'>('none');
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [wsEndpoint, setWsEndpoint] = useState<string | null>(null);

  // -- VOICE STATE & REFS --
  const [voiceStatus, setVoiceStatus] = useState<'idle' | 'connecting' | 'connected'>('idle');
  const wsRef = useRef<WebSocket | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const audioStreamerRef = useRef<AudioStreamer | null>(null);

  // -- TEXT STATE & REFS --
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'model', text: 'Hi! I am the Canvas Builds AI assistant. How can I help you find the perfect React template today?' }
  ]);
  const [input, setInput] = useState('');
  const [isTextLoading, setIsTextLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const systemInstructionText = "You are a helpful, friendly customer support agent for Canvas Builds. We sell premium React website templates for gifts and special occasions. Keep your answers brief, friendly, and concise.";

  // Fetch the secure token from Supabase on mount
  useEffect(() => {
    const fetchToken = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('gemini-token');
        if (error || !data) throw new Error("Failed to get token");
        setApiKey(data.token);
        setWsEndpoint(data.wsEndpoint.replace('v1alpha', 'v1beta'));
      } catch (err) {
        console.error("Failed to load chat infrastructure:", err);
      }
    };
    fetchToken();
  }, []);

  // Scroll to bottom of text chat whenever messages update
  useEffect(() => {
    if (activeMode === 'text') {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, activeMode, isTextLoading]);

  // FIXED: Empty dependency array ensures cleanup ONLY runs when component unmounts
  useEffect(() => {
    return () => {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.close();
      }
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close().catch(console.error);
      }
      mediaStreamRef.current?.getTracks().forEach(track => track.stop());
      audioStreamerRef.current?.stop();
    };
  }, []);

  const arrayBufferToBase64 = (buffer: ArrayBuffer) => {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  };

  // ==========================================
  // VOICE AGENT LOGIC (WebSockets)
  // ==========================================
  const startVoiceConversation = async () => {
    setIsMenuOpen(false);
    setActiveMode('voice');
    setVoiceStatus('connecting');
    let isSetupComplete = false;

    try {
      if (!apiKey || !wsEndpoint) throw new Error("API Key not loaded yet");

      audioStreamerRef.current = new AudioStreamer();
      audioStreamerRef.current.init();

      const ws = new WebSocket(`${wsEndpoint}?key=${apiKey}`);
      wsRef.current = ws;

      ws.onopen = async () => {
        ws.send(JSON.stringify({
          setup: {
            model: "models/gemini-3.1-flash-live-preview",
            systemInstruction: { parts: [{ text: systemInstructionText }] },
            generationConfig: {
              responseModalities: ["AUDIO"],
              speechConfig: {
                voiceConfig: { prebuiltVoiceConfig: { voiceName: "Aoede" } }
              }
            }
          }
        }));

        const stream = await navigator.mediaDevices.getUserMedia({ audio: { channelCount: 1, sampleRate: 16000 }});
        mediaStreamRef.current = stream;

        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
        audioContextRef.current = audioCtx;

        await audioCtx.audioWorklet.addModule('/audio-recorder-worklet.js');
        const source = audioCtx.createMediaStreamSource(stream);
        const workletNode = new AudioWorkletNode(audioCtx, 'audio-recorder-worklet');

        let audioBuffer: number[] = [];

        workletNode.port.onmessage = (event) => {
          if (ws.readyState === WebSocket.OPEN && isSetupComplete) {
            const pcm16 = new Int16Array(event.data);
            audioBuffer.push(...pcm16);

            if (audioBuffer.length >= 2400) {
              const chunk = new Int16Array(audioBuffer).buffer;
              audioBuffer = []; 
              const base64Data = arrayBufferToBase64(chunk); // FIXED: Safer base64 conversion restored
              
              ws.send(JSON.stringify({
                realtimeInput: {
                  audio: { mimeType: "audio/pcm;rate=16000", data: base64Data }
                }
              }));
            }
          }
        };

        source.connect(workletNode);
        setVoiceStatus('connected');
      };

      ws.onmessage = async (event) => {
        let response;
        try {
          const textData = event.data instanceof Blob ? await event.data.text() : event.data;
          response = JSON.parse(textData);
        } catch (e) {
          return;
        }

        if (response.error) {
          addToast("AI Error: " + response.error.message, "info");
          stopVoiceConversation();
          return;
        }
        
        if (response.setupComplete) {
          isSetupComplete = true; 
          ws.send(JSON.stringify({
            clientContent: {
              turns: [{ role: "user", parts: [{ text: "Hello! Introduce yourself briefly and ask how you can help." }] }],
              turnComplete: true
            }
          }));
        }

        if (response.serverContent?.modelTurn?.parts) {
          for (const part of response.serverContent.modelTurn.parts) {
            if (part.inlineData?.data) {
              audioStreamerRef.current?.playChunk(part.inlineData.data);
            }
          }
        }
      };

      ws.onerror = () => {
        addToast("Connection to AI agent lost.", "info");
        stopVoiceConversation();
      };

      ws.onclose = () => {
        stopVoiceConversation();
      };

    } catch (err: any) {
      addToast("Failed to start voice agent.", "info");
      stopVoiceConversation();
    }
  };

  const stopVoiceConversation = () => {
    setVoiceStatus('idle');
    setActiveMode('none');
    
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.close();
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close().catch(console.error);
    }
    
    mediaStreamRef.current?.getTracks().forEach(track => track.stop());
    audioStreamerRef.current?.stop();
  };

  // ==========================================
  // TEXT AGENT LOGIC (REST API)
  // ==========================================
  const startTextConversation = () => {
    setIsMenuOpen(false);
    setActiveMode('text');
  };

  const handleSendText = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTextLoading) return;
    if (!apiKey) {
      addToast("Chat is connecting. Please wait.", "info");
      return;
    }

    const userText = input.trim();
    setInput('');
    
    const newMessages: Message[] = [...messages, { id: Date.now().toString(), role: 'user', text: userText }];
    setMessages(newMessages);
    setIsTextLoading(true);

    try {
      const apiMessages = newMessages.filter(msg => msg.id !== '1');
      const payload = {
        systemInstruction: { role: "system", parts: [{ text: systemInstructionText }] },
        contents: apiMessages.map(msg => ({ role: msg.role, parts: [{ text: msg.text }] }))
      };

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || "API error");
      }
      
      const data = await response.json();
      const aiResponseText = data.candidates[0].content.parts[0].text;

      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'model', text: aiResponseText }]);
    } catch (err: any) {
      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'model', text: `Error: ${err.message}` }]);
    } finally {
      setIsTextLoading(false);
    }
  };

  const closeTextChat = () => {
    setActiveMode('none');
  };

  // ==========================================
  // RENDER
  // ==========================================
  return (
    <div className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-[100] flex flex-col items-end pointer-events-none">
      <AnimatePresence>
        
        {/* --- 1. THE SELECTION MENU --- */}
        {isMenuOpen && activeMode === 'none' && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="mb-4 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-[var(--color-bg-secondary)] shadow-2xl rounded-[1.5rem] p-3 flex flex-col gap-2 min-w-[280px] pointer-events-auto origin-bottom-right"
          >
            <div className="px-3 py-2 border-b border-[var(--color-bg-secondary)] flex justify-between items-center">
              <div>
                <h4 className="font-bold text-[var(--color-text-primary)] text-sm flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-500 dark:bg-blue-400 animate-pulse"></span>
                  AI Assistant
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-1">
                  How would you like to chat?
                </p>
              </div>
              <button onClick={() => setIsMenuOpen(false)} className="p-1 hover:bg-[var(--color-bg-secondary)] rounded-full transition-colors text-[var(--color-text-primary)]/60 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <button
              onClick={startVoiceConversation}
              className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-[var(--color-bg-secondary)] transition-colors text-left group cursor-pointer"
            >
              <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <Headphones className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-[var(--color-text-primary)] text-[13px]">Talk with AI Agent</div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Click to start live voice chat</div>
              </div>
            </button>
            
            <button
              onClick={startTextConversation}
              className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-[var(--color-bg-secondary)] transition-colors text-left group cursor-pointer"
            >
              <div className="w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0 transition-colors group-hover:bg-emerald-600 group-hover:text-white flex items-center justify-center">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-[var(--color-text-primary)] text-[13px]">Text with AI Agent</div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Chat with our smart assistant</div>
              </div>
            </button>
          </motion.div>
        )}

        {/* --- 2. THE TEXT CHAT WINDOW --- */}
        {activeMode === 'text' && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed sm:absolute bottom-0 right-0 sm:bottom-[80px] sm:right-0 z-[110] w-full h-[85dvh] sm:w-[380px] sm:h-[600px] bg-white dark:bg-slate-900 sm:rounded-2xl rounded-t-3xl border-t sm:border border-[var(--color-bg-secondary)] dark:border-slate-800 shadow-2xl flex flex-col overflow-hidden pointer-events-auto origin-bottom-right"
          >
            {/* Chat Header */}
            <div className="bg-[var(--color-bg-secondary)] dark:bg-slate-800 p-4 flex justify-between items-center border-b border-black/5 dark:border-white/5 shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[var(--color-accent-mint)] animate-pulse"></div>
                <h3 className="font-bold text-[var(--color-text-primary)] text-sm">Canvas Builds AI</h3>
              </div>
              <button onClick={closeTextChat} className="text-[var(--color-text-primary)]/60 hover:text-[var(--color-text-primary)] p-1 rounded-full transition-colors cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 bg-[var(--color-bg-primary)]/30 dark:bg-slate-950/30">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex gap-2 w-full ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm mt-auto ${msg.role === 'user' ? 'bg-[var(--color-accent-purple)] text-white' : 'bg-white dark:bg-slate-800 text-[var(--color-text-primary)] border border-black/5 dark:border-white/5'}`}>
                    {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4 text-[var(--color-accent-mint)]" />}
                  </div>
                  <div className={`max-w-[75%] p-3.5 text-sm shadow-sm leading-relaxed ${msg.role === 'user' ? 'bg-[var(--color-accent-purple)] text-white rounded-2xl rounded-tr-sm' : 'bg-white dark:bg-slate-800 text-[var(--color-text-primary)] border border-black/5 dark:border-white/5 rounded-2xl rounded-tl-sm'}`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isTextLoading && (
                <div className="flex gap-2 flex-row w-full">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm bg-white dark:bg-slate-800 border border-black/5 dark:border-white/5 mt-auto">
                    <Bot className="w-4 h-4 text-[var(--color-accent-mint)]" />
                  </div>
                  <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl rounded-tl-sm shadow-sm border border-black/5 dark:border-white/5 flex items-center gap-1.5 h-10">
                    <span className="w-1.5 h-1.5 bg-[var(--color-text-primary)]/40 rounded-full animate-bounce"></span>
                    <span className="w-1.5 h-1.5 bg-[var(--color-text-primary)]/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-1.5 h-1.5 bg-[var(--color-text-primary)]/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Form */}
            <form onSubmit={handleSendText} className="p-3 bg-white dark:bg-slate-900 border-t border-[var(--color-bg-secondary)] dark:border-slate-800 flex gap-2 shrink-0 pb-[env(safe-area-inset-bottom,12px)]">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 bg-[var(--color-bg-primary)] dark:bg-slate-950 border border-[var(--color-bg-secondary)] dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm text-[var(--color-text-primary)] outline-none focus:border-[var(--color-accent-purple)] transition-colors"
                disabled={isTextLoading}
              />
              <button
                type="submit"
                disabled={!input.trim() || isTextLoading}
                className="w-11 h-11 bg-[var(--color-accent-purple)] hover:bg-[#6b46c1] text-white rounded-xl flex items-center justify-center shrink-0 transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
              >
                {isTextLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4 ml-0.5" />}
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- 3. THE FLOATING ACTION BUTTON --- */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        onClick={() => {
          if (activeMode === 'voice') {
            stopVoiceConversation();
          } else if (activeMode === 'text') {
            closeTextChat();
          } else {
            setIsMenuOpen(!isMenuOpen);
          }
        }}
        className={`w-14 h-14 rounded-full flex items-center justify-center shadow-2xl border-2 border-transparent hover:scale-110 transition-transform group relative pointer-events-auto cursor-pointer z-[120] ${
          activeMode === 'voice' 
            ? "bg-rose-500 shadow-rose-500/40 text-white" 
            : activeMode === 'text'
            ? "bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] hidden sm:flex"
            : "bg-[var(--color-text-primary)] text-[var(--color-bg-primary)] shadow-black/20 dark:shadow-black/60"
        }`}
      >
        <div className={`absolute inset-0 rounded-full ${activeMode === 'voice' ? "bg-rose-500" : "bg-[var(--color-bg-primary)]"} opacity-30 ${activeMode === 'voice' ? "animate-ping" : ""}`}></div>
        
        {activeMode === 'voice' ? (
          voiceStatus === 'connecting' ? <Loader2 className="w-6 h-6 relative z-10 animate-spin" /> : <Square className="w-5 h-5 relative z-10 fill-current" />
        ) : activeMode === 'text' || isMenuOpen ? (
          <X className="w-6 h-6 relative z-10" />
        ) : (
          <MessageCircle className="w-6 h-6 relative z-10" />
        )}
      </motion.button>
    </div>
  );
};