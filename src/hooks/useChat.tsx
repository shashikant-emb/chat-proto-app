// "use client"

// import { useState, useEffect } from "react"

// export type Message = {
//   role: "user" | "agent"
//   content: string
// }

// export function useChat() {
//   const [messages, setMessages] = useState<Message[]>([])
//   const [isAgentTyping, setIsAgentTyping] = useState(false)
//   const [isStreaming, setIsStreaming] = useState(false)

//   // Load messages from localStorage on initial render
//   useEffect(() => {
//     const savedMessages = localStorage.getItem("chatMessages")
//     if (savedMessages) {
//       try {
//         setMessages(JSON.parse(savedMessages))
//       } catch (error) {
//         console.error("Failed to parse saved messages:", error)
//       }
//     }
//   }, [])

//   // Save messages to localStorage whenever they change
//   useEffect(() => {
//     localStorage.setItem("chatMessages", JSON.stringify(messages))
//   }, [messages])

//   // Simulate streaming API call
//   const streamResponse = async (userMessage: string) => {
//     setIsStreaming(true)
//     setIsAgentTyping(true)

//     try {
//       // Simulate API call to /stream endpoint
//       const response = await fetch(`/api/stream?msg=${encodeURIComponent(userMessage)}`)

//       if (!response.body) {
//         throw new Error("ReadableStream not supported")
//       }

//       const reader = response.body.getReader()
//       const decoder = new TextDecoder()
//       let agentResponse = ""

//       // Read the stream
//       while (true) {
//         const { value, done } = await reader.read()
//         if (done) break

//         const chunk = decoder.decode(value, { stream: true })
//         agentResponse += chunk

//         // Update the message in real-time as chunks arrive
//         setMessages((prev) => {
//           const newMessages = [...prev]
//           const lastIndex = newMessages.length - 1

//           if (lastIndex >= 0 && newMessages[lastIndex].role === "agent") {
//             newMessages[lastIndex].content = agentResponse
//           } else {
//             newMessages.push({ role: "agent", content: agentResponse })
//           }

//           return newMessages
//         })

//         // Simulate network delay
//         await new Promise((resolve) => setTimeout(resolve, 100))
//       }
//     } catch (error) {
//       console.error("Error streaming response:", error)
//       // Fallback for error cases
//       setMessages((prev) => [...prev, { role: "agent", content: "Sorry, I encountered an error. Please try again." }])
//     } finally {
//       setIsAgentTyping(false)
//       setIsStreaming(false)
//     }
//   }

//   // Send a message as the user
//   const sendMessage = async (content: string) => {
//     const userMessage: Message = { role: "user", content }
//     setMessages((prev) => [...prev, userMessage])

//     // Simulate delay before agent starts typing
//     setTimeout(() => {
//       streamResponse(content)
//     }, 500)
//   }

//   // Send a message as the agent (for agent view)
//   const sendAgentMessage = (content: string) => {
//     const agentMessage: Message = { role: "agent", content }
//     setMessages((prev) => [...prev, agentMessage])
//   }

//   return {
//     messages,
//     isAgentTyping,
//     isStreaming,
//     sendMessage,
//     sendAgentMessage,
//   }
// }



"use client"

import { useState, useRef, useEffect } from "react"

export type Message = {
  role: "user" | "agent"
  content: string
}

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [isAgentTyping, setIsAgentTyping] = useState(false)
  const [isStreaming, setIsStreaming] = useState(false)

  const messagesRef = useRef<Message[]>([])
  const hasMounted = useRef(false)

  // Load messages on first mount
  useEffect(() => {
    const saved = localStorage.getItem("chatMessages")
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setMessages(parsed)
        messagesRef.current = parsed
      } catch (err) {
        console.error("Error parsing chatMessages from localStorage:", err)
      }
    }

    hasMounted.current = true
  }, [])

  // Save to localStorage ONLY after initial mount
  const updateMessages = (newMessages: Message[]) => {
    messagesRef.current = newMessages
    setMessages(newMessages)

    if (hasMounted.current && newMessages.length > 0) {
      // localStorage.setItem("chatMessages", JSON.stringify(newMessages))
    }
  }

  const streamResponse = async (userMessage: string) => {
    setIsStreaming(true)
    setIsAgentTyping(true)

    try {
      const response = await fetch(`/api/stream?msg=${encodeURIComponent(userMessage)}`)
      if (!response.body) throw new Error("No response body")

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let agentResponse = ""

      while (true) {
        const { value, done } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value, { stream: true })
        agentResponse += chunk

        const prev = messagesRef.current
        const updated = [...prev]
        const lastIndex = updated.length - 1

        if (lastIndex >= 0 && updated[lastIndex].role === "agent") {
          updated[lastIndex].content = agentResponse
        } else {
          updated.push({ role: "agent", content: agentResponse })
        }

        updateMessages(updated)
        await new Promise((res) => setTimeout(res, 100))
      }
    } catch (err) {
      console.error("Streaming error:", err)
      updateMessages([
        ...messagesRef.current,
        { role: "agent", content: "Sorry, I encountered an error. Please try again." },
      ])
    } finally {
      setIsAgentTyping(false)
      setIsStreaming(false)
    }
  }

  const sendMessage = async (content: string) => {
    const userMessage: Message = { role: "user", content }
    updateMessages([...messagesRef.current, userMessage])
    setTimeout(() => streamResponse(content), 500)
  }

  const sendAgentMessage = (content: string) => {
    const agentMessage: Message = { role: "agent", content }
    updateMessages([...messagesRef.current, agentMessage])
  }

  return {
    messages,
    isAgentTyping,
    isStreaming,
    sendMessage,
    sendAgentMessage,
  }
}
