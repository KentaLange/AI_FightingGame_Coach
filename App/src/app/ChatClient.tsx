'use client';
import { useState } from "react";

export default function ChatClient() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Array<{ text: string; isUser: boolean }>>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Define the API URL and authentication
  const LANGFLOW_URL = process.env.NEXT_PUBLIC_LANGFLOW_URL;
  const API_KEY = process.env.NEXT_PUBLIC_LANGFLOW_API_KEY;

  /*if (!LANGFLOW_URL) {
    throw new Error("NEXT_PUBLIC_LANGFLOW_URL environment variable is not set.");
  }
  if (!API_KEY) {
    throw new Error("NEXT_PUBLIC_LANGFLOW_API_KEY environment variable is not set.");
  }*/

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setMessages(prev => [...prev, { text: input, isUser: true }]);
    setIsLoading(true);

    const payload = {
      input_value: input,
      output_type: "chat",
      input_type: "chat"
    };

    try {
      const response = await fetch(LANGFLOW_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const rawResponse = await response.text();
      let data: unknown;
      
      try {
        data = JSON.parse(rawResponse);
      } catch {
        throw new Error('Failed to parse response as JSON');
      }

      const extractMessage = (data: unknown): string => {
        if (typeof data === 'string') return data;
        try {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const dataObj = data as any;
          const paths = [
            dataObj?.outputs?.[0]?.outputs?.[0]?.messages?.[0]?.message,
            dataObj?.outputs?.[0]?.outputs?.[0]?.results?.message?.text,
            dataObj?.outputs?.[0]?.outputs?.[0]?.artifacts?.message,
            dataObj?.result,
            dataObj?.response
          ];
          for (const path of paths) {
            if (path) {
              return typeof path === 'string' ? path : JSON.stringify(path);
            }
          }
        } catch {}
        return "Could not extract message from response.";
      };

      const aiMessage = extractMessage(data);
      setMessages(prev => [...prev, { text: aiMessage, isUser: false }]);

    } catch (error) {
      setMessages(prev => [...prev, { 
        text: `Error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`, 
        isUser: false 
      }]);
    } finally {
      setIsLoading(false);
      setInput("");
    }
  };

  return (
    <>
      {/* Messages display area */}
      <div className="bg-gray-50 rounded-lg p-4 mb-4 h-[500px] overflow-y-auto">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`mb-4 p-3 rounded-lg ${
              message.isUser
                ? "bg-blue-100 ml-auto max-w-[80%]"
                : "bg-gray-200 max-w-[80%]"
            }`}
          >
            <p className="text-black font-medium">{message.text}</p>
          </div>
        ))}
        {isLoading && (
          <div className="text-center p-2">
            <p className="text-black font-medium">Thinking...</p>
          </div>
        )}
      </div>

      {/* Input form */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your question here..."
          className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400"
        >
          Send
        </button>
      </form>
    </>
  );
} 