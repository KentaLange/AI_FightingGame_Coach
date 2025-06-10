'use client';

import { useState, useEffect } from "react";

export default function App() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Array<{ text: string; isUser: boolean }>>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Define the API URL
  const LANGFLOW_URL = "http://127.0.0.1:7860/api/v1/run/3c79f16f-713f-465f-bdf4-ed80f46e0f30";

  // Test the API connection on component mount
  useEffect(() => {
    const testConnection = async () => {
      const testPayload = {
        input_value: "test",
        output_type: "chat",
        input_type: "chat",
        session_id: "user_1"
      };

      try {
        console.log('Testing API with payload:', testPayload);
        const response = await fetch(LANGFLOW_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(testPayload)
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Test response received:', data);
      } catch (error) {
        console.error('API test failed:', error);
      }
    };

    testConnection();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message to chat
    setMessages(prev => [...prev, { text: input, isUser: true }]);
    setIsLoading(true);

    const payload = {
      input_value: input,
      output_type: "chat",
      input_type: "chat",
      session_id: "user_1"
    };

    try {
      console.log('Sending payload:', JSON.stringify(payload, null, 2));
      
      const response = await fetch(LANGFLOW_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Response not OK:', {
          status: response.status,
          statusText: response.statusText,
          body: errorText
        });
        throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
      }

      const rawResponse = await response.text();
      console.log('Raw response text:', rawResponse);

      let data;
      try {
        data = JSON.parse(rawResponse);
        console.log('Parsed response:', data);
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        console.log('Raw response that failed to parse:', rawResponse);
        throw new Error('Failed to parse response as JSON');
      }

      // Handle the response based on its structure
      let aiMessage: string;
      if (typeof data === 'string') {
        aiMessage = data;
      } else if (data.result) {
        aiMessage = typeof data.result === 'string' ? data.result : JSON.stringify(data.result);
      } else if (data.response) {
        aiMessage = typeof data.response === 'string' ? data.response : JSON.stringify(data.response);
      } else {
        console.log('Unexpected response structure:', data);
        aiMessage = "Received response but couldn't parse it properly. Check console for details.";
      }

      setMessages(prev => [...prev, { text: aiMessage, isUser: false }]);
    } catch (error) {
      console.error('Error in API call:', error);
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
    <div className="min-h-screen p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">Ask me anything about Street Fighter 6!</h1>
      
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
    </div>
  );
}
