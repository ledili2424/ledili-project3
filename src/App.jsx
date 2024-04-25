import { Routes, Route } from "react-router-dom";
import Login from "./Pages/Login";
import PasswordManager from "./Pages/PasswordManager";
import Signup from "./Pages/Signup";
import Layout from "./Layout";
import Home from "./Pages/Home";

import "./App.css";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="/manager" element={<PasswordManager />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Route>
    </Routes>
  );
}

export default App;
