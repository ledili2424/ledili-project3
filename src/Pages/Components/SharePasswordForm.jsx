import { useState, useEffect } from "react";
import axios from "axios";
import SharedPasswordList from "./SharedPasswordList";

export default function SharePasswordForm({sharedPasswordList, setSharedPasswordList}) {
  const [message, setMessage] = useState("");
  const [url, setUrl] = useState("");
  const [receiverName, setReceiverName] = useState("");

  useEffect(() => {
    const getSharedPassword = async () => {
      try {
        const res = await axios.get("/api/password/shared", {
          withCredentials: true,
        });
        console.log("Get shared passwords response data:", res.data);
        setSharedPasswordList(res.data);
      } catch (err) {
        console.error("Error get shared passwords:", err);
      }
    };
    getSharedPassword();
  }, [setSharedPasswordList]);

  function handleSubmitShareRequest(e) {
    e.preventDefault();
    if (!url || !receiverName) {
      setMessage("Please enter url and receiver!");
    } else {
      axios
        .post(
          "/api/password/share-request",
          { receiverName, url },
          {
            withCredentials: true,
          }
        )
        .then((res) => {
          console.log("Share Password response data:", res.data);
          setMessage("Password sent successfully!");
          setReceiverName("")
          setUrl("")
        })
        .catch((err) => {
          console.error("Share Password Error:", err);
          if (err.response) {
            const { message } = err.response.data;
            setMessage(message);
          }
        });
    }
  }

  return (
    <>
      <h2 className="shared-heading">Share Password</h2>
      <form onSubmit={handleSubmitShareRequest} className="input-form">
        {message && <p>{message}</p>}
        <input
          type="text"
          placeholder="website URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <input
          type="text"
          placeholder="receiver"
          value={receiverName}
          onChange={(e) => setReceiverName(e.target.value)}
        />
        <button className="add-psw-btn">Share Password</button>
      </form>

      <h2 className="shared-heading">Received Passwords</h2>
      <SharedPasswordList sharedPasswordInfos={sharedPasswordList}/>
    </>
  );
}
