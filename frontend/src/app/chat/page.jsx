"use client";
import Theme from "@/components/Theme/page";
import { useState } from "react";
import SupervisedUserCircleIcon from "@mui/icons-material/SupervisedUserCircle";
import KeyboardCapslockIcon from "@mui/icons-material/KeyboardCapslock";
import LoadingSpinner from "@/components/spinner/page";

const Chat = () => {
  const { theme } = Theme();
  const findData = JSON.parse(localStorage.getItem("chatsHistory"));
  const [chatHistory, setChatHistory] = useState(findData ? findData : []);
  const [prompt, setPrompt] = useState("");
  const [isprompt, setIsPrompt] = useState(false);
  const [error, setError] = useState(null);
  const [summary, setSummary] = useState(null);

  const addMessage = (message) => {
    setChatHistory((prevChatHistory) => [...prevChatHistory, message]);
    localStorage.setItem(
      "chatsHistory",
      JSON.stringify([...chatHistory, message])
    );
  };

  const getSummary = async () => {
    if (chatHistory.length === 0) return;
    setIsPrompt(true);

    const api_url = "http://gigagen.pythonanywhere.com/summarize";
    const data = {
      user_input: chatHistory,
    };

    try {
      const response = await fetch(api_url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseData = await response.json();
      setSummary(responseData);
      setIsPrompt(false);
    } catch (error) {
      setError(error.message);
    }
  };

  const handlePrompt = async (prompt) => {
    if (!isprompt) {
      setIsPrompt(true);
    }
    const api_url = "https://gigagen.pythonanywhere.com/health_query";
    const data = {
      user_input: prompt,
    };

    try {
      const response = await fetch(api_url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseData = await response.json();
      addMessage({ title: prompt, desc: responseData });
      setIsPrompt(false);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleSubmit = () => {
    if (prompt !== "") {
      setIsPrompt(true);
      handlePrompt(prompt);
      setPrompt("");
    }
  };

  const question = [
    {
      id: 1,
      ques: "How to Manage Stress?",
    },
    {
      id: 2,
      ques: "Coping with Anxiety?",
    },
    {
      id: 3,
      ques: "Seeking Depression Help?",
    },
    {
      id: 4,
      ques: "Dealing with Loneliness?",
    },
  ];

  return (
    <div
      className={` w-[100%] flex justify-between min-h-screen bg-primary theme-${theme} text-white`}
    >
      {/* justify-center */}
      <div className="prompt-main w-full flex items-center justify-center  mx-8">
        <div className="prompt-area w-[60%] flex flex-col items-center justify-center pt-4">
          {/* initial page */}
          <img
            src="https://e7.pngegg.com/pngimages/723/59/png-clipart-thought-positive-mental-attitude-smiley-mind-smiley-miscellaneous-face.png"
            alt=""
            className="w-40 bg-cover rounded-lg"
          />
          <div className="prompt-inital-heading font-bold text-3xl mt-4">
            How can I Help You ?
          </div>
          <div className="prompt-initial-sub-heading text-zinc-500 mt-4">
            Do you want to ask anything about your mental Health...
          </div>

          <div className="general-question flex flex-wrap justify-center my-8 ">
            {question.map((data) => (
              <div
                className="question w-[32%] text-zinc-400 py-2 px-6 border-2 border-gray-600 text-center rounded-lg mx-12 mt-4 cursor-pointer "
                key={data.id}
                onClick={() => handlePrompt(data.ques)}
              >
                {data.ques}
              </div>
            ))}
          </div>

          {/* chats */}
          {chatHistory &&
            chatHistory.map((history, id) => (
              <div
                className="chat my-6 w-full bg-zinc-900 p-6 rounded-md"
                key={id}
              >
                <div className="prompt-heading-area w-full flex">
                  <SupervisedUserCircleIcon className="mr-4 size-10 text bg-red" />
                  <div className="flex items-center font-bold text-base text-zinc-500 ">
                    {history.title}
                  </div>
                </div>
                <div className="description pl-10 mt-4  bg-zinc-950 p-6 rounded-lg ">
                  <div className="desc-area text-grey-300 font-medium text-gray-400">
                    <ul>
                      {history.desc.response
                        .split(/\d+\./)
                        .filter((item) => item !== "")
                        .map((point, index) => (
                          <li className=" mb-1" key={index}>
                            <span style={{ marginRight: "5px" }}>•</span>{" "}
                            {point}{" "}
                          </li>
                        ))}
                    </ul>
                  </div>
                </div>
                {error && <p>Error: {error}</p>}
              </div>
            ))}
          {/* ////////////////////////// */}

          {summary ? (
            <div className="chat my-6 w-full bg-zinc-900 p-6 rounded-md">
              <div className="prompt-heading-area w-full flex">Summary:</div>
              <div className="description pl-10 mt-4  bg-zinc-950 p-6 rounded-lg ">
                <div className="desc-area text-grey-300 font-medium text-gray-400">
                  {summary.response}
                </div>
              </div>
              {error && <p>Error: {error}</p>}
            </div>
          ) : (
            <></>
          )}
          {isprompt && (
            <>
              <LoadingSpinner />
            </>
          )}

          {chatHistory.length > 0 && (
            <div
              className="getSummary cursor-pointer flex items-center hover:text-indigo-600"
              onClick={getSummary}
            >
              Get Summary
            </div>
          )}

          <div className="prompt-input relative w-full flex justify-center my-8">
            <textarea
              name="prompt"
              cols="30"
              rows="1"
              value={prompt}
              placeholder="Enter your Prompt...."
              className=" shadow-md border-solid border-2 border-[#31363F] rounded-xl text-zinc-400 outline-none py-4 px-6 text-lg bg-zinc-950 resize-none 
        overflow-hidden  w-full"
              onChange={(e) => setPrompt(e.target.value)}
            />

            <button
              onClick={handleSubmit}
              className="text-white cursor-pointer absolute inset-y-0 right-[2%] bg-zinc-800 rounded-md px-2 h-[40px] mt-[12px]"
            >
              <KeyboardCapslockIcon className="text-4xl text-zinc-500" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
