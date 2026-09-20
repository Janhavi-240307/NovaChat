import "./Dashboard.css";
import logo from "../assets/logo.png";

function Dashboard({ onChat }) {
    return (
        <div className="dash-page">

            <div className="dash-logo">
                <div className="dash-title">

                    <img src={logo} alt="NovaChat logo" />

                    <div className="brand-text">
                        <h1>NovaChat</h1>
                        <p>Chat. Learn. Grow.</p>
                    </div>

                </div>
            </div>


            <div className="dash-heading">
                <h2>Welcome back, Janhavi!</h2>
                <p>What would you like to do today?</p>
            </div>


            <div className="dash-card">

                <div className="chat-mode">

                    <i className="fa-solid fa-comments chat-icon"></i>

                    <h2>Chat Mode</h2>

                    <p>
                        Ask anything, get instant answers, and explore ideas
                        with NovaChat.
                    </p>

                    <button type="button" onClick={onChat}>
                        Start Chatting
                    </button>

                </div>


                <div className="interview-mode">

                    <i className="fa-solid fa-location-crosshairs interview-icon"></i>

                    <h2>Interview Mode</h2>

                    <p>
                        Practice real interview questions and improve
                        your skills.
                    </p>

                    <button type="button" disabled>
                        Coming Soon
                    </button>

                </div>

            </div>

        </div>
    );
}

export default Dashboard;