import React, { useState, useEffect, useRef } from 'react';
import { Mic } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const VoiceInput = ({ onTranscript, currentValue }) => {
  const { t, speechLocale } = useLanguage();
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
    recognition.lang = speechLocale;

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
  }, [speechLocale]);

  const toggleRecording = () => {
    if (!isSupported) {
      alert("Voice input is not supported in this browser. Please use Chrome or Edge.");
      return;
    }

    if (isRecording) {
      if (recognitionRef.current) recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      if (recognitionRef.current) {
        recognitionRef.current.lang = speechLocale;
        const startText = currentValue ? currentValue + (currentValue.endsWith(' ') ? '' : ' ') : '';
        
        recognitionRef.current.onresult = (event) => {
          let transcript = '';
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            transcript += event.results[i][0].transcript;
          }
          onTranscript(startText + transcript);
        };

        try {
          recognitionRef.current.start();
          setIsRecording(true);
        } catch (e) {
          console.error(e);
        }
      }
    }
  };

  if (!isSupported) return null;

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={toggleRecording}
        className={`flex items-center justify-center p-1.5 rounded-full transition-colors border cursor-pointer ${
          isRecording 
            ? 'bg-[#D64545]/10 border-[#D64545] text-[#D64545]' 
            : 'bg-[#F4F5F7] border-[#DDE1E7] text-[#14213D] hover:bg-[#e8ebf0]'
        }`}
        title="Voice Input"
      >
        <Mic className={`w-4 h-4 ${isRecording ? 'animate-pulse' : ''}`} />
      </button>
      <span className="text-[10px] sm:text-xs text-gray-500 font-sans italic">
        {isRecording ? (
          <span className="flex items-center gap-1 text-[#D64545] font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D64545] animate-ping"></span>
            {t('voice.listening')}
          </span>
        ) : (
          t('voice.tapToSpeak')
        )}
      </span>
    </div>
  );
};
