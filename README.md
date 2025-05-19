# 💬 Chat Prototype – User ↔ Human Agent (Streaming Chat MVP)

This project is an end-to-end **chat prototype** demonstrating:

- Minimal UI design and interaction
- State & cache management
- Real-time message streaming (via SSE)
- Basic user ↔ agent communication interface


▶️ **Watch the demo video**:  
[Click here to view](https://crewaretechnologies157-my.sharepoint.com/:v:/g/personal/shashikant_yadav_creware_asia/ESjO69EMYoBGlc19oGiBa18BNdLjEuQXpzDc1kfTgnLrYA?e=eM4t9V&nav=eyJyZWZlcnJhbEluZm8iOnsicmVmZXJyYWxBcHAiOiJTdHJlYW1XZWJBcHAiLCJyZWZlcnJhbFZpZXciOiJTaGFyZURpYWxvZy1MaW5rIiwicmVmZXJyYWxBcHBQbGF0Zm9ybSI6IldlYiIsInJlZmVycmFsTW9kZSI6InZpZXcifX0%3D)

▶️ **Live Link**:  
[Click here to view]
(https://chat-proto-app.vercel.app/)

## ✨ Features

### 🧩 Chat Widget (User Interface)
- Minimal UI with a chat bubble in the bottom-right
- Expandable chat window with:
  - Input field
  - Scrollable message list
- Different styles for user vs agent messages
- Typing indicator: _"Agent is typing..."_

### 👨‍💼 Agent UI
- Basic interface to simulate human agent replies
- React + TypeScript with real-time message display and input

### 🔄 Streaming API
- Single GET endpoint:  
  `/stream?msg=hello`

### 🧠 State & Cache
- In-memory message state management
- Persist chat history in `localStorage`
- Hydrates chat on reload




---

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Start the development server
npm run dev
