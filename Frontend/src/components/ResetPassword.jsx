import { useState } from "react";
import "./ResetPassword.css";

function ResetPassword({ onBackToLogin }) {
    const token = window.location.pathname.split("/")[2];

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        setMessage("");
        setError("");

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(
                `http://localhost:8080/api/auth/reset-password/${token}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        password,
                    }),
                }
            );

            const res = await response.json();

            if (response.ok) {
                setMessage(res.message);
                setPassword("");
                setConfirmPassword("");
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
        <div className="reset-page">

            <div className="reset-card">

                <h2>Reset Password</h2>

                <p>
                    Enter your new password below.
                </p>

                <form onSubmit={handleSubmit}>

                    <label>New Password</label>

                    <input
                        type="password"
                        placeholder="Enter new password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    <label>Confirm Password</label>

                    <input
                        type="password"
                        placeholder="Confirm new password"
                        value={confirmPassword}
                        onChange={(e) =>
                            setConfirmPassword(e.target.value)
                        }
                        required
                    />

                    {error && (
                        <p className="reset-error">
                            {error}
                        </p>
                    )}

                    {message && (
                        <p className="reset-message">
                            {message}
                        </p>
                    )}

                    <button type="submit" disabled={loading}>
                        {loading ? "Resetting..." : "Reset Password"}
                    </button>

                </form>

                {message && (
                    <button
                        type="button"
                        className="back-login"
                        onClick={onBackToLogin}
                    >
                        ← Back to Login
                    </button>
                )}

            </div>

        </div>
    );
}

export default ResetPassword;