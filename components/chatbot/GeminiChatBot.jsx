"use client";
import ChatWindow from "@/components/chatbot/ChatWindow";
import ChatIcon from "@/components/chatbot/ChatIcon";
import React, { useState } from "react";

const GeminiChatBot = () => {
  const [showChat, setShowChat] = useState(false);
  const toggleChat = () => {
    setShowChat((prev) => !prev);
  };
  return (
    <div className="bg-gray-100 font-sans  flex items-center justify-center">
      {showChat ? (
        <ChatWindow onClose={toggleChat} />
      ) : (
        <ChatIcon toggleChat={toggleChat} />
      )}
    </div>
  );
};

export default GeminiChatBot;
