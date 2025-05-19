"use client"

import { createContext, useContext, useState, ReactNode } from "react"

type Message = {
  role: "user" | "agent"
  content: string
}

type ChatContextType = {
  messages: Message[]
  sendMessage: (content: string) => void
  sendAgentMessage: (content: string) => void
  isStreaming: boolean
}

const ChatContext = createContext<ChatContextType | undefined>(undefined)

export function ChatProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<Message[]>([])
  const [isStreaming, setIsStreaming] = useState(false)

  const sendMessage = (content: string) => {
    setIsStreaming(true)
    setMessages((prev) => [...prev, { role: "user", content }])

    setTimeout(() => {
      setMessages((prev) => [...prev, { role: "agent", content: `Echo: ${content}` }])
      setIsStreaming(false)
    }, 1000)
  }

  const sendAgentMessage = (content: string) => {
    setIsStreaming(true)
    setMessages((prev) => [...prev, { role: "agent", content }])

    setTimeout(() => {
      setMessages((prev) => [...prev, { role: "user", content: `Echo: ${content}` }])
      setIsStreaming(false)
    }, 1000)
  }

  return (
    <ChatContext.Provider value={{ messages, sendMessage, sendAgentMessage, isStreaming }}>
      {children}
    </ChatContext.Provider>
  )
}

export const useChat = () => {
  const context = useContext(ChatContext)
  if (!context) throw new Error("useChat must be used within ChatProvider")
  return context
}
