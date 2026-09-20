import "./ChatWindow.css";
import Chat from "./Chat.jsx";
import { MyContext } from "./MyContext.jsx";
import { useContext, useState, useEffect } from "react";
import { PulseLoader } from "react-spinners";

function ChatWindow() {
    const {
        prompt,
        setPrompt,
        reply,
        setReply,
        currThreadId,
        prevChats,
        setPrevChats,
        setNewChat,
        newChat
    } = useContext(MyContext);

    const [loading, setLoading] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [renameMode, setRenameMode] = useState(false);
    const [chatName, setChatName] = useState("");

    const getReply = async () => {
        setLoading(true);
        setNewChat(false);

        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                message: prompt,
                threadId: currThreadId
            })
        };

        try {
            const response = await fetch(
                "http://localhost:8080/api/chat",
                options
            );

            const res = await response.json();
            console.log(res);
            setReply(res.reply);

        } catch (err) {
            console.log(err);
        }

        setLoading(false);
    };

    // Append new chat to previous chats
    useEffect(() => {
        if (prompt && reply) {
            setPrevChats(prevChats => [
                ...prevChats,
                {
                    role: "user",
                    content: prompt
                },
                {
                    role: "assistant",
                    content: reply
                }
            ]);
        }

        setPrompt("");
    }, [reply]);

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = () => {
            setMenuOpen(false);
        };

        if (menuOpen) {
            document.addEventListener("click", handleClickOutside);
        }

        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, [menuOpen]);

    return (
        <div className={`chatWindow ${newChat ? "new-chat-window" : ""}`}>

            <div className="navbar">

                {newChat ? (
                    <div className="greeting">
                        <h2>Good evening, Janhavi</h2>
                        <span>Ready to chat?</span>
                    </div>
                ) : (
                    <div className="chat-title">
                        {chatName}
                    </div>
                )}

                {renameMode && (
                    <div className="rename-box">
                        <input
                            type="text"
                            value={chatName}
                            onChange={(e) => setChatName(e.target.value)}
                            placeholder="Enter chat name"
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    setRenameMode(false);
                                }
                            }}
                        />
                    </div>
                )}

                {!newChat && (
                    <>
                        <button
                            className="menu-btn"
                            onClick={(e) => {
                                e.stopPropagation();
                                setMenuOpen(!menuOpen);
                            }}
                        >
                            <i className="fa-solid fa-ellipsis-vertical"></i>
                        </button>

                        {menuOpen && (
                            <div
                                className="chat-menu"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <button
                                    onClick={() => {
                                        setRenameMode(true)
                                        setMenuOpen(false)
                                    }}
                                >
                                    <i className="fa-solid fa-pen"></i>
                                    <span>Rename chat</span>
                                </button>

                                <button>
                                    <i className="fa-solid fa-arrow-up-from-bracket"></i>
                                    <span>Export chat</span>
                                </button>
                            </div>
                        )}
                    </>
                )}

            </div>

            {/* Scrollable chat area */}
            <div className="chat-content">

                <Chat />

                <div className="loader">
                    <PulseLoader
                        color="#171b32"
                        loading={loading}
                        size={8}
                    />
                </div>

            </div>

            <div className="chatInput">
                <div className="inputBox">

                    <button
                        type="button"
                        className="attach-btn"
                    >
                        <i className="fa-solid fa-paperclip"></i>
                    </button>

                    <input
                        type="text"
                        placeholder="Ask Anything"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                getReply();
                            }
                        }}
                    />

                    <button
                        type="button"
                        className="send-btn"
                        onClick={getReply}
                    >
                        <i className="fa-solid fa-paper-plane"></i>
                    </button>

                </div>
            </div>

        </div >
    );
}

export default ChatWindow;