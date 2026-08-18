import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff } from 'lucide-react';

export const VoiceInput = ({ onTranscript, currentValue }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setIsSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      let finalTranscript = '';
      let interimTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }

      // If there's a final transcript, append it. If interim, show it (temporarily replacing).
      // A common pattern is just combining the currentValue with the new final text.
      // For simplicity, we just pass back the final+interim if we want live typing, 
      // but it's tricky to mix typing and speaking. 
      // Instead, we just pass the new chunk back and let the parent append or replace.
      
      // Let's just do a simple replacement for the demo: 
      // the voice session fully replaces or appends to the text.
      // Actually, standard behavior: append to existing text.
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error", event.error);
      setIsRecording(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const toggleRecording = () => {
    if (!isSupported) {
      alert("Voice input is not supported in this browser. Please use Chrome or Edge.");
      return;
    }

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      // Start fresh or append? Let's just listen and append.
      // To properly append without losing interim results, we can keep track of what the text was BEFORE we started recording.
      const startText = currentValue ? currentValue + (currentValue.endsWith(' ') ? '' : ' ') : '';
      
      recognitionRef.current.onresult = (event) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          transcript += event.results[i][0].transcript;
        }
        // Send the combined text back to the parent
        onTranscript(startText + transcript);
      };

      recognitionRef.current.start();
      setIsRecording(true);
    }
  };

  if (!isSupported) return null;

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={toggleRecording}
        className={`flex items-center justify-center p-1.5 rounded-full transition-colors border ${
          isRecording 
            ? 'bg-[#D64545]/10 border-[#D64545] text-[#D64545]' 
            : 'bg-[#F4F5F7] border-[#DDE1E7] text-[#14213D] hover:bg-[#e8ebf0]'
        }`}
        title="Voice Input"
      >
        {isRecording ? <Mic className="w-4 h-4 animate-pulse" /> : <Mic className="w-4 h-4" />}
      </button>
      <span className="text-[10px] sm:text-xs text-gray-500 font-sans italic">
        {isRecording ? (
          <span className="flex items-center gap-1 text-[#D64545] font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D64545] animate-ping"></span>
            Listening... (Tap to stop)
          </span>
        ) : (
          'Tap to speak instead of typing'
        )}
      </span>
    </div>
  );
};
