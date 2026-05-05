import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { cn } from '../lib/utils';

export function useVoice() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);

  const speak = useCallback((text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  }, []);

  const listen = useCallback(() => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Speech recognition not supported');
      return;
    }

    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (event: any) => {
      const result = event.results[0][0].transcript;
      setTranscript(result);
    };

    recognition.start();
  }, []);

  return { isListening, transcript, listen, speak, isSpeaking, setTranscript };
}

export function VoiceButton({ onResult }: { onResult: (text: string) => void }) {
  const { isListening, transcript, listen, setTranscript } = useVoice();

  useEffect(() => {
    if (transcript) {
      onResult(transcript);
      setTranscript('');
    }
  }, [transcript, onResult, setTranscript]);

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-4">
      <AnimatePresence>
        {isListening && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="bg-black/80 backdrop-blur-md px-6 py-2 rounded-full border border-violet-500/30 text-white font-medium"
          >
            Listening...
          </motion.div>
        )}
      </AnimatePresence>
      
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={listen}
        className={cn(
          "w-16 h-16 rounded-full flex items-center justify-center shadow-lg transition-colors border-2",
          isListening 
            ? "bg-red-500 border-red-300 animate-pulse" 
            : "bg-violet-600 border-violet-400 hover:bg-violet-500"
        )}
      >
        {isListening ? <MicOff className="text-white w-8 h-8" /> : <Mic className="text-white w-8 h-8" />}
      </motion.button>
    </div>
  );
}
