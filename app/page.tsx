
"use client"

import { useEffect, useRef, useState } from "react"
import ChatWidget from "../components/chat-widget"
import AgentView from "../components/agent-view"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { useChat } from "../hooks/use-chat"
import { cn } from "../lib/utils"
// import { cn } from "lib/utils"

export default function Home() {
  const [activeTab, setActiveTab] = useState<string>("user")
    const { messages, sendAgentMessage, isStreaming } = useChat()
      const messagesEndRef = useRef<HTMLDivElement>(null)
    
      useEffect(() => {
        if (messagesEndRef.current) {
          messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
        }
      }, [messages])

  const getTabStyle = (tab: string) => {
    const isActive = activeTab === tab
    return {
      backgroundColor: isActive ? "#0a0a0a" : "#2a2a2a", 
      color: isActive ? "#ffffff" : "#cbd5e1",           
      fontWeight: 600,
      borderRadius: "0.75rem",
      padding: "0.5rem 1rem",
      textAlign: "center",
      transition: "all 0.2s ease-in-out",
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold mb-8 mt-10">Chat-App Demo</h1>

      <Tabs defaultValue="user" className="w-full max-w-3xl" onValueChange={setActiveTab}>
        <TabsList
          className="grid w-full grid-cols-2 mb-8 p-1 rounded-xl"
          style={{ backgroundColor: "#1f1f23" }} // outer background (mid grey)
        >
          <TabsTrigger value="user" style={getTabStyle("user")}>User View</TabsTrigger>
          <TabsTrigger value="agent" style={getTabStyle("agent")}>Agent View</TabsTrigger>
        </TabsList>

        <TabsContent value="user" className="flex flex-col items-center">
          <h2 className="text-2xl font-semibold mb-4">User Interface</h2>
          <p className="text-slate-300 mb-8">Click the chat bubble in the bottom-right corner to start chatting.</p>

          <div className="w-full h-[400px] overflow-y-auto p-4 space-y-4 border border-slate-700 rounded-lg p-4 mb-8 bg-slate-800">
        
          {messages.length === 0 ? (
            <div className="text-center text-slate-400 mt-8">No messages yet</div>
          ) : (
            messages.map((message, index) => (
              <div
                key={index}
                className={cn(
                  "max-w-[80%] p-3 rounded-lg",
                  message.role === "user"
                    ? "bg-sky-500 ml-auto rounded-br-none"
                    : "bg-slate-700 rounded-bl-none"
                )}
              >
                <div className="font-semibold text-xs mb-1">
                  {message.role === "user" ? "You" : "Agent"}
                </div>
                {message.content}
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
          {/* </div> */}

          {activeTab === "user" && <ChatWidget />}
        </TabsContent>

        <TabsContent value="agent">
          <AgentView />
        </TabsContent>
      </Tabs>
    </div>
  )
}
