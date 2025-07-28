import React, { useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';
import { Button } from './ui/button';
import { Icons } from './icons';

type Message = { id: number; content: string; isUser: boolean };

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const idRef = useRef(0);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = () => setOpen(true); // sadece aç; istersen toggle da yapabilirsin
    window.addEventListener('open-chat', handler);
    return () => window.removeEventListener('open-chat', handler);
  }, []);

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [open, messages]);

  async function sendMessage() {
    const text = input.trim();
    if (!text) return;

    const userMsg = { id: idRef.current++, content: text, isUser: true };
    setMessages(prev => [...prev, userMsg]);
    setInput('');

    try {
      const res = await fetch('https://pangoai.app/ask/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: text,
          history: [...messages, userMsg].map(m => ({
            role: m.isUser ? 'user' : 'assistant',
            content: m.content,
          })),
        }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, { id: idRef.current++, content: data.answer ?? data, isUser: false }]);
    } catch {
      setMessages(prev => [...prev, { id: idRef.current++, content: 'Üzgünüm, bir hata oluştu.', isUser: false }]);
    }
  }

  const hidden = !open ? 'translate-x-[120%] pointer-events-none' : 'translate-x-0';

  return (
    <div
      className={`fixed bottom-20 right-6 z-40 w-80 max-w-[90vw] h-[70vh] bg-background
                  shadow-xl border rounded-2xl flex flex-col transition-transform
                  duration-300 ${hidden}`}
    >
      <header className="p-4 border-b flex items-center justify-between">
        <h4>Chat</h4>
        <Button
          variant="outline"
          size="icon"
          onClick={() => {
            setOpen(false);
            window.dispatchEvent(new Event('close-chat'));
          }}
          aria-label="Close chat"
        >
          <Icons.x className="size-4" />
        </Button>
      </header>

      {/* Mesaj liste */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map(m => (
          <div
        key={m.id}
        className={`flex ${m.isUser ? 'justify-end' : 'justify-start'}`}
          >
        <div className={`max-w-[80%] p-3 rounded-lg ${m.isUser ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
          {m.content}
        </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Girdi */}
      <div className="p-4 border-t flex flex-col gap-4">
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), sendMessage())}
          rows={2}
          placeholder="Write here..."
          className="w-full resize-none border bg-backgroundSoft rounded-lg p-2 focus:outline-none focus:ring focus:ring-primary focus:ring-offset-2 focus:ring-offset-backgroundSoft"
        />
        <Button onClick={sendMessage} disabled={!input.trim()} block>
          Send
        </Button>
      </div>
    </div>
  );
}
