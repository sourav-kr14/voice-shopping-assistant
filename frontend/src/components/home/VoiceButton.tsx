"use client";

import { Mic, Square, Globe } from "lucide-react";
import { useState, useEffect, useRef } from "react";

interface VoiceButtonProps {
  onTranscript: (text: string) => void | Promise<void>;
  isLoading?: boolean;
}

const supportedLanguages = [
  { label: "English (US)", code: "en-US" },
  { label: "English (India)", code: "en-IN" },
  { label: "Hindi", code: "hi-IN" },
  { label: "German", code: "de-DE" },
];

export default function VoiceButton({
  onTranscript,
  isLoading = false,
}: VoiceButtonProps) {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const [language, setLanguage] = useState("en-IN");

  const recognitionRef = useRef<any>(null);
  const callbackRef = useRef(onTranscript);

  useEffect(() => {
    callbackRef.current = onTranscript;
  }, [onTranscript]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const SpeechRecognition =
      (window as any).webkitSpeechRecognition ||
      (window as any).SpeechRecognition;

    if (!SpeechRecognition) {
      setIsSupported(false);
      return;
    }

    recognitionRef.current?.stop();

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = language;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);

    recognition.onerror = () => setIsListening(false);

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      callbackRef.current(transcript);
    };

    recognitionRef.current = recognition;

    return () => recognition.stop();
  }, [language]);

  const toggleListening = () => {
    if (!recognitionRef.current || isLoading) return;

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      try {
        recognitionRef.current.start();
      } catch (err) {
        console.error("Mic start failed:", err);
      }
    }
  };

  if (!isSupported) {
    return (
      <div className="text-amber-700 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/30 px-6 py-3 rounded-xl text-xs font-semibold border border-amber-200 dark:border-amber-800 text-center">
        Voice commands not supported in this browser.
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Suppport Multillingial */}
      <div className="flex items-center gap-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 px-3 py-2 rounded-xl shadow-sm">
        <Globe
          size={14}
          className="text-gray-500 dark:text-gray-400"
        />

        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="bg-transparent text-sm outline-none text-gray-700 dark:text-gray-200 cursor-pointer"
        >
          {supportedLanguages.map((lang) => (
            <option
              key={lang.code}
              value={lang.code}
            >
              {lang.label}
            </option>
          ))}
        </select>
      </div>

      {/* Voice Button */}
      <button
        onClick={toggleListening}
        disabled={isLoading}
        className={`
          flex items-center gap-2 px-6 py-3 rounded-full
          text-sm font-semibold
          transition-all duration-300
          shadow-md
          ${
            isListening
              ? "bg-red-500 hover:bg-red-600 text-white scale-105"
              : "bg-emerald-500 hover:bg-emerald-600 text-white"
          }
          disabled:opacity-50 disabled:cursor-not-allowed
        `}
      >
        {isListening ? (
          <>
            <Square
              size={18}
              fill="white"
            />
            Listening...
          </>
        ) : (
          <>
            <Mic size={18} />
            Start Listening
          </>
        )}
      </button>

      {/* Loading State */}
      {isLoading && (
        <div className="text-xs text-gray-500 dark:text-gray-400 animate-pulse">
          Processing...
        </div>
      )}
    </div>
  );
}
