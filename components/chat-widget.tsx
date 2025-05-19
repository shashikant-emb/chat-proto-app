"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { MessageSquare, Send, X, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { useChat } from "../hooks/use-chat"

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const { messages, isAgentTyping, sendMessage, isStreaming } = useChat()
  console.log("ChatWidget messages", messages)

  const toggleChat = () => {
    setIsOpen(!isOpen)
  }

  useEffect(() => {
    if (isOpen && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages, isOpen, isAgentTyping])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (inputRef.current && inputRef.current.value.trim()) {
      sendMessage(inputRef.current.value)
      inputRef.current.value = ""
    }
  }

  return (
    <>
      {/* Chat bubble */}
      <button
        onClick={toggleChat}
        className={cn(
          "fixed bottom-6 right-6 w-14 h-14 rounded-full flex items-center justify-center shadow-lg z-50 transition-colors",
          isOpen ? "bg-red-500 hover:bg-red-600" : "bg-sky-500 hover:bg-sky-600",
        )}
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
      </button>

      {/* Chat window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-80 sm:w-96 h-[500px] bg-slate-800 rounded-lg shadow-xl flex flex-col z-40 border border-slate-700">
          {/* Header */}
          <div className="p-4 border-b border-slate-700 bg-slate-900 rounded-t-lg">
            <h3 className="font-medium">Chat Support</h3>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 ? (
              <div className="text-center text-slate-400 mt-8">Send a message to start chatting</div>
            ) : (
              messages.map((message, index) => (
                <div
                  key={index}
                  className={cn(
                    "max-w-[80%] p-3 rounded-lg",
                    message.role === "user" ? "bg-sky-500 ml-auto rounded-br-none" : "bg-slate-700 rounded-bl-none",
                  )}
                >
                  {message.content}
                </div>
              ))
            )}

            {isAgentTyping && (
              <div className="flex items-center space-x-2 max-w-[80%] p-3 bg-slate-700 rounded-lg rounded-bl-none">
                <div className="flex space-x-1">
                  <div
                    className="w-2 h-2 rounded-full bg-slate-400 animate-bounce"
                    style={{ animationDelay: "0ms" }}
                  ></div>
                  <div
                    className="w-2 h-2 rounded-full bg-slate-400 animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  ></div>
                  <div
                    className="w-2 h-2 rounded-full bg-slate-400 animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  ></div>
                </div>
                <span className="text-sm text-slate-300">Agent is typing...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className="p-4 border-t border-slate-700 flex">
            <Input
              ref={inputRef}
              placeholder="Type your message..."
              className="flex-1 bg-slate-700 border-slate-600 focus-visible:ring-sky-500"
              disabled={isStreaming}
            />
            <Button type="submit" size="icon" className="ml-2 bg-sky-500 hover:bg-sky-600" disabled={isStreaming}>
              {isStreaming ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </Button>
          </form>
        </div>
      )}
    </>
  )
}
