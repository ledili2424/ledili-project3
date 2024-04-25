import { useContext, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./auth_pages.css";
import { UserContext } from "../UserContext";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { setUserData } = useContext(UserContext);

  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();
    if (!username || !password) {
      setError("Please enter username and password");
      return;
    }

    try {
      const response = await axios.post(
        "/api/auth/login",
        { username, password },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      console.log("User log in successfully!");
      console.log("Log in user data", response.data);
      setUserData(response.data.data);
      navigate("/manager");
    } catch (err) {
      console.log("Error log in", err);
      if (err.response) {
        const { message } = err.response.data;
        setError(message);
      }
    }
  }
  return (
    <form onSubmit={handleLogin} className="auth-form">
      <h1 className="login-txt">LOG IN</h1>
      {error && <p>{error}</p>}
      <input
        type="text"
        placeholder="username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="text"
        placeholder="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button className="login-btn">Log in</button>
    </form>
  );
}
