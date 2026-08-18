import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User, Sparkles, ChevronRight, PhoneCall, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { getComplaintById } from '../../services/complaintService';

export const CivicChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: 'Hello! I am CivicBot, your AI Municipal Assistant. How can I help you today?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSend = async (textToSend) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsTyping(true);

    // Simulate AI response logic
    setTimeout(async () => {
      let botResponse = '';
      const q = query.toLowerCase();

      // Check if query looks like a complaint ID e.g. CR-1048
      const match = query.match(/CR-\d+/i);
      if (match) {
        const id = match[0].toUpperCase();
        try {
          const complaint = await getComplaintById(id);
          botResponse = `🔍 Complaint **${complaint.id}** (${complaint.title})\n• Category: ${complaint.category}\n• Status: **${complaint.status}**\n• Department: ${complaint.department_name}\n• Location: ${complaint.location}`;
        } catch (err) {
          botResponse = `⚠️ Could not find complaint record for ID "${id}". Please check the reference number and try again.`;
        }
      } else if (q.includes('pothole') || q.includes('report') || q.includes('how to')) {
        botResponse = '📝 To report a pothole or civic issue:\n1. Click "Report Issue" in top menu.\n2. Add description & upload photo.\n3. Our AI model will automatically analyze priority and dispatch to the correct department!';
      } else if (q.includes('helpline') || q.includes('emergency') || q.includes('contact') || q.includes('phone')) {
        botResponse = '🚨 24x7 Municipal Emergency Helplines:\n• Medical & Civic Control: 1916\n• Disaster Management: 1070\n• Water Supply Board: 1800-222-000';
      } else if (q.includes('status') || q.includes('track')) {
        botResponse = '📋 You can track any complaint status by entering the Reference ID (e.g. CR-1048) in the top Track search bar or inside your Citizen Portal!';
      } else {
        botResponse = 'I am trained on municipal services data. You can ask me to track a complaint (e.g., "Track CR-1048"), get emergency helpline numbers, or learn how to submit a new civic issue!';
      }

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'bot',
          text: botResponse,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      setIsTyping(false);
    }, 700);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 select-none font-sans">
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="relative group p-4 bg-[#14213D] text-white rounded-full shadow-2xl hover:bg-[#1f3057] transition-all transform hover:scale-105 flex items-center justify-center border-2 border-[#C49A45] cursor-pointer"
          title="Open AI Civic Assistant"
        >
          <Bot className="w-7 h-7 text-[#C49A45]" />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#D64545] rounded-full border-2 border-white animate-pulse" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="w-[360px] sm:w-[400px] h-[520px] bg-white rounded-2xl border-2 border-[#DDE1E7] shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="bg-[#14213D] text-white px-5 py-4 flex items-center justify-between border-b-4 border-[#C49A45]">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#C49A45]/20 border border-[#C49A45] flex items-center justify-center text-[#C49A45]">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-base font-bold font-heading flex items-center gap-1.5">
                  CivicBot <Sparkles className="w-3.5 h-3.5 text-[#C49A45]" />
                </h4>
                <span className="text-[11px] font-mono text-gray-300 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-[#4A9B6E]" /> AI Assistant Active
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-md text-gray-400 hover:text-white hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Preset Quick Actions Bar */}
          <div className="bg-[#F4F5F7] px-3 py-2 border-b border-[#DDE1E7] flex items-center gap-1.5 overflow-x-auto no-scrollbar text-[11px] font-mono text-[#14213D]">
            <button
              type="button"
              onClick={() => handleSend('Track CR-1048')}
              className="px-2.5 py-1 bg-white border border-[#DDE1E7] rounded hover:border-[#C49A45] whitespace-nowrap shadow-xs"
            >
              🔍 Track CR-1048
            </button>
            <button
              type="button"
              onClick={() => handleSend('How to report pothole?')}
              className="px-2.5 py-1 bg-white border border-[#DDE1E7] rounded hover:border-[#C49A45] whitespace-nowrap shadow-xs"
            >
              📝 Report Guide
            </button>
            <button
              type="button"
              onClick={() => handleSend('Emergency helpline numbers')}
              className="px-2.5 py-1 bg-white border border-[#DDE1E7] rounded hover:border-[#C49A45] whitespace-nowrap shadow-xs text-[#D64545]"
            >
              🚨 Helplines
            </button>
          </div>

          {/* Message List */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#F4F5F7]/40 text-xs">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'bot' && (
                  <div className="w-7 h-7 rounded-full bg-[#14213D] text-[#C49A45] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[80%] rounded-xl p-3 space-y-1 ${
                    msg.sender === 'user'
                      ? 'bg-[#14213D] text-white rounded-br-none'
                      : 'bg-white text-[#14213D] border border-[#DDE1E7] rounded-bl-none shadow-xs'
                  }`}
                >
                  <p className="whitespace-pre-line leading-relaxed">{msg.text}</p>
                  <span
                    className={`text-[9px] font-mono block text-right ${
                      msg.sender === 'user' ? 'text-gray-400' : 'text-gray-400'
                    }`}
                  >
                    {msg.timestamp}
                  </span>
                </div>

                {msg.sender === 'user' && (
                  <div className="w-7 h-7 rounded-full bg-[#C49A45] text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-2.5 justify-start">
                <div className="w-7 h-7 rounded-full bg-[#14213D] text-[#C49A45] flex items-center justify-center">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-white border border-[#DDE1E7] rounded-xl px-4 py-2.5 text-xs text-gray-500 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C49A45] animate-bounce" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C49A45] animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C49A45] animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Text Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-white border-t border-[#DDE1E7] flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Ask CivicBot or enter ID (e.g. CR-1048)..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 px-3 py-2 text-xs bg-[#F4F5F7] border border-[#DDE1E7] rounded-lg font-sans text-[#14213D] focus-visible:ring-2 focus-visible:ring-[#C49A45]"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="p-2 bg-[#C49A45] text-white rounded-lg hover:bg-[#a88235] disabled:opacity-50 transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
