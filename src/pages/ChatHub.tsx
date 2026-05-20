import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, 
  Bot, 
  User, 
  Loader2, 
  Trash2, 
  Sparkles,
  Info,
  ShieldCheck,
  School
} from 'lucide-react';
import { Button, Input, ScrollArea, Avatar, Card, Badge } from '@blinkdotnew/ui';
import { useChatbot } from '../hooks/useChatbot';
import { useLanguage } from '../hooks/useLanguage';
import { translations } from '../lib/i18n';

export default function ChatHub() {
  const [inputValue, setInputValue] = useState('');
  const { messages, sendMessage, isLoading, clearMessages } = useChatbot();
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

  const suggestions = language === 'fr' 
    ? [
        "Comment inscrire un nouvel élève ?",
        "Quels sont les frais de scolarité pour le CM2 ?",
        "Comment gérer les absences ?",
        "Où se trouve la bibliothèque ?"
      ]
    : [
        "How to enroll a new student?",
        "What are the tuition fees for CM2?",
        "How to manage attendance?",
        "Where is the library?"
      ];

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] bg-muted/20">
      <div className="flex-1 flex overflow-hidden">
        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col min-w-0 bg-background">
          <header className="p-4 border-b flex items-center justify-between bg-background z-10">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 bg-primary">
                <Bot className="h-6 w-6 text-white" />
              </Avatar>
              <div>
                <h1 className="text-lg font-bold">TOMOE AI Hub</h1>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-[10px] uppercase py-0 px-2 border-primary/20 text-primary">
                    {language === 'fr' ? 'Assistant Officiel' : 'Official Assistant'}
                  </Badge>
                  <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                    Online
                  </span>
                </div>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={clearMessages} className="text-muted-foreground hover:text-destructive">
              <Trash2 className="h-4 w-4 mr-2" />
              {language === 'fr' ? 'Effacer' : 'Clear'}
            </Button>
          </header>

          <ScrollArea className="flex-1 p-6" ref={scrollRef}>
            <div className="max-w-4xl mx-auto space-y-8 pb-10">
              {messages.length === 0 && (
                <div className="py-12 space-y-8">
                  <div className="text-center space-y-4">
                    <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-6">
                      <Sparkles className="h-10 w-10 text-primary" />
                    </div>
                    <h2 className="text-3xl font-bold tracking-tight">
                      {language === 'fr' ? 'Comment puis-je vous aider ?' : 'How can I help you today?'}
                    </h2>
                    <p className="text-muted-foreground text-lg max-w-lg mx-auto">
                      {language === 'fr' 
                        ? 'Posez-moi n\'importe quelle question sur la gestion de l\'école, les élèves ou les fonctionnalités de la plateforme.'
                        : 'Ask me anything about school management, students, or platform features.'}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                    {suggestions.map((suggestion, i) => (
                      <Card 
                        key={i} 
                        className="p-4 cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all group"
                        onClick={() => sendMessage(suggestion)}
                      >
                        <p className="text-sm font-medium group-hover:text-primary transition-colors">{suggestion}</p>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((msg, i) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={i} 
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex gap-4 max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    <Avatar className={`h-10 w-10 shrink-0 shadow-sm ${msg.role === 'assistant' ? 'bg-primary' : 'bg-secondary'}`}>
                      {msg.role === 'assistant' ? <Bot className="h-5 w-5 text-white" /> : <User className="h-5 w-5 text-primary" />}
                    </Avatar>
                    <div className={`p-4 rounded-2xl text-[15px] leading-relaxed shadow-sm ${
                      msg.role === 'user' 
                        ? 'bg-primary text-primary-foreground rounded-tr-none' 
                        : 'bg-muted text-foreground rounded-tl-none border border-border/50'
                    }`}>
                      {msg.content}
                    </div>
                  </div>
                </motion.div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex gap-4 max-w-[80%]">
                    <Avatar className="h-10 w-10 bg-primary shadow-sm">
                      <Bot className="h-5 w-5 text-white" />
                    </Avatar>
                    <div className="p-4 rounded-2xl bg-muted rounded-tl-none border border-border/50 shadow-sm flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin text-primary" />
                      <span className="text-sm text-muted-foreground">TOMOE AI is typing...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          <footer className="p-4 border-t bg-background">
            <div className="max-w-4xl mx-auto flex gap-4">
              <div className="relative flex-1">
                <Input
                  placeholder={language === 'fr' ? 'Posez votre question ici...' : 'Ask your question here...'}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  className="pr-12 py-6 rounded-xl border-2 border-muted focus:border-primary transition-all text-lg"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <Button 
                    onClick={handleSend} 
                    disabled={isLoading || !inputValue.trim()}
                    size="icon"
                    className="rounded-lg h-10 w-10 shadow-md"
                  >
                    <Send className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>
            <p className="text-center text-[10px] text-muted-foreground mt-3 uppercase tracking-widest font-medium">
              Powered by TOMOE AI Assistant
            </p>
          </footer>
        </div>

        {/* Sidebar Info (Desktop Only) */}
        <aside className="hidden lg:flex w-80 border-l bg-muted/30 flex-col p-6 space-y-6">
          <div className="space-y-4">
            <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground">About TOMOE AI</h3>
            <Card className="p-4 bg-background/50 border-primary/10">
              <div className="flex gap-3 mb-3">
                <School className="h-5 w-5 text-primary" />
                <span className="font-bold text-sm">Knowledge Base</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {language === 'fr' 
                  ? 'Entraîné sur le système éducatif camerounais et les processus spécifiques de TOMOE.'
                  : 'Trained on the Cameroonian education system and TOMOE specific processes.'}
              </p>
            </Card>
          </div>

          <div className="space-y-4">
            <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground">Security & Roles</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <ShieldCheck className="h-4 w-4 text-green-600 mt-0.5" />
                <div>
                  <p className="text-xs font-bold">Managed Auth</p>
                  <p className="text-[10px] text-muted-foreground">Access restricted to school personnel.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Info className="h-4 w-4 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-xs font-bold">Context Aware</p>
                  <p className="text-[10px] text-muted-foreground">Understands your role and permissions.</p>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
