
import React, { useEffect, useRef, useState } from "react";
import axios from "axios";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import {
  FaRobot,
  FaUserCircle,
  FaPaperPlane,
} from "react-icons/fa";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { BACKEND_URL } from "../util/util.js";

function Bot({ sender, text }) {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages])

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const question = input;

    setInput("");
    setLoading(true);

    try {
      const res = await axios.post(
        `${BACKEND_URL}/bot/Message`,
        {
          text: question,
        }, {
    withCredentials: true,
  }
      );

      setMessages((prev) => [
        ...prev,
        {
          sender: "user",
          text: res.data.user,
        },
        {
          sender: "assistant",
          text: res.data.bot,
        },
      ]);
    } catch (error) {
      console.log(error);
    }

    setLoading(false);
  };
  const handleKeyPress = (e) => {
  if (e.key === "Enter" && !loading) {
    handleSendMessage();
  }
};

  return (
    <div className="flex flex-col h-screen bg-[#0F172A] text-white">

  {/* Chat Area */}
  <div className="flex-1 overflow-y-auto">
    <div className="max-w-4xl mx-auto px-6 py-10">

      {messages.length === 0 ? (
        <div className="h-[75vh] flex flex-col items-center justify-center">

          <div className="w-24 h-24 rounded-full bg-green-500/20 flex items-center justify-center mb-6">
            <FaRobot className="text-5xl text-green-400" />
          </div>

          <h1 className="text-5xl font-bold mb-4">
            Welcome to BotSpoof AI
          </h1>

          <p className="text-gray-400 text-lg">
            Ask me anything about programming.
          </p>

        </div>
      ) : (
        <>
          {messages.map((msg, index) => (

            <div
              key={index}
              className={`flex mb-8 ${
                msg.sender === "user"
                  ? "justify-end"
                  : "justify-start"
              }`}
            >

              {/* Assistant Avatar */}

              {msg.sender === "assistant" && (
                <div className="mr-4 mt-1">
                  <div className="w-11 h-11 rounded-full bg-green-500 flex items-center justify-center shadow-lg">
                    <FaRobot />
                  </div>
                </div>
              )}

              {/* Message */}

              <div
                className={`max-w-[75%] px-6 py-4 rounded-3xl leading-8 shadow-md ${
                  msg.sender === "user"
                    ? "bg-green-600 rounded-br-md"
                    : "bg-[#1E293B] border border-gray-700 rounded-bl-md"
                }`}
              >
                {msg.sender === "assistant" ? (
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {msg.text}
                  </ReactMarkdown>
                ) : (
                  <p>{msg.text}</p>
                )}
              </div>

              {/* User Avatar */}

              {msg.sender === "user" && (
                <div className="ml-4 mt-1">
                  <FaUserCircle
                    size={42}
                    className="text-green-500"
                  />
                </div>
              )}

            </div>

          ))}

          {loading && (

            <div className="flex items-center gap-4">

              <div className="w-11 h-11 rounded-full bg-green-500 flex items-center justify-center">
                <FaRobot />
              </div>

              <div className="bg-[#1E293B] border border-gray-700 rounded-3xl px-6 py-4 flex gap-2">

                <span className="w-2 h-2 rounded-full bg-gray-300 animate-bounce"></span>

                <span className="w-2 h-2 rounded-full bg-gray-300 animate-bounce [animation-delay:0.2s]"></span>

                <span className="w-2 h-2 rounded-full bg-gray-300 animate-bounce [animation-delay:0.4s]"></span>

              </div>

            </div>

          )}

          <div ref={messagesEndRef}></div>

        </>
      )}

    </div>
  </div>

  {/* Bottom Input */}

  <div className="border-t border-gray-800 bg-[#0F172A]">

    <div className="max-w-4xl mx-auto p-5">

      <div className="bg-[#1E293B] rounded-2xl border border-gray-700 flex items-center px-3">

        <input
          type="text"
          placeholder="Message BotSpoof..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
          className="flex-1 bg-transparent outline-none py-5 px-4 text-white placeholder:text-gray-500"
        />

        <button
          onClick={handleSendMessage}
          className="w-12 h-12 rounded-xl bg-green-500 hover:bg-green-600 transition duration-300 flex items-center justify-center"
        >
          <FaPaperPlane className="text-white" />
        </button>

      </div>

      <p className="text-center text-xs text-gray-500 mt-3">
        BotSpoof AI can make mistakes. Verify important information.
      </p>

    </div>

  </div>

</div>
  )
}

export default Bot