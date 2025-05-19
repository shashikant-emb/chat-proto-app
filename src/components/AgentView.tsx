"use client"

import type React from "react"

import { useRef, useEffect } from "react"
import { Send, Loader2 } from "lucide-react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { cn } from "../lib/utils"
import { useChat } from "../hooks/useChat"

export default function AgentView() {
  const { messages, sendAgentMessage, isStreaming } = useChat()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (inputRef.current && inputRef.current.value.trim()) {
      sendAgentMessage(inputRef.current.value)
      inputRef.current.value = ""
    }
  }

  return (
    <div className="w-full max-w-3xl">
      <h2 className="text-2xl font-semibold mb-4">Agent Interface</h2>
      <p className="text-slate-300 mb-6">Respond to user messages in this interface.</p>

      <div className="border border-slate-700 rounded-lg overflow-hidden">
        {/* Messages */}
        <div className="h-[400px] overflow-y-auto p-4 space-y-4 bg-slate-800">
          {messages.length === 0 ? (
            <div className="text-center text-slate-400 mt-8">No messages yet</div>
          ) : (
            messages.map((message, index) => (
              <div
                key={index}
                className={cn(
                  "max-w-[80%] p-3 rounded-lg",
                  message.role === "user" ? "bg-slate-700 rounded-bl-none" : "bg-sky-500 ml-auto rounded-br-none",
                )}
              >
                <div className="font-semibold text-xs mb-1">{message.role === "user" ? "User" : "Agent"}</div>
                {message.content}
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form onSubmit={handleSubmit} className="p-4 border-t border-slate-700 flex bg-slate-900">
          <Input
            ref={inputRef}
            placeholder="Type your response..."
            className="flex-1 bg-slate-700 border-slate-600 focus-visible:ring-sky-500"
            disabled={isStreaming}
          />
          <Button type="submit" size="icon" className="ml-2 bg-sky-500 hover:bg-sky-600" disabled={isStreaming}>
            {isStreaming ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </form>
      </div>
    </div>
  )
}
