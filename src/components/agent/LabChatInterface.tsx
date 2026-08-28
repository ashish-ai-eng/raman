import React, { useState } from "react";
import { UniversalPhysicsSpec } from "@/types/upr";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface LabChatInterfaceProps {
  currentSpec: UniversalPhysicsSpec;
  onSpecUpdated: (spec: UniversalPhysicsSpec) => void;
}

export const LabChatInterface: React.FC<LabChatInterfaceProps> = ({
  currentSpec,
  onSpecUpdated,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "init-1",
      role: "assistant",
      content:
        "Hello Teacher! I'm your AI Physics Simulation Engineer. What physics experiment or widget would you like to build today?",
    },
  ]);
  const [inputPrompt, setInputPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([
    "Create an Optics Bench with a convex lens",
    "Build a Hooke's Law Mass-Spring experiment",
    "Create an Ohm's Law circuit with variable resistor",
  ]);

  const handleSendMessage = async (textToSend?: string) => {
    const prompt = textToSend || inputPrompt;
    if (!prompt.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: prompt,
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputPrompt("");
    setLoading(true);

    try {
      const res = await fetch("/api/agent/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMsg].map((m) => ({
            role: m.role,
            content: m.content,
          })),
          currentSpec,
        }),
      });

      const data = await res.json();

      if (data.spec) {
        onSpecUpdated(data.spec);
      }

      const assistantMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: data.message || "Updated the widget spec for you!",
      };

      setMessages((prev) => [...prev, assistantMsg]);
      if (data.suggestedPrompts) {
        setSuggestions(data.suggestedPrompts);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: "assistant",
          content: "Sorry, I ran into an error generating the widget. Please try again!",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[520px] bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-slate-900 text-white px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-bold tracking-wide uppercase">AI Lab Design Assistant</span>
        </div>
        <span className="text-[11px] text-slate-400">Multi-Turn Studio</span>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] rounded-lg p-3 text-xs leading-relaxed ${
                msg.role === "user"
                  ? "bg-brand-600 text-white rounded-br-none"
                  : "bg-white text-slate-800 border border-slate-200 shadow-sm rounded-bl-none"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white text-slate-500 border border-slate-200 rounded-lg p-3 text-xs italic flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-brand-500 animate-bounce" />
              Generating simulation physics & visuals...
            </div>
          </div>
        )}
      </div>

      {/* Suggestion Chips */}
      {suggestions.length > 0 && (
        <div className="px-3 py-2 bg-slate-100 border-t border-slate-200 flex flex-wrap gap-1.5">
          {suggestions.map((sug, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(sug)}
              className="text-[11px] bg-white text-slate-700 hover:text-brand-600 border border-slate-300 hover:border-brand-500 rounded-full px-2.5 py-0.5 transition-colors"
            >
              + {sug}
            </button>
          ))}
        </div>
      )}

      {/* Input Form */}
      <div className="p-3 bg-white border-t border-slate-200 flex gap-2">
        <input
          type="text"
          value={inputPrompt}
          onChange={(e) => setInputPrompt(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
          placeholder="Describe the widget or change you'd like to make..."
          className="flex-1 text-xs border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500"
        />
        <button
          onClick={() => handleSendMessage()}
          disabled={loading || !inputPrompt.trim()}
          className="bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors"
        >
          Send
        </button>
      </div>
    </div>
  );
};
