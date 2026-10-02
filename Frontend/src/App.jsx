import "./App.css";
import Sidebar from "./components/Sidebar";
import ChatWindow from "./components/ChatWindow";
import { MyContext } from "./components/MyContext";
import { useState, useEffect } from "react";
import { v1 as uuidv1 } from "uuid";
import Signup from "./components/Signup";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import API_URL from "./api";

function App() {
  const [prompt, setPrompt] = useState("");
  const [reply, setReply] = useState(null);
  const [currThreadId, setCurrThreadId] = useState(uuidv1());
  const [prevChats, setPrevChats] = useState([]);
  const [newChat, setNewChat] = useState(true);
  const [allThreads, setAllThreads] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [screen, setScreen] = useState(() => {
    if (window.location.pathname.startsWith("/reset-password/")) {
      return "reset-password";
    }

    return localStorage.getItem("token") ? "dashboard" : "login";
  });

  const [checkingAuth, setCheckingAuth] = useState(true);

  const [authMessage, setAuthMessage] = useState("");

  const [userName, setUserName] = useState("");

  const handleLogout = (message = "") => {
    localStorage.removeItem("token");
    setAuthMessage(message);
    setUserName("");
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
    setAllThreads,

    userName,
    setUserName
  };

  useEffect(() => {
    const verifyToken = async () => {

      if (window.location.pathname.startsWith("/reset-password/")) {
        setCheckingAuth(false);
        return;
      }

      const token = localStorage.getItem("token");

      if (!token) {
        setScreen("login");
        setCheckingAuth(false);
        return;
      }

      try {
        const response = await fetch(
          `${API_URL}/api/auth/me`,
          {
            headers: {
              "Authorization": `Bearer ${token}`
            }
          }
        );

        if (response.ok) {
          const data = await response.json();

          setUserName(data.name);

          setScreen("dashboard");

        } else {
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

  if (checkingAuth) {
    return <div>Loading...</div>;
  }

  if (screen === "login") {
    return (
      <Login
        onSignup={() => setScreen("signup")}

        onLogin={async () => {
          setAuthMessage("");

          const token = localStorage.getItem("token");

          try {
            const response = await fetch(
              `${API_URL}/api/auth/me`,
              {
                headers: {
                  "Authorization": `Bearer ${token}`
                }
              }
            );

            const data = await response.json();

            if (response.ok) {
              setUserName(data.name);
            }

          } catch (err) {
            console.log(err);
          }

          setScreen("dashboard");
        }}

        onForgotPassword={() => setScreen("forgot-password")}

        authMessage={authMessage}
      />
    );
  }

  if (screen === "signup") {
    return (
      <Signup
        onLogin={() => setScreen("login")}
      />
    );
  }

  if (screen === "forgot-password") {
    return (
      <ForgotPassword
        onBackToLogin={() => setScreen("login")}
      />
    );
  }

  if (screen === "reset-password") {
    return (
      <ResetPassword
        onBackToLogin={() => setScreen("login")}
      />
    );
  }

  if (screen === "dashboard") {
    return (
      <Dashboard
        onChat={() => setScreen("chat")}
        userName={userName}
      />
    );
  }

  if (screen === "chat") {
    return (
      <div className="app">
        <MyContext.Provider value={providerValues}>

          <Sidebar
            onLogout={handleLogout}
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
          />

          {sidebarOpen && (
            <div
              className="sidebar-overlay"
              onClick={() => setSidebarOpen(false)}
            ></div>
          )}

          <ChatWindow
            onLogout={handleLogout}
            setSidebarOpen={setSidebarOpen}
          />

        </MyContext.Provider>
      </div>
    );
  }
}

export default App;