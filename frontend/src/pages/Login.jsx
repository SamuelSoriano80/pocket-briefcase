import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { login } from "../services/authService";

function Login() {

    const navigate = useNavigate();

    const [email, setEmail] = useState("");

    const [password, setPassword] = useState("");

    const [error, setError] = useState("");

    async function handleLogin(event) {

        event.preventDefault();

        setError("");

        try {

            const token = await login(email, password);

            localStorage.setItem(
                "token",
                token.access_token
            );

            navigate("/dashboard");

        }
        catch {

            setError("Invalid email or password.");

        }

    }

    return (

        <div>

            <h1>Pocket Briefcase</h1>

            <h2>Login</h2>

            <form onSubmit={handleLogin}>

                <div>

                    <label>Email</label>

                    <br />

                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                </div>

                <br />

                <div>

                    <label>Password</label>

                    <br />

                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                </div>

                <br />

                <button type="submit">

                    Login

                </button>

            </form>

            <br />

            <p style={{color: "red"}}>

                {error}

            </p>

        </div>

    );

}

export default Login;