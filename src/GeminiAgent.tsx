import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Loader2 } from 'lucide-react';
import { supabase } from './supabaseClient';
import { AudioStreamer } from './lib/audioStreamer';
import { useAppContext } from './AppContext';

export const GeminiAgent = () => {
  const [status, setStatus] = useState<'idle' | 'connecting' | 'connected'>('idle');
  const { addToast } = useAppContext();
  
  const wsRef = useRef<WebSocket | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const audioStreamerRef = useRef<AudioStreamer | null>(null);

  const systemInstruction = {
    parts: [{ text: "You are a helpful, high-energy voice assistant for Canvas Builds. We sell premium React website templates. Keep your answers brief, friendly, and concise." }]
  };

  const startConversation = async () => {
    setStatus('connecting');
    let isSetupComplete = false;

    try {
      const { data, error } = await supabase.functions.invoke('gemini-token');
      if (error || !data) throw new Error("Failed to get token");

      audioStreamerRef.current = new AudioStreamer();
      audioStreamerRef.current.init();

      const endpoint = data.wsEndpoint.replace('v1alpha', 'v1beta');
      const ws = new WebSocket(`${endpoint}?key=${data.token}`);
      wsRef.current = ws;

      ws.onopen = async () => {
        // 1. Send the setup configuration FIRST
        ws.send(JSON.stringify({
          setup: {
            model: "models/gemini-3.1-flash-live-preview", 
            systemInstruction: systemInstruction,
            generationConfig: {
              responseModalities: ["AUDIO"],
              speechConfig: {
                voiceConfig: {
                  prebuiltVoiceConfig: {
                    voiceName: "Aoede" 
                  }
                }
              }
            }
          }
        }));

        // 2. Start the Microphone
        const stream = await navigator.mediaDevices.getUserMedia({ audio: {
            channelCount: 1,
            sampleRate: 16000,
        }});
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

            // Buffer audio to prevent flooding the WebSocket (send every ~150ms)
            if (audioBuffer.length >= 2400) {
              const chunk = new Int16Array(audioBuffer).buffer;
              audioBuffer = []; // Clear the buffer
              const base64Data = arrayBufferToBase64(chunk);
              
              ws.send(JSON.stringify({
                realtimeInput: {
                  audio: {
                    mimeType: "audio/pcm;rate=16000",
                    data: base64Data
                  }
                }
              }));
            }
          }
        };

        source.connect(workletNode);
        setStatus('connected');
      };

      ws.onmessage = async (event) => {
        let response;
        try {
          // Read the binary Blob as text before parsing to JSON
          const textData = event.data instanceof Blob ? await event.data.text() : event.data;
          response = JSON.parse(textData);
        } catch (e) {
          console.error("Error parsing message data:", e);
          return;
        }

        // Catch explicit API errors (e.g. invalid API key, quota exceeded)
        if (response.error) {
          console.error("Gemini API Error:", response.error);
          addToast("AI Error: " + response.error.message, "info");
          stopConversation();
          return;
        }
        
        // 3. Listen for the server's setupComplete signal
        if (response.setupComplete) {
          isSetupComplete = true; // Open the microphone gates!
          
          // NOW send the initial prompt so it speaks to you first
          ws.send(JSON.stringify({
            clientContent: {
              turns: [{
                role: "user",
                parts: [{ text: "Hello! Introduce yourself briefly and ask how you can help." }]
              }],
              turnComplete: true
            }
          }));
        }

        // 4. Play incoming audio chunks from Gemini
        if (response.serverContent?.modelTurn?.parts) {
          const parts = response.serverContent.modelTurn.parts;
          for (const part of parts) {
            if (part.inlineData?.data) {
              audioStreamerRef.current?.playChunk(part.inlineData.data);
            }
          }
        }
      };

      ws.onerror = (err) => {
        console.error("WebSocket Error:", err);
        addToast("Connection to AI agent lost.", "info");
        stopConversation();
      };

      ws.onclose = (event) => {
        console.log("WebSocket Closed:", event.code, event.reason);
        stopConversation();
      };

    } catch (err: any) {
      console.error("Failed to start conversation:", err);
      addToast("Failed to start voice agent.", "info");
      stopConversation();
    }
  };

  const stopConversation = () => {
    setStatus('idle');
    
    // Safely close WebSocket if it's still open
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.close();
    }
    
    // Safely close AudioContext only if it isn't already closed
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close().catch(console.error);
    }
    
    mediaStreamRef.current?.getTracks().forEach(track => track.stop());
    audioStreamerRef.current?.stop();
  };

  const arrayBufferToBase64 = (buffer: ArrayBuffer) => {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  };

  useEffect(() => {
    return () => stopConversation();
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {status === 'idle' ? (
        <button 
          onClick={startConversation}
          className="w-16 h-16 bg-[var(--color-text-primary)] hover:bg-[var(--color-accent-mint)] text-white rounded-full flex items-center justify-center shadow-2xl transition-all cursor-pointer"
        >
          <Mic className="w-8 h-8" />
        </button>
      ) : (
        <button 
          onClick={stopConversation}
          className="w-16 h-16 bg-rose-500 hover:bg-rose-600 text-white rounded-full flex items-center justify-center shadow-2xl transition-all animate-pulse cursor-pointer"
        >
          {status === 'connecting' ? <Loader2 className="w-8 h-8 animate-spin" /> : <Square className="w-6 h-6 fill-current" />}
        </button>
      )}
    </div>
  );
};