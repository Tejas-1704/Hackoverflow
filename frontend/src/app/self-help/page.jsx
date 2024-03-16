"use client";
import { useState, useEffect,useRef } from "react";
import axios from "axios";
import LoadingSpinner from "@/components/spinner/page";

const SpiritualChatBot = () => {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [chatTypes, setChatTypes] = useState("Spiritual");
  const [loading, setLoading] = useState(false);
  const displayRef = useRef(null);

  const scrollToBottom = () => {
    displayRef.current.scrollTop = displayRef.current.scrollHeight;
  };

  useEffect(() => {
    const savedMessages = localStorage.getItem("chatMessages");
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("chatMessages", JSON.stringify(messages));
    scrollToBottom();
  }, [messages]);

  const chatType = [
    {
      id: "1",
      type: "Spiritual",
      url: "",
    },
    {
      id: "2",
      type: "MindMingle",
      url: "http://172.17.27.205:8080/query",
    },
  ];

  const handleChatType = (type) => {
    setChatTypes(type);
  };

  const fetchBotResponse = async (query) => {
    try {
      const response = await fetch("http://172.17.27.205:8080/query", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch bot response");
      }

      const data = await response.json();
      return data.response;
    } catch (error) {
      console.error("Error fetching bot response:", error);
      throw error;
    }
  };

  const sendMessage = async () => {
    if (userInput === "") return;
    const userMessage = userInput;
    // Add user message to chat
    const updatedMessages = [...messages, { text: userInput, sender: "user" }];
    setMessages(updatedMessages);
    setUserInput("");
    setLoading(true);

    try {
      const botResponse = await fetchBotResponse(userMessage);

      // Add bot response to chat
      const updatedMessagesWithBot = [
        ...updatedMessages,
        { text: botResponse, sender: "bot" },
      ];
      setLoading(false);
      setMessages(updatedMessagesWithBot);
    } catch (error) {
      // Handle error
      console.error("Error sending message:", error);
      // You can add code here to handle the error, e.g., display an error message to the user
    }
  };

  const sendMessage1 = async () => {
    if (userInput.trim() === "") return;

    const updatedMessages = [...messages, { text: userInput, sender: "user" }];
    setMessages(updatedMessages);
    setUserInput("");

    setLoading(true);
    // Send user message to server
    try {
      const response = await axios.post(
        "https://gigagen.pythonanywhere.com/chat",
        {
          request: userInput,
        }
      );

      // // Add bot response to chat
      const updatedMessagesWithBot = [
        ...updatedMessages,
        { text: response.data.response, sender: "bot" },
      ];
      setLoading(false);
      setMessages(updatedMessagesWithBot);
    } catch (error) {
      console.error("Error sending message:", error);
      // Handle error
    }
  };

  return (
    <div className="flex flex-col justify-center items-center w-full bg-primary">
      <div className="flex flex-col h-[82vh] w-[60%] bg-zinc-900 rounded-xl my-8">
        <div className="title font-bold text-white bg-slate-800 rounded-md p-2   px-8 w-[100%] flex justify-between items-center">
          <span>Chat with Us </span>
          <div className="chat-bot-options flex justify-between">
            {chatType.map((data) => (
              <span
                key={data.id}
                className={`p-2 w-32 text-center border-2 rounded-md border-slate-400 m-1 cursor-pointer hover:bg-indigo-800 text-white hover:border-0 ${
                  chatTypes === data.type ? "bg-indigo-800 border-0" : ""
                }`}
                onClick={() => {
                  handleChatType(data.type);
                }}
              >
                {data.type}
              </span>
            ))}
          </div>
        </div>
        <div className="flex-grow p-4 overflow-auto " ref={displayRef} >
          {messages.map((message, index) => (
            <>
              {message.sender === "user" ? (
                <>
                  <div
                    key={index}
                    className={`flex ${
                      message.sender === "user"
                        ? "justify-end"
                        : "justify-start"
                    } mb-2`}
                  >
                    <div
                      className={`p-3 rounded-lg max-w-[50%] ${
                        message.sender === "user"
                          ? "bg-blue-500 text-white self-end"
                          : "bg-gray-300 self-start font-bold text-zinc-800"
                      }`}
                    >
                      {message.text}
                    </div>
                  </div>
                  <>
                    {loading && (
                      <div className="bg-none flex w-full justify-start">
                        <LoadingSpinner />
                      </div>
                    )}
                  </>
                </>
              ) : (
                <>
                  <div
                    key={index}
                    className={`flex ${
                      message.sender === "user"
                        ? "justify-end"
                        : "justify-start"
                    } mb-2`}
                  >
                    <div
                      className={`p-3 rounded-lg max-w-[50%] ${
                        message.sender === "user"
                          ? "bg-blue-500 text-white self-end"
                          : "bg-gray-300 self-start font-bold text-zinc-800"
                      }`}
                    >
                      {message.text}
                    </div>
                  </div>
                </>
              )}
            </>
          ))}
        </div>
        <div className="flex-none p-4 ">
          <div className="flex rounded-lg border border-gray-300 overflow-hidden">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") sendMessage();
              }}
              className="flex-grow p-2 focus:outline-none"
              placeholder="Type your message..."
            />
            <button
              onClick={chatTypes === "MindMingle" ? sendMessage : sendMessage1}
              className="px-4 py-2 bg-blue-500 text-white font-semibold focus:outline-none"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpiritualChatBot;
