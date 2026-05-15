# CodeSync 🚀  
## Real-Time Collaborative Coding Platform

CodeSync is a modern **real-time collaborative coding platform** that enables multiple users to **write, edit, execute, and discuss code simultaneously** within a shared virtual environment. The platform is designed to solve the limitations of traditional coding platforms that mainly focus on individual coding practice and often lack efficient collaboration capabilities.

CodeSync provides an effective solution for **pair programming, technical interview preparation, remote software development teams, online coding classrooms, and collaborative learning environments**. Users can create coding rooms, invite participants, collaborate on the same codebase in real time, execute code in multiple programming languages, communicate through integrated chat, and receive AI-powered coding assistance.

---

# Key Features

## Real-Time Collaborative Coding
CodeSync allows multiple users to edit code simultaneously in a shared editor. Every code modification is instantly synchronized across all connected participants using **Socket.IO**. The platform also supports cursor tracking, typing indicators, language synchronization, and input synchronization to maintain consistency among users.

## Secure Room Management
Users can create private coding rooms and invite others using a unique room ID. The platform includes a host approval mechanism where guests may require approval before joining a room, ensuring privacy and secure collaboration.

## Role-Based Permission Management
The system implements **Role-Based Access Control (RBAC)** where the room creator acts as the host and can manage participant permissions. Hosts can grant or revoke write access to guests to prevent unauthorized code modifications.

## Multi-Language Code Execution
CodeSync supports multiple programming languages including:
- JavaScript  
- Python  
- Java  
- C++  

The platform integrates with **Judge0 API** to securely compile and execute code while returning outputs and error messages.

## Real-Time Communication
An integrated chat system allows participants to communicate while coding. Users can discuss implementation details, debugging issues, and programming logic in real time.

## AI-Powered Coding Assistant
CodeSync integrates **LangChain** and **Groq** to provide:
- Debugging help  
- Code explanations  
- Optimization suggestions  
- Programming assistance  

## Dashboard and Room History
Users can access previously saved coding rooms and continue unfinished collaboration sessions through their personal dashboard.

---

# System Architecture

```text
Users
   ↓
React Frontend
   ↓
Socket.IO Server
   ↓
----------------------------------------------------
| MongoDB | Judge0 API | AI Service | Cache Layer |
----------------------------------------------------
```

The frontend handles user interactions, the backend manages real-time communication and APIs, MongoDB stores persistent data, cache improves performance, Judge0 executes code, and AI services provide intelligent assistance.

---


# Core Modules

## User Authentication Module
This module handles user registration, login, password reset, and profile management functionalities.

## Room Management Module
This module manages room creation, participant joining, room invitations, and host approval mechanisms.

## Code Synchronization Module
This module ensures real-time synchronization of code changes between multiple users.

## Permission Management Module
This module allows hosts to manage guest permissions for secure collaboration.

## Chat Module
This module provides real-time communication between participants.

## Code Execution Module
This module handles code compilation and execution requests.

## AI Assistant Module
This module provides intelligent coding support and debugging assistance.

## Database Module
This module manages user data, room data, permissions, and collaboration history.

---


# Installation Guide

## Clone Repository

```bash
git clone https://github.com/your-username/codesync.git
cd codesync
```

---

## Backend Setup

```bash
cd backend
npm install
```

Create `.env` file:

```env
PORT=
MONGO_URI=
JWT_SECRET=
JUDGE0_API=
GROQ_API_KEY=
```

Run backend server:

```bash
npm start
```

---

## Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

# Future Enhancements

Future versions of CodeSync may include:

- CRDT-based synchronization  
- GitHub integration  
- Video conferencing  
- Mobile application support  
- More programming language support  
- Self-hosted code execution infrastructure  

---

# Limitations

The current version has some limitations such as:

- Last-write-wins synchronization conflicts  
- Limited programming language support  
- Dependency on third-party APIs  
- Temporary chat storage  

---

# References

- Socket.IO: https://socket.io/docs/v4/  
- Judge0: https://github.com/judge0/judge0  
- React: https://react.dev/  
- MongoDB: https://www.mongodb.com/  
- Monaco Editor: https://microsoft.github.io/monaco-editor/  
- LangChain: https://python.langchain.com/  
- Groq: https://console.groq.com/  

---


# License

This project is licensed under the **MIT License**.
