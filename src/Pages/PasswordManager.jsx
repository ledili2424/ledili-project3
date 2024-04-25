import { useState, useEffect } from "react";
import axios from "axios";
import "./password_manager.css";
import PasswordList from "./Components/PasswordList";
import SharePasswordForm from "./Components/SharePasswordForm";
import PasswordShareRequestDialog from "./Components/PasswordShareRequestDialog";

export default function PasswordManager() {
  const [url, setUrl] = useState("");
  const [password, setPassword] = useState("");
  const [checkbox, setCheckbox] = useState({
    alphabet: false,
    numerics: false,
    symbols: false,
  });
  const [length, setLength] = useState("");
  const [message, setMessage] = useState("");
  const [passwordList, setPasswordList] = useState([]);
  const [sharedPasswordList, setSharedPasswordList] = useState([]);

  useEffect(() => {
    axios
      .get("/api/password", { withCredentials: true })
      .then((res) => {
        console.log("Get passwords response data:", res.data);
        setPasswordList(res.data);
      })
      .catch((err) => {
        console.error("Error:", err);
      });
  }, []);

  function handleCheckboxChange(e) {
    const { name } = e.target;
    setCheckbox((prev) => ({ ...prev, [name]: !prev[name] }));
  }

  function generateRandomPassword(checkbox, length) {
    const lowerCaseAlphabet = "abcdefghijklmnopqrstuvwxyz";
    const upperCaseAlphabet = lowerCaseAlphabet.toUpperCase();
    const alphabet = lowerCaseAlphabet + upperCaseAlphabet;
    const numerics = "0123456789";
    const symbols = "!@#$%^&*()-_=+";

    let password = "";
    let optionalChars = "";

    optionalChars += checkbox.alphabet ? alphabet : "";
    optionalChars += checkbox.numerics ? numerics : "";
    optionalChars += checkbox.symbols ? symbols : "";

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * optionalChars.length);
      password += optionalChars[randomIndex];
    }
    return password;
  }

  function handleSubmitPassword(e) {
    e.preventDefault();

    if (!url) setMessage("Please enter url!");
    else {
      if (!password) {
        if (
          !length ||
          parseInt(length) < 4 ||
          parseInt(length) > 40 ||
          isNaN(parseInt(length))
        ) {
          setMessage("Password length should be between 4 and 40!");
        } else if (
          checkbox.alphabet === false &&
          checkbox.numerics === false &&
          checkbox.symbols === false
        ) {
          setMessage("Please check at least one box!");
        } else {
          const newPassword = generateRandomPassword(checkbox, length);
          setPassword(newPassword);

          console.log("Password Generated" + newPassword + "!");
          addPassword(newPassword);
        }
      } else {
        addPassword(password);
      }
    }
  }

  function addPassword(password) {
    axios
      .post(
        "/api/password",
        { url, password },
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        console.log("Add Password response data:", res.data);
        setPasswordList((prev) => [...prev, res.data.data]);
      })
      .catch((err) => {
        console.error("Add Password Error:", err);
      });
    setMessage("Password added successfully!");
    setPassword("");
    setUrl("");
    setLength("");
    setCheckbox({
      alphabet: false,
      numerics: false,
      symbols: false,
    });
  }

  const refreshPasswordList = (id) => {
    setPasswordList(passwordList.filter((password) => password._id !== id));
  };

  return (
    <>
      <h2 className="heading">My Passwords</h2>
      <form onSubmit={handleSubmitPassword} className="input-form">
        {message && <p>{message}</p>}
        <input
          type="text"
          placeholder="website URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <input
          type="text"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <input
          type="text"
          placeholder="password length"
          value={length}
          onChange={(e) => setLength(e.target.value)}
        />

        <div className="checkbox">
          <div className="option">
            <input
              type="checkbox"
              id="alphabet"
              name="alphabet"
              checked={checkbox.alphabet}
              onChange={handleCheckboxChange}
              className="option-name"
            />
            <label htmlFor="alphabet">Alphabet</label>
          </div>

          <div className="option">
            <input
              type="checkbox"
              id="numerics"
              name="numerics"
              checked={checkbox.numerics}
              onChange={handleCheckboxChange}
              className="option-name"
            />
            <label htmlFor="numerics">Numerals</label>
          </div>
          <div className="option">
            <input
              type="checkbox"
              id="symbols"
              name="symbols"
              checked={checkbox.symbols}
              onChange={handleCheckboxChange}
              className="option-name"
            />
            <label htmlFor="symbols">Symbols</label>
          </div>
        </div>

        <button className="add-psw-btn">Add Password</button>
      </form>

      <PasswordList
        passwordInfos={passwordList}
        refreshPasswordList={refreshPasswordList}
      />

      <SharePasswordForm
        sharedPasswordList={sharedPasswordList}
        setSharedPasswordList={setSharedPasswordList}
      />
      <PasswordShareRequestDialog
        setSharedPasswordList={setSharedPasswordList}
      />
    </>
  );
}
