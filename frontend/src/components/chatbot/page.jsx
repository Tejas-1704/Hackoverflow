"use client";
import { useState } from "react";

const ChatBot = () => {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="p-4 w-14 h-14 flex justify-center items-center bg-blue-600 rounded-full text-white cursor-pointer"
      onClick={() => setOpen(!open)}
    >
      {" "}
      {open ? "X" : "Chat"}
    </div>
  );
};

export default ChatBot;
