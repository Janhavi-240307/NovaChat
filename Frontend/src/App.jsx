import "./App.css";
import Sidebar from "./components/Sidebar";
import ChatWindow from "./components/ChatWindow";
import { MyContext } from "./components/MyContext";
import { useState, useEffect } from "react";
import { v1 as uuidv1 } from "uuid";
import Signup from "./components/Signup";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";

function App() {
  const [prompt, setPrompt] = useState("");
  const [reply, setReply] = useState(null);
  const [currThreadId, setCurrThreadId] = useState(uuidv1());
  const [prevChats, setPrevChats] = useState([]);
  const [newChat, setNewChat] = useState(true);
  const [allThreads, setAllThreads] = useState([]);

  const [screen, setScreen] = useState(
    localStorage.getItem("token") ? "dashboard" : "login"
  );

  const [checkingAuth, setCheckingAuth] = useState(true);

  // Message shown on Login screen when authentication fails
  const [authMessage, setAuthMessage] = useState("");

  // Logout user
  const handleLogout = (message = "") => {
    localStorage.removeItem("token");
    setAuthMessage(message);
    setScreen("login");
  };

  const providerValues = {
    prompt,
    setPrompt,

    reply,
    setReply,

    currThreadId,
    setCurrThreadId,

    newChat,
    setNewChat,

    prevChats,
    setPrevChats,

    allThreads,
    setAllThreads
  };

  // Verify token when application starts
  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem("token");

      // No token → go to Login
      if (!token) {
        setScreen("login");
        setCheckingAuth(false);
        return;
      }

      try {
        const response = await fetch(
          "http://localhost:8080/api/auth/me",
          {
            headers: {
              "Authorization": `Bearer ${token}`
            }
          }
        );

        if (response.ok) {
          // Token is valid
          setScreen("dashboard");
        } else {
          // Token is invalid or expired
          localStorage.removeItem("token");

          if (response.status === 401) {
            setAuthMessage(
              "Your session has expired. Please log in again."
            );
          }

          setScreen("login");
        }

      } catch (err) {
        console.log(err);
        setScreen("login");
      }

      setCheckingAuth(false);
    };

    verifyToken();

  }, []);

  // Don't show Login/Dashboard until token verification is finished
  if (checkingAuth) {
    return <div>Loading...</div>;
  }

  // Login screen
  if (screen === "login") {
    return (
      <Login
        onSignup={() => setScreen("signup")}

        onLogin={() => {
          // Remove old authentication message
          setAuthMessage("");
          setScreen("dashboard");
        }}

        authMessage={authMessage}
      />
    );
  }

  // Signup screen
  if (screen === "signup") {
    return (
      <Signup
        onLogin={() => setScreen("login")}
      />
    );
  }

  // Dashboard screen
  if (screen === "dashboard") {
    return (
      <Dashboard
        onChat={() => setScreen("chat")}
      />
    );
  }

  // Chat screen
  if (screen === "chat") {
    return (
      <div className="app">
        <MyContext.Provider value={providerValues}>

          <Sidebar
            onLogout={handleLogout}
          />

          <ChatWindow
            onLogout={handleLogout}
          />

        </MyContext.Provider>
      </div>
    );
  }
}

export default App;