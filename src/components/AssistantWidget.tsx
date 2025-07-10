import React, { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Zap } from "lucide-react";

const gradientBg = "bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400";
const darkGradientBg = "dark:from-blue-700 dark:via-purple-700 dark:to-pink-700";

const initialMessages = [
  { role: "assistant", content: "您好，我是AI算力助手，可以为您推荐硬件配置、解释参数、对比选型等，有任何问题请随时提问！" }
];

export default function AssistantWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState("");
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open && chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages, open]);

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages(msgs => [
      ...msgs,
      { role: "user", content: input },
      { role: "assistant", content: `（模拟回复）您问：${input}，这里是AI助手的建议与解答。` }
    ]);
    setInput("");
  };

  return (
    <>
      {/* 悬浮按钮 */}
      <button
        onClick={() => setOpen(true)}
        className={`fixed z-50 bottom-6 right-6 w-14 h-14 rounded-full shadow-xl flex items-center justify-center text-white text-3xl ${gradientBg} ${darkGradientBg} transition-all hover:scale-105 active:scale-95`}
        aria-label="打开AI助手"
      >
        <Zap size={32} strokeWidth={2.2} />
      </button>
      {/* 对话框 */}
      {open && (
        <div className="fixed z-50 bottom-28 right-7 w-[350px] max-w-[95vw] bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-zinc-800 flex flex-col" style={{ boxShadow: "0 8px 48px 0 rgba(80,0,255,0.18)" }}>
          {/* 标题栏 */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 dark:border-zinc-800 bg-gradient-to-r from-blue-400/20 via-purple-400/10 to-pink-400/10 rounded-t-2xl">
            <div className="flex items-center gap-2 text-lg font-bold text-blue-600 dark:text-blue-300">
              AI算力助手
            </div>
            <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-blue-500 transition"><X size={20} /></button>
          </div>
          {/* 对话区 */}
          <div ref={chatRef} className="flex-1 overflow-y-auto px-5 py-4 space-y-3 bg-gradient-to-b from-white via-blue-50/30 to-white dark:from-zinc-900 dark:via-blue-900/10 dark:to-zinc-900" style={{ minHeight: 180, maxHeight: 320 }}>
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`px-4 py-2 rounded-2xl shadow-sm max-w-[80%] text-sm ${msg.role === 'user'
                  ? 'bg-blue-600 text-white dark:bg-blue-400 dark:text-zinc-900'
                  : 'bg-white/90 text-blue-700 border border-blue-100 dark:bg-zinc-800 dark:text-blue-200 dark:border-zinc-700'}`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
          </div>
          {/* 输入区 */}
          <div className="flex items-center gap-2 px-4 py-3 border-t border-gray-100 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 rounded-b-2xl">
            <input
              className="flex-1 rounded-lg border border-gray-200 dark:border-zinc-700 px-3 py-2 text-base bg-white dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
              placeholder="请提问，如‘推荐一款适合推理的GPU’..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') handleSend(); }}
              autoFocus
            />
            <button
              className={`p-2 rounded-full ${gradientBg} ${darkGradientBg} text-white hover:scale-110 transition-transform disabled:opacity-50`}
              onClick={handleSend}
              disabled={!input.trim()}
              aria-label="发送"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      )}
    </>
  );
} 