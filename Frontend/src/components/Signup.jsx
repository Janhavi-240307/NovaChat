import "./Signup.css";
import logo from "../assets/logo.png";
import { useState } from "react";
import API_URL from "../api";

function Signup({ onLogin }) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPass, setConfirmPass] = useState("");
    const [error, setError] = useState("");

    const handleSignup = async (e) => {
        e.preventDefault();

        setError("");

        if (password !== confirmPass) {
            setError("Passwords do not match");
            return;
        }

        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name,
                email,
                password,
            }),
        };

        try {
            const response = await fetch(
                `${API_URL}/api/auth/signup`,
                options
            );

            const res = await response.json();

            if (response.ok) {
                console.log(res.message);
                onLogin();
            } else {
                setError(res.error);
            }

        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div className="signup-page">

            <div className="signup-card">

                <div className="signup-logo">
                    <div className="signup-title">
                        <img src={logo} alt="NovaChat logo" />

                        <div className="brand-text">
                            <h1>NovaChat</h1>
                            <p>Chat. Learn. Grow.</p>
                        </div>
                    </div>
                </div>

                <div className="signup-heading">
                    <h2>Create your account</h2>
                    <p>Log in to continue to your NovaChat account.</p>
                </div>

                <form className="signup-form" onSubmit={handleSignup}>

                    <label>Full Name</label>
                    <input
                        type="text"
                        placeholder="Enter your full name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />

                    <label>Email</label>
                    <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <label>Password</label>
                    <input
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <label>Confirm Password</label>
                    <input
                        type="password"
                        placeholder="Confirm your password"
                        value={confirmPass}
                        onChange={(e) => setConfirmPass(e.target.value)}
                    />

                    <div className="forgot-password">
                        <span>Forgot password?</span>
                    </div>

                    {error && (
                        <p className="signup-error">
                            {error}
                        </p>
                    )}

                    <button type="submit">
                        Signup
                    </button>

                </form>

                <div className="login-link">
                    <span>Already have an account?</span>
                    <button
                        type="button"
                        onClick={onLogin}
                    >
                        Login
                    </button>
                </div>

            </div>

        </div>
    );
}

export default Signup;