"use client";
import ChatClient from "./ChatClient";

export default function PageClient() {
    
  return (
    <div className="min-h-screen p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">Ask me anything about Street Fighter 6!</h1>
      <ChatClient />
    </div>
  );
} 