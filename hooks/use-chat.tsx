"use client"

import { useState, useEffect } from "react"

export type Message = {
  role: "user" | "agent"
  content: string
}

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [isAgentTyping, setIsAgentTyping] = useState(false)
  const [isStreaming, setIsStreaming] = useState(false)

  // Load messages from localStorage on initial render
  useEffect(() => {
    const savedMessages = localStorage.getItem("chatMessages")
    if (savedMessages) {
      try {
        setMessages(JSON.parse(savedMessages))
      } catch (error) {
        console.error("Failed to parse saved messages:", error)
      }
    }
  }, [])

  // Save messages to localStorage whenever they change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem("chatMessages", JSON.stringify(messages))
    }
    // localStorage.setItem("chatMessages", JSON.stringify(messages))
  }, [messages])

  // Simulate streaming API call
  const streamResponse = async (userMessage: string) => {
    setIsStreaming(true)
    setIsAgentTyping(true)

    try {
      // Simulate API call to /stream endpoint
      const response = await fetch(`/api/stream?msg=${encodeURIComponent(userMessage)}`)

      if (!response.body) {
        throw new Error("ReadableStream not supported")
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let agentResponse = ""

      // Read the stream
      while (true) {
        const { value, done } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value, { stream: true })
        agentResponse += chunk

        // Update the message in real-time as chunks arrive
        setMessages((prev) => {
          const newMessages = [...prev]
          const lastIndex = newMessages.length - 1

          if (lastIndex >= 0 && newMessages[lastIndex].role === "agent") {
            newMessages[lastIndex].content = agentResponse
          } else {
            newMessages.push({ role: "agent", content: agentResponse })
          }

          return newMessages
        })

        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 100))
      }
    } catch (error) {
      console.error("Error streaming response:", error)
      // Fallback for error cases
      setMessages((prev) => [...prev, { role: "agent", content: "Sorry, I encountered an error. Please try again." }])
    } finally {
      setIsAgentTyping(false)
      setIsStreaming(false)
    }
  }

  // Send a message as the user
  const sendMessage = async (content: string) => {
    const userMessage: Message = { role: "user", content }
    setMessages((prev) => [...prev, userMessage])

    // Simulate delay before agent starts typing
    setTimeout(() => {
      streamResponse(content)
    }, 500)
  }

  // Send a message as the agent (for agent view)
  const sendAgentMessage = (content: string) => {
    const agentMessage: Message = { role: "agent", content }
    setMessages((prev) => [...prev, agentMessage])
  }

  return {
    messages,
    isAgentTyping,
    isStreaming,
    sendMessage,
    sendAgentMessage,
  }
}
