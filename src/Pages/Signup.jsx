import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./auth_pages.css";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleSignUp(e) {
    e.preventDefault();
    if (!username || !password) {
      setError("Please enter username and password");
      return;
    }

    try {
      await axios.post(
        "/api/auth/signup",
        { username, password },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("User sign up successfully!");
      navigate("/manager");
    } catch (err) {
      console.log("Error sign up", err);
      if (err.response) {
        const { message } = err.response.data;
        setError(message);
      }
    }
  }

  return (
    <form onSubmit={handleSignUp} className="auth-form">
      <h1 className="signup-txt">SIGN UP</h1>
      {error && <p>{error}</p>}
      <input
        type="text"
        placeholder="new username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="text"
        placeholder="password (at least 6 characters)"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button className="signup-btn">Sign Up</button>
    </form>
  );
}
