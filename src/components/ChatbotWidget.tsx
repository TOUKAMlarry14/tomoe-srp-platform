import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Bot, User, Loader2, Maximize2 } from 'lucide-react';
import { Button, Input, ScrollArea, Avatar } from '@blinkdotnew/ui';
import { useChatbot } from '../hooks/useChatbot';
import { useLanguage } from '../hooks/useLanguage';
import { translations } from '../lib/i18n';
import { Link } from '@tanstack/react-router';

export function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const { messages, sendMessage, isLoading } = useChatbot();
  const { language } = useLanguage();
  const t = translations[language];
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;
    const msg = inputValue;
    setInputValue('');
    await sendMessage(msg);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="mb-4 w-[350px] md:w-[400px] h-[500px] bg-background border shadow-2xl rounded-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 bg-primary text-primary-foreground flex items-center justify-between border-b">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <Bot className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">TOMOE AI</h3>
                  <p className="text-[10px] opacity-80 uppercase tracking-wider">Assistant Scolaire</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Link to="/ai-chatbot" onClick={() => setIsOpen(false)}>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-white hover:bg-white/20">
                    <Maximize2 className="h-4 w-4" />
                  </Button>
                </Link>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setIsOpen(false)}
                  className="h-8 w-8 text-white hover:bg-white/20"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Messages Area */}
            <ScrollArea className="flex-1 p-4" ref={scrollRef}>
              <div className="space-y-4">
                {messages.length === 0 && (
                  <div className="text-center py-10 px-4">
                    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                      <Bot className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h4 className="font-medium mb-1">
                      {language === 'fr' ? 'Bienvenue chez TOMOE' : 'Welcome to TOMOE'}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {language === 'fr' 
                        ? 'Comment puis-je vous aider avec la gestion de votre école aujourd\'hui ?' 
                        : 'How can I help you with your school management today?'}
                    </p>
                  </div>
                )}
                {messages.map((msg, i) => (
                  <div 
                    key={i} 
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`flex gap-2 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                      <Avatar className={`h-8 w-8 shrink-0 ${msg.role === 'assistant' ? 'bg-primary' : 'bg-secondary'}`}>
                        {msg.role === 'assistant' ? <Bot className="h-4 w-4 text-white" /> : <User className="h-4 w-4 text-primary" />}
                      </Avatar>
                      <div className={`p-3 rounded-2xl text-sm ${
                        msg.role === 'user' 
                          ? 'bg-primary text-primary-foreground rounded-tr-none' 
                          : 'bg-muted text-foreground rounded-tl-none border border-border/50 shadow-sm'
                      }`}>
                        {msg.content}
                      </div>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="flex gap-2 max-w-[85%]">
                      <Avatar className="h-8 w-8 bg-primary">
                        <Bot className="h-4 w-4 text-white" />
                      </Avatar>
                      <div className="p-3 rounded-2xl bg-muted rounded-tl-none border border-border/50 shadow-sm">
                        <Loader2 className="h-4 w-4 animate-spin" />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Input Area */}
            <div className="p-4 border-t bg-muted/30">
              <div className="flex gap-2">
                <Input
                  placeholder={language === 'fr' ? 'Tapez votre message...' : 'Type your message...'}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  className="bg-background rounded-full border-primary/20 focus:border-primary transition-all shadow-sm"
                />
                <Button 
                  onClick={handleSend} 
                  disabled={isLoading || !inputValue.trim()}
                  size="icon"
                  className="rounded-full shrink-0 shadow-lg"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-2xl flex items-center justify-center border-2 border-primary-foreground/20"
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageSquare className="h-6 w-6" />}
      </motion.button>
    </div>
  );
}
