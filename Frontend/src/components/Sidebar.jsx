import "./Sidebar.css";
import logo from "../assets/logo.png";
import { useContext, useEffect } from "react";
import { MyContext } from "./MyContext";
import { v1 as uuidv1 } from "uuid";

const getInitials = (name) => {
    return name
        .split(" ")
        .map(word => word[0])
        .join("")
        .toUpperCase();
};

function Sidebar() {

    const { allThreads, setAllThreads, currThreadId, setNewChat, setPrompt, setReply, setCurrThreadId, setPrevChats } = useContext(MyContext);

    const getAllThreads = async () => {
        try {
            const response = await fetch("http://localhost:8080/api/thread");
            const res = await response.json();
            const filteredData = res.map(thread => ({ threadId: thread.threadId, title: thread.title }));
            setAllThreads(filteredData);
            console.log(res);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        getAllThreads();

    }, [currThreadId])

    const userName = "Janhavi Singh";

    const createNewChat = () => {
        setNewChat(true);
        setPrompt("");
        setReply(null);
        setCurrThreadId(uuidv1());
        setPrevChats([]);
    }

    const changeThread = async (newThreadId) => {
        setCurrThreadId(newThreadId);

        try {
            const response = await fetch(`http://localhost:8080/api/thread/${newThreadId}`);
            const res = await response.json();
            console.log(res);
            setPrevChats(res);
            setNewChat(false);
            setReply(null);

        } catch (err) {
            console.log(err);
        }
    }


    const deleteThread = async (threadId) => {
        try {
            const response = await fetch(`http://localhost:8080/api/thread/${threadId}`, { method: "DELETE" });
            const res = await response.json();
            console.log(res);


            //updated threads re-render
            setAllThreads(prev => prev.filter(thread => thread.threadId != threadId));

            if (threadId === currThreadId) {
                createNewChat();
            }

        } catch (err) {
            console.log(err);
        }
    }

    return (
        <section className="sidebar">

            {/* {logo} */}
            <div className="sidebar-logo">
                <img src={logo} alt="NovaChat-logo" />
                <span>NovaChat</span>
            </div>


            {/* {new chat} */}
            <button type="button" className="new-chat-btn" onClick={createNewChat}>
                <i className="fa-regular fa-pen-to-square"></i>
                <span>New chat</span>
            </button>


            {/* {search} */}
            <div className="search-box">
                <i className="fa-solid fa-magnifying-glass"></i>
                <input type="text" placeholder="Search chats" />
            </div>


            {/* {history} */}
            <div className="history-sec">
                <h3>Recents</h3>
                <ul className="history-chats">
                    {
                        allThreads?.map((thread, idx) => (
                            <li key={idx}
                                onClick={(e) => changeThread(thread.threadId)}
                                className={thread.threadId === currThreadId ? "highlighted" : " "}
                            >
                                {thread.title}
                                <i className="fa-solid fa-trash"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        deleteThread(thread.threadId);
                                    }}

                                ></i>
                            </li>
                        ))
                    }
                </ul>
            </div>


            {/* {account} */}


            <button className="profile-btn">
                <div className="avatar">
                    {getInitials(userName)}
                </div>

                <div className="user-name">
                    <strong>{userName}</strong>
                </div>
            </button>
        </section>
    )
}

export default Sidebar;