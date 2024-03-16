'use client';
import React, { useState } from 'react';
import axios from 'axios';

const SpiritualChatBot = () => {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState('');

  const sendMessage = async () => {
    if (userInput.trim() === '') return;

    // Add user message to chat
    setMessages([...messages, { text: userInput, sender: 'user' }]);
    setUserInput('');

    // Send user message to server
    try {
      const response = await axios.post('https://gigagen.pythonanywhere.com/chat', {
        request: userInput
      });

      // Add bot response to chat
      setMessages([...messages, { text: response.data.response, sender: 'bot' }]);
    } catch (error) {
      console.error('Error sending message:', error);
      // Handle error
    }
  };

  return (
    <div className="flex flex-col h-screen " >
      <div className="flex-grow p-4 overflow-auto">
        {messages.map((message, index) => (
          <div key={index} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} mb-2`}>
            <div className={`p-3 rounded-lg max-w-xs ${message.sender === 'user' ? 'bg-blue-500 text-white self-end' : 'bg-gray-300 self-start'}`}>
              {message.text}
            </div>
          </div>
        ))}
      </div>
      <div className="flex-none p-4">
        <div className="flex rounded-lg border border-gray-300 overflow-hidden">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') sendMessage();
            }}
            className="flex-grow p-2 focus:outline-none"
            placeholder="Type your message..."
          />
          <button onClick={sendMessage} className="px-4 py-2 bg-blue-500 text-white font-semibold focus:outline-none">
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default SpiritualChatBot;
