import "./Login.css";
import logo from "../assets/logo.png";
import { useState } from "react";
import API_URL from "../api";

function Login({ onSignup, onLogin, onForgotPassword, authMessage }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();

        setError("");

        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email,
                password,
            }),
        };

        try {
            const response = await fetch(
                `${API_URL}/api/auth/login`,
                options
            );

            const res = await response.json();

            if (response.ok) {
                console.log(res.message);
                localStorage.setItem("token", res.token);
                onLogin();
            } else {
                setError(res.error);
            }

        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div className="login-page">

            <div className="login-card">

                <div className="login-logo">
                    <div className="login-title">
                        <img src={logo} alt="NovaChat logo" />

                        <div className="brand-text">
                            <h1>NovaChat</h1>
                            <p>Chat. Learn. Grow.</p>
                        </div>
                    </div>
                </div>

                <div className="login-heading">
                    <h2>Welcome back!</h2>
                    <p>Log in to continue to your NovaChat account.</p>
                </div>

                {authMessage && (
                    <div className="auth-message">
                        <i className="fa-solid fa-circle-exclamation"></i>
                        <span>{authMessage}</span>
                    </div>
                )}

                <form className="login-form" onSubmit={handleLogin}>

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

                    <div className="forgot-password">
                        <button
                            type="button"
                            onClick={onForgotPassword}
                        >
                            Forgot Password
                        </button>
                    </div>

                    {error && (
                        <p className="login-error">
                            {error}
                        </p>
                    )}

                    <button type="submit">
                        Login
                    </button>

                </form>

                <div className="signup-link">
                    <span>Don't have an account?</span>
                    <button
                        type="button"
                        onClick={onSignup}
                    >
                        Sign up
                    </button>
                </div>

            </div>

        </div>
    );
}

export default Login;