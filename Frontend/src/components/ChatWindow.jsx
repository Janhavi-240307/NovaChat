import "./ChatWindow.css";
import Chat from "./Chat.jsx";
import { MyContext } from "./MyContext.jsx";
import { useContext, useState, useEffect } from "react";
import { PulseLoader } from "react-spinners";

function ChatWindow({ onLogout }) {
    const {
        prompt,
        setPrompt,
        reply,
        setReply,
        currThreadId,
        prevChats,
        setPrevChats,
        setNewChat,
        newChat,
        allThreads,
        setAllThreads,
        userName
    } = useContext(MyContext);

    const [loading, setLoading] = useState(false);
    const [lastPrompt, setLastPrompt] = useState("");
    const [menuOpen, setMenuOpen] = useState(false);
    const [renameMode, setRenameMode] = useState(false);
    const [chatName, setChatName] = useState("");
    const [error, setError] = useState("");


    const getReply = async () => {
        if (!prompt.trim() || loading) {
            return;
        }

        const userMessage = prompt;

        setError("");
        setLastPrompt(userMessage);
        setPrompt("");

        setLoading(true);
        setNewChat(false);

        const options = {
            method: "POST",

            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            },

            body: JSON.stringify({
                message: userMessage,
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


            if (response.status === 401) {
                onLogout(
                    "Your session has expired. Please log in again."
                );

                return;
            }


            if (!response.ok) {
                setError(
                    res.error ||
                    "Something went wrong. Please try again."
                );

                return;
            }


            // Add new chat to Recents
            setAllThreads(prevThreads => {

                const exists = prevThreads.some(
                    thread => thread.threadId === currThreadId
                );

                if (exists) {
                    return prevThreads;
                }

                return [
                    {
                        threadId: currThreadId,

                        // Use generated title from backend
                        title: res.title
                    },

                    ...prevThreads
                ];
            });


            setReply(res.reply);

        } catch (err) {
            console.log(err);

            setError(
                "Unable to connect to the server."
            );

        } finally {
            setLoading(false);
        }
    };


    const renameChat = async () => {
        if (!chatName.trim()) {
            return;
        }

        const options = {
            method: "PUT",

            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            },

            body: JSON.stringify({
                title: chatName
            })
        };

        try {
            const response = await fetch(
                `http://localhost:8080/api/thread/${currThreadId}`,
                options
            );

            const res = await response.json();

            console.log(res);


            if (response.status === 401) {
                onLogout(
                    "Your session has expired. Please log in again."
                );

                return;
            }


            if (response.ok) {

                setAllThreads(prevThreads =>
                    prevThreads.map(thread =>
                        thread.threadId === currThreadId
                            ? {
                                ...thread,
                                title: chatName
                            }
                            : thread
                    )
                );

                setRenameMode(false);
                setMenuOpen(false);
            }

        } catch (err) {
            console.log(err);
        }
    };


    const exportChat = () => {

        const chatText = prevChats
            .map(chat => {
                return `${chat.role === "user"
                    ? "You"
                    : "NovaChat"}: ${chat.content}`;
            })
            .join("\n\n");


        const blob = new Blob(
            [chatText],
            {
                type: "text/plain"
            }
        );


        const url = URL.createObjectURL(blob);


        const currentThread = allThreads.find(
            thread => thread.threadId === currThreadId
        );


        const fileName =
            currentThread?.title ||
            "NovaChat-chat";


        const link = document.createElement("a");

        link.href = url;

        link.download =
            `${fileName}.txt`;

        link.click();


        URL.revokeObjectURL(url);
    };


    // Append new chat to previous chats
    useEffect(() => {

        if (lastPrompt && reply) {

            setPrevChats(prevChats => [
                ...prevChats,

                {
                    role: "user",
                    content: lastPrompt
                },

                {
                    role: "assistant",
                    content: reply
                }
            ]);
        }

    }, [reply]);


    // Close menu when clicking outside
    useEffect(() => {

        const handleClickOutside = () => {
            setMenuOpen(false);
            setRenameMode(false);
        };


        if (menuOpen) {
            document.addEventListener(
                "click",
                handleClickOutside
            );
        }


        return () => {
            document.removeEventListener(
                "click",
                handleClickOutside
            );
        };

    }, [menuOpen]);


    return (
        <div
            className={`chatWindow ${newChat ? "new-chat-window" : ""
                }`}
        >

            <div className="navbar">

                {newChat ? (

                    <div className="greeting">

                        <h2>
                            Good evening, {userName}
                        </h2>

                        <span>
                            Ready to chat?
                        </span>

                    </div>

                ) : (

                    <div className="chat-title"></div>

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

                                onClick={(e) =>
                                    e.stopPropagation()
                                }
                            >

                                {renameMode ? (

                                    <input
                                        type="text"
                                        value={chatName}

                                        onChange={(e) =>
                                            setChatName(
                                                e.target.value
                                            )
                                        }

                                        autoFocus

                                        placeholder="Enter chat name"

                                        onKeyDown={(e) => {
                                            if (
                                                e.key === "Enter"
                                            ) {
                                                renameChat();
                                            }
                                        }}
                                    />

                                ) : (

                                    <button
                                        onClick={() => {
                                            setChatName("");
                                            setRenameMode(true);
                                        }}
                                    >

                                        <i className="fa-solid fa-pen"></i>

                                        <span>
                                            Rename chat
                                        </span>

                                    </button>

                                )}


                                <button
                                    onClick={exportChat}
                                >

                                    <i className="fa-solid fa-arrow-up-from-bracket"></i>

                                    <span>
                                        Export chat
                                    </span>

                                </button>

                            </div>

                        )}

                    </>

                )}

            </div>


            {error && (

                <div className="chat-error">
                    {error}
                </div>

            )}


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

                        onChange={(e) =>
                            setPrompt(e.target.value)
                        }

                        onKeyDown={(e) => {

                            if (e.key === "Enter") {
                                getReply();
                            }

                        }}

                        disabled={loading}
                    />


                    <button
                        type="button"
                        className="send-btn"
                        onClick={getReply}
                        disabled={loading}
                    >

                        <i className="fa-solid fa-paper-plane"></i>

                    </button>

                </div>

            </div>

        </div>
    );
}

export default ChatWindow;