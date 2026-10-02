import { useState } from "react";
import "./ForgotPassword.css";

function ForgotPassword({ onBackToLogin }) {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        setMessage("");
        setError("");
        setLoading(true);

        try {
            const response = await fetch(
                "http://localhost:8080/api/auth/forgot-password",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email,
                    }),
                }
            );

            const res = await response.json();

            if (response.ok) {
                setMessage(res.message);
            } else {
                setError(res.error);
            }

        } catch (err) {
            console.log(err);
            setError("Unable to connect to the server.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="forgot-page">

            <div className="forgot-card">

                <h2>Forgot Password?</h2>

                <p>
                    Enter your email and we'll send you a password reset link.
                </p>

                <form onSubmit={handleSubmit}>

                    <label>Email</label>

                    <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    {error && (
                        <p className="forgot-error">{error}</p>
                    )}

                    {message && (
                        <p className="forgot-message">{message}</p>
                    )}

                    <button type="submit" disabled={loading}>
                        {loading ? "Sending..." : "Send Reset Link"}
                    </button>

                </form>

                <button
                    type="button"
                    className="back-login"
                    onClick={onBackToLogin}
                >
                    ← Back to Login
                </button>

            </div>

        </div>
    );
}

export default ForgotPassword;