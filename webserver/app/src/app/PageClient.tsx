"use client";
import ChatClient from "./ChatClient";

export default function PageClient() {
    
  return (
    <div className="min-h-screen p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">Ask me anything about Street Fighter 6!</h1>
      <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6 rounded">
        <p className="font-bold text-2xl text-center">Under maintenance for more features</p>
      </div>
      <ChatClient />
    </div>
  );
} 