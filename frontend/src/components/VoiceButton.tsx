"use client";

import { Mic, MicOff, Loader2 } from "lucide-react";
import { useState } from "react";

interface VoiceButtonProps {
  onTranscript: (text: string) => void;
}

export default function VoiceButton({ onTranscript }: VoiceButtonProps) {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(true);

  const startListening = () => {
    if (!("webkitSpeechRecognition" in window)) {
      setIsSupported(false);
      return;
    }

    const SpeechRecognition =
      (window as any).webkitSpeechRecognition ||
      (window as any).SpeechRecognition;

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      onTranscript(transcript);
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  if (!isSupported) {
    return (
      <p className="text-red-500 text-sm">
        Speech recognition not supported in this browser.
      </p>
    );
  }

  return (
    <button
      onClick={startListening}
      className={`flex items-center gap-2 px-6 py-3 rounded-full text-white transition
        ${
          isListening
            ? "bg-red-600 hover:bg-red-700"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
    >
      {isListening ? (
        <>
          <Loader2 className="animate-spin" size={18} />
          Listening...
        </>
      ) : (
        <>
          <Mic size={18} />
          Start Listening
        </>
      )}
    </button>
  );
}
