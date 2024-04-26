import axios from "axios";

function DeleteButton({ id, refreshPasswordList }) {
  async function handleDelete() {
    await axios.delete(`https://api.ledi-password-manager.com/api/password/${id}`, {
      withCredentials: true,
    });
    refreshPasswordList(id);
  }

  const buttonStyle = {
    marginRight: "30px",
    backgroundColor: "#ede9fe",
    cursor: "pointer",
  };

  return (
    <button onClick={handleDelete} style={buttonStyle}>
      ❌
    </button>
  );
}

export default DeleteButton;
