import React from "react";
import ChatBot from "./components/ChatBot";



const App = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-full bg-black text-white">
      <div className="w-full min-h-svh max-w-lg mx-auto  rounded-lg shadow-lg bg-gray-900">
        <ChatBot />
      </div>
    </div>
  );
};

export default App;
