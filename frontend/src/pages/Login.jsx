import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { login } from "../services/authService";

function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleLogin(event) {
        event.preventDefault();
        setError("");
        setLoading(true);

        try {
            const token = await login(email, password);
            localStorage.setItem("token", token.access_token);
            navigate("/dashboard");
        } catch {
            setError("Invalid email or password.");
            setLoading(false);
        }
    }

    return (
        <div className="login-page">
            <div className="login-card">
                <div className="login-header">
                    <div className="login-icon">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect x="2" y="7" width="20" height="13" rx="2" stroke="var(--primary)" strokeWidth="1.8"/>
                            <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke="var(--primary)" strokeWidth="1.8"/>
                            <path d="M2 12h20" stroke="var(--primary)" strokeWidth="1.8"/>
                            <rect x="10" y="10.5" width="4" height="3" rx="0.5" fill="var(--primary)"/>
                        </svg>
                    </div>
                    <h1 className="login-title">Pocket Briefcase</h1>
                    <p className="login-subtitle">Sign in to manage your cases</p>
                </div>

                <form className="login-form" onSubmit={handleLogin}>
                    <div className="login-field">
                        <label className="login-label">Email</label>
                        <input
                            className="login-input"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="login-field">
                        <label className="login-label">Password</label>
                        <input
                            className="login-input"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    {error && <p className="login-error">{error}</p>}

                    <button className="login-button" type="submit" disabled={loading}>
                        {loading ? "Signing in..." : "Login"}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Login;