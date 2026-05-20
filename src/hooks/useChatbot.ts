import { useState, useCallback } from 'react';
import { blink } from '../lib/blink';
import { useLanguage } from './useLanguage';
import { TOMOE_SYSTEM_PROMPT } from '../lib/chatbot-knowledge';

export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export function useChatbot() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { language } = useLanguage();

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;

    // Check if user is authenticated
    const user = await blink.auth.me();
    if (!user) {
      // In a real app, we might redirect here, but for the chatbot widget
      // we'll just show a message. The requirement says "Managed Auth" check.
      // blink.auth.login() would redirect the whole page.
      setMessages(prev => [...prev, 
        { role: 'user', content },
        { role: 'assistant', content: language === 'fr' 
          ? "Veuillez vous connecter pour utiliser l'assistant." 
          : "Please log in to use the assistant." 
        }
      ]);
      return;
    }

    const newUserMessage: Message = { role: 'user', content };
    setMessages(prev => [...prev, newUserMessage]);
    setIsLoading(true);

    try {
      const chatMessages = [
        { role: 'system', content: `${TOMOE_SYSTEM_PROMPT}\n\nCurrent user language: ${language === 'fr' ? 'French' : 'English'}. Please respond in this language.` },
        ...messages.map(m => ({ role: m.role, content: m.content })),
        { role: 'user', content }
      ];

      let assistantResponse = '';
      setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

      const { textStream } = await blink.ai.streamText({
        messages: chatMessages as any,
      });

      for await (const delta of textStream) {
        assistantResponse += delta;
        setMessages(prev => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1] = { role: 'assistant', content: assistantResponse };
          return newMessages;
        });
      }
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: language === 'fr' 
          ? "Désolé, une erreur s'est produite." 
          : "Sorry, an error occurred." 
      }]);
    } finally {
      setIsLoading(false);
    }
  }, [messages, language]);

  const clearMessages = () => setMessages([]);

  return {
    messages,
    sendMessage,
    isLoading,
    clearMessages
  };
}
