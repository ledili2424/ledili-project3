import { Link } from "react-router-dom";
import { useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { UserContext } from "./UserContext";
import "./Header.css";

export default function Header() {
  const { userData, setUserData } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("https://psw-backend.onrender.com/api/auth/profile", {
        withCredentials: true,
      })
      .then((res) => {
        console.log("Response from server:", res.data);
        setUserData(res.data);
      })
      .catch((err) => console.log("Error fetching user profile:", err));
  }, [setUserData]);

  function handleLogout() {
    axios
      .post(
        "https://psw-backend.onrender.com/api/auth/logout",
        {},
        {
          withCredentials: true,
        }
      )
      .then(() => {
        console.log("Logged out successfully");
        setUserData(null);
        navigate("/login");
      })
      .catch((err) => console.log("Error logging out:", err));
  }

  const username = userData?.username;

  return (
    <header>
      <nav>
        <Link to="/" className="nav-link">
          Home
        </Link>
        <Link to="/manager" className="nav-link">
          Manage Password
        </Link>
        {username && (
          <div className="auth-div">
            <Link to="/manager" className="username">
              {username}
            </Link>
            <a href="#" className="nav-link" onClick={handleLogout}>
              Log out
            </a>
          </div>
        )}
        {!username && (
          <div className="auth-div">
            <Link to="/login" className="nav-link">
              Log in
            </Link>
            <Link to="/signup" className="nav-link">
              Sign Up
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}
