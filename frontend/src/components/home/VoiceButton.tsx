"use client";

import { Mic, Loader2, Square } from "lucide-react";
import { useState, useEffect, useRef } from "react";

interface VoiceButtonProps {
  onTranscript: (text: string) => void;
}

export default function VoiceButton({ onTranscript }: VoiceButtonProps) {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition = 
      (window as any).webkitSpeechRecognition || 
      (window as any).SpeechRecognition;

    if (!SpeechRecognition) {
      setIsSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    
    recognition.onerror = (event: any) => {
      console.error("Speech Recognition Error:", event.error);
      setIsListening(false);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      onTranscript(transcript);
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) recognitionRef.current.stop();
    };
  }, [onTranscript]);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      try {
        recognitionRef.current?.start();
      } catch (err) {
        console.error("Mic start failed:", err);
      }
    }
  };

  if (!isSupported) {
    return (
      <div className="text-amber-600 bg-amber-50 px-6 py-3 rounded-2xl text-xs font-bold border border-amber-100 text-center">
        Voice commands not supported in this browser.
      </div>
    );
  }

  return (
    <button
      onClick={toggleListening}
      className={`
        flex items-center gap-3 px-8 py-4 rounded-full font-bold transition-all duration-300
        ${isListening 
          ? "bg-red-500 text-white shadow-lg shadow-red-200 animate-pulse scale-105" 
          : "bg-[#6366F1] text-white hover:bg-[#4F46E5] shadow-xl shadow-indigo-100 hover:-translate-y-1 active:scale-95"
        }
      `}
    >
      {isListening ? (
        <>
          <Square size={20} fill="white" className="animate-scale" />
          <span className="tracking-tight">Stop Listening</span>
        </>
      ) : (
        <>
          <Mic size={20} strokeWidth={2.5} />
          <span className="tracking-tight">Start Listening</span>
        </>
      )}
    </button>
  );
}