import "./App.css";
import Sidebar from "./components/Sidebar";
import ChatWindow from "./components/ChatWindow";
import { MyContext } from "./components/MyContext";
import { useState } from "react";
import { v1 as uuidv1 } from "uuid";
import Signup from "./components/Signup";
import Login from "./components/Login";
import Dashboard from "./components/DashBoard";

function App() {
  const [prompt, setPrompt] = useState("");
  const [reply, setReply] = useState(null);
  const [currThreadId, setCurrThreadId] = useState(uuidv1());
  const [prevChats, setPrevChats] = useState([]); //store all chats of curr threads
  const [newChat, setNewChat] = useState(true);
  const [allThreads, setAllThreads] = useState([]);
  const [screen, setScreen] = useState("login");

  const providerValues = {
    prompt,
    setPrompt,
    reply,
    setReply,
    currThreadId,
    setCurrThreadId,
    newChat, setNewChat,
    prevChats, setPrevChats,
    allThreads, setAllThreads
  }; //passing values


  if (screen == "login") {
    return (
      <Login
        onSignup={() => setScreen("signup")}
        onLogin={() => setScreen("dashboard")}
      />
    );
  }

  if (screen == "signup") {
    return (
      <Signup
        onLogin={() => setScreen("login")}
      />
    );
  }

  if (screen == "dashboard") {
    return (
      <Dashboard
        onChat={() => setScreen("chat")}
      />
    );
  }

  if (screen == "chat") {
    return (
      <div className="app">
        <MyContext.Provider value={providerValues}>
          <Sidebar></Sidebar>
          <ChatWindow></ChatWindow>
        </MyContext.Provider>
      </div>
    );

  }

}

export default App;



