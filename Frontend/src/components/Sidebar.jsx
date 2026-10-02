import "./Sidebar.css";
import logo from "../assets/logo.png";
import { useContext, useEffect, useState } from "react";
import { MyContext } from "./MyContext";
import { v1 as uuidv1 } from "uuid";
import API_URL from "../api";

const getInitials = (name) => {
    return name
        .split(" ")
        .map(word => word[0])
        .join("")
        .toUpperCase();
};

function Sidebar({ onLogout, sidebarOpen, setSidebarOpen }) {
    const [profileOpen, setProfileOpen] = useState(false);
    const [search, setSearch] = useState("");

    const {
        allThreads,
        setAllThreads,
        currThreadId,
        setNewChat,
        setPrompt,
        setReply,
        setCurrThreadId,
        setPrevChats,
        setUserName,
        userName
    } = useContext(MyContext);

    // Get all chats
    const getAllThreads = async () => {
        try {
            const response = await fetch(
                `${API_URL}/api/thread`,
                {
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem("token")}`
                    }
                }
            );

            const res = await response.json();

            if (response.status === 401) {
                onLogout("Your session has expired. Please log in again.");
                return;
            }

            const filteredData = res.map(thread => ({
                threadId: thread.threadId,
                title: thread.title
            }));

            setAllThreads(filteredData);

            console.log(res);

        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        getAllThreads();
    }, [currThreadId]);


    // Create new chat
    const createNewChat = () => {
        setNewChat(true);
        setPrompt("");
        setReply(null);
        setCurrThreadId(uuidv1());
        setPrevChats([]);
        setSidebarOpen(false);
    };


    // Change chat
    const changeThread = async (newThreadId) => {
        setCurrThreadId(newThreadId);
        setSearch("");
        setSidebarOpen(false);

        try {
            const response = await fetch(
                `${API_URL}/api/thread/${newThreadId}`,
                {
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem("token")}`
                    }
                }
            );

            const res = await response.json();

            if (response.status === 401) {
                onLogout("Your session has expired. Please log in again.");
                return;
            }

            console.log(res);

            setPrevChats(res);
            setNewChat(false);
            setReply(null);

        } catch (err) {
            console.log(err);
        }
    };


    // Delete chat
    const deleteThread = async (threadId) => {
        try {
            const response = await fetch(
                `${API_URL}/api/thread/${threadId}`,
                {
                    method: "DELETE",
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem("token")}`
                    }
                }
            );

            const res = await response.json();

            if (response.status === 401) {
                onLogout("Your session has expired. Please log in again.");
                return;
            }

            console.log(res);

            if (response.ok) {

                // Update sidebar only after successful deletion
                setAllThreads(prev =>
                    prev.filter(
                        thread => thread.threadId !== threadId
                    )
                );

                // If deleted chat was the current chat,
                // create a new chat
                if (threadId === currThreadId) {
                    createNewChat();
                }
            }

        } catch (err) {
            console.log(err);
        }
    };


    // Close profile menu when clicking outside
    useEffect(() => {
        const handleClickOutside = () => {
            setProfileOpen(false);
        };

        document.addEventListener("click", handleClickOutside);

        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, []);


    // Get logged-in user's information
    const getUser = async () => {
        try {
            const response = await fetch(
                `${API_URL}/api/auth/me`,
                {
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem("token")}`
                    }
                }
            );

            const res = await response.json();

            if (response.status === 401) {
                onLogout("Your session has expired. Please log in again.");
                return;
            }

            console.log(res);

            if (response.ok) {
                setUserName(res.name);
            }

        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        getUser();
    }, []);


    // Filter chats according to search
    const filteredThreads = allThreads.filter(thread =>
        thread.title.toLowerCase().includes(search.toLowerCase())
    );


    return (
        <section className={`sidebar ${sidebarOpen ? "open" : ""}`}>

            {/* Mobile close button */}
            <button
                type="button"
                className="close-sidebar-btn"
                onClick={() => setSidebarOpen(false)}
            >
                <i className="fa-solid fa-x"></i>
            </button>

            {/* Logo */}
            <div className="sidebar-logo">
                <img
                    src={logo}
                    alt="NovaChat-logo"
                />

                <span>NovaChat</span>
            </div>


            {/* New Chat */}
            <button
                type="button"
                className="new-chat-btn"
                onClick={createNewChat}
            >
                <i className="fa-regular fa-pen-to-square"></i>
                <span>New chat</span>
            </button>


            {/* Search */}
            <div className="search-box">

                <i className="fa-solid fa-magnifying-glass"></i>

                <input
                    type="text"
                    placeholder="Search chats"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

            </div>


            {/* History */}
            <div className="history-sec">

                <h3>Recents</h3>

                <ul className="history-chats">

                    {filteredThreads.length > 0 ? (

                        filteredThreads.map(thread => (

                            <li
                                key={thread.threadId}
                                onClick={() =>
                                    changeThread(thread.threadId)
                                }
                                className={
                                    thread.threadId === currThreadId
                                        ? "highlighted"
                                        : ""
                                }
                            >

                                {thread.title}

                                <i
                                    className="fa-solid fa-trash"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        deleteThread(thread.threadId);
                                    }}
                                ></i>

                            </li>

                        ))

                    ) : (

                        <li className="no-chats">
                            No chats found
                        </li>

                    )}

                </ul>

            </div>


            {/* Account */}
            <div
                className="profile-section"
                onClick={(e) => e.stopPropagation()}
            >

                {profileOpen && (

                    <div className="profile-menu">

                        <button onClick={() => onLogout()}>
                            <i className="fa-solid fa-right-from-bracket"></i>
                            <span>Logout</span>
                        </button>

                    </div>
                )}


                <button
                    className="profile-btn"
                    onClick={(e) => {
                        e.stopPropagation();
                        setProfileOpen(!profileOpen);
                    }}
                >

                    <div className="avatar">
                        {getInitials(userName)}
                    </div>

                    <div className="user-name">
                        <strong>{userName}</strong>
                    </div>

                </button>

            </div>

        </section>
    );
}

export default Sidebar;