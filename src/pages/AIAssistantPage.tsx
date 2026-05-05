import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Bot, User, Trash2, Cpu, Mic, Sparkles, Wand2, FileText, ListChecks } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { chatWithAI } from '../services/ai';
import { cn } from '../lib/utils';
import { useNavigate } from 'react-router-dom';

import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../services/firebase';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export function AIAssistantPage() {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: `Hello ${profile?.name?.split(' ')[0]}! 👋 I'm CampusAI, grounded in your institution's syllabus and materials. How can I help you today?`, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const fetchGroundingContext = async () => {
    try {
      const materialsSnap = await getDocs(collection(db, 'materials'));
      const syllabusSnap = await getDocs(collection(db, 'syllabus'));

      const materials = materialsSnap.docs.map(doc => doc.data());
      const syllabus = syllabusSnap.docs.map(doc => doc.data());

      let context = "";
      if (syllabus.length > 0) {
        context += "SYLLABUS DATA:\n" + syllabus.map(s => `- ${s.subjectName}: Modules (${(s.modules || []).join(', ')})`).join('\n') + "\n\n";
      }
      if (materials.length > 0) {
        context += "COURSE MATERIALS:\n" + materials.map(m => `- ${m.title} (${m.subjectName}): ${m.content}`).join('\n') + "\n\n";
      }

      return context;
    } catch (err) {
      console.error("Error fetching context:", err);
      return "";
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { 
        role: 'user', 
        content: input, 
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const history = messages.map(m => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.content }]
      }));

      const context = await fetchGroundingContext();
      const rawResponse = await chatWithAI(input, history, context);
      const parts = rawResponse.split('|');
      const messageText = parts[0]?.trim();
      const commandStr = parts[1]?.trim();

      const assistantMessage: Message = {
        role: 'assistant',
        content: messageText || 'I am processing your request.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, assistantMessage]);

      if (commandStr) {
        try {
          const command = JSON.parse(commandStr);
          if (command.action === 'NAVIGATE') {
            setTimeout(() => navigate(command.path), 1500);
          }
        } catch (e) {
          console.error('Invalid command JSON', e);
        }
      }
    } catch (error) {
      console.error('AI Error:', error);
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.', timestamp: 'Now' }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="h-[calc(100vh-14rem)] flex flex-col gap-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
           <div className="w-12 h-12 bg-violet-600 rounded-2xl flex items-center justify-center shadow-lg shadow-violet-600/20">
              <Bot className="text-white w-7 h-7" />
           </div>
           <div>
              <h2 className="text-2xl font-bold">CampusAI Assistant</h2>
              <p className="text-zinc-500 text-sm">Powered by Gemini 1.5 Flash</p>
           </div>
        </div>
        <button 
           onClick={() => setMessages([messages[0]])}
           className="p-2 text-zinc-500 hover:text-red-400 transition-colors"
        >
           <Trash2 className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto bg-white/5 border border-white/10 rounded-[2.5rem] p-8 space-y-6 scrollbar-hide">
        {messages.map((msg, i) => (
          <motion.div
            initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20 }}
            animate={{ opacity: 1, x: 0 }}
            key={i}
            className={cn(
              "flex gap-4 max-w-[80%]",
              msg.role === 'user' ? "ml-auto flex-row-reverse" : "mr-auto"
            )}
          >
            <div className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
              msg.role === 'user' ? "bg-gradient-to-br from-violet-500 to-cyan-500" : "bg-white/10"
            )}>
              {msg.role === 'user' ? <User className="w-5 h-5 text-white" /> : <Bot className="w-5 h-5 text-violet-400" />}
            </div>
            <div className="space-y-1">
              <div className={cn(
                "p-5 rounded-[1.5rem]",
                msg.role === 'user' 
                  ? "bg-violet-600 text-white rounded-tr-none" 
                  : "bg-white/5 border border-white/10 text-zinc-200 rounded-tl-none pr-8"
              )}>
                <p className="text-sm leading-relaxed">{msg.content}</p>
              </div>
              <p className={cn("text-[10px] text-zinc-500 mt-1", msg.role === 'user' ? "text-right" : "text-left")}>
                {msg.timestamp}
              </p>
            </div>
          </motion.div>
        ))}
        {isTyping && (
          <div className="flex gap-4 max-w-[80%]">
             <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                <Bot className="w-5 h-5 text-violet-400" />
             </div>
             <div className="bg-white/5 border border-white/10 p-5 rounded-[1.5rem] rounded-tl-none">
                <div className="flex gap-1.5">
                   <div className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-bounce" />
                   <div className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                   <div className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                </div>
             </div>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {[
            { icon: Sparkles, text: 'Explain Quantum Computing' },
            { icon: Wand2, text: 'Summarize Algorithms material' },
            { icon: FileText, text: 'Generate SQL Quiz' },
            { icon: ListChecks, text: 'Show attendance' },
          ].map((action, i) => (
             <button 
                key={i}
                onClick={() => setInput(action.text)}
                className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-xs text-zinc-400 whitespace-nowrap hover:bg-white/10 hover:text-white transition-all"
             >
                <action.icon className="w-3.5 h-3.5" />
                {action.text}
             </button>
          ))}
        </div>
        <div className="relative group">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask me anything or give a command..."
            className="w-full bg-white/5 border border-white/10 rounded-[2rem] px-8 py-5 pr-32 focus:outline-none focus:border-violet-500/50 transition-all font-sans text-sm backdrop-blur-xl"
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
            <button 
                onClick={handleSend}
                disabled={!input.trim()}
                className="p-3 bg-violet-600 rounded-2xl text-white shadow-lg shadow-violet-600/20 hover:bg-violet-500 transition-colors disabled:opacity-50"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
