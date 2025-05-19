"use client"

import { useState } from "react"
import ChatWidget from "./components/ChatWidget"
import AgentView from "./components/AgentView"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs"

function App() {
  const [activeTab, setActiveTab] = useState<string>("user")

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold mb-8 mt-10">Chat-App Demo</h1>

      <Tabs defaultValue="user" className="w-full max-w-3xl" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="user">User View</TabsTrigger>
          <TabsTrigger value="agent">Agent View</TabsTrigger>
        </TabsList>

        <TabsContent value="user" className="flex flex-col items-center">
          <h2 className="text-2xl font-semibold mb-4">User Interface</h2>
          <p className="text-slate-300 mb-8">Click the chat bubble in the bottom-right corner to start chatting.</p>

          <div className="w-full h-[400px] border border-slate-700 rounded-lg p-4 mb-8">
            <div className="text-center text-slate-400">Application Content Area-2</div>
          </div>

          {activeTab === "user" && <ChatWidget />}
        </TabsContent>

        <TabsContent value="agent">
          <AgentView />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default App
