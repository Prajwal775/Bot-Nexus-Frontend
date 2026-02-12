import React from "react";
import ChatWidget from "@/components/ChatWidget";

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-background-dark flex items-center justify-center">
      <div className="text-center text-white">
        <h1 className="text-4xl font-bold mb-4">Welcome to IDLAH</h1>
        <p className="text-[#ab9db9] mb-6">
          This is a demo home page. Chat with our assistant below 👇
        </p>
      </div>

      {/* 🔥 ChatWidget lives ONLY here */}
      <ChatWidget />
    </div>
  );
};

export default Home;
