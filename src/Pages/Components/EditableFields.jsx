import { useState } from "react";
import axios from "axios";
import "./editable_fields.css";

function EditableField({ initialValue, id, field }) {
  const [value, setValue] = useState(initialValue);
  const [isEditing, setIsEditing] = useState(false);

  const handleBlur = async () => {
    setIsEditing(false);

    if (value.trim() !== "") {
      const res = await axios.put(
        `/api/password/${id}`,
        { [field]: value },
        {
          withCredentials: true,
        }
      );

      setValue(res.data.data[field]);
    } else {
      window.alert("Updated value cannot be empty");
      setIsEditing(true);
    }
  };

  return (
    <div>
      {isEditing ? (
        <input
          type="text"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
          }}
          onBlur={handleBlur}
          autoFocus
          className="editable-input"
        />
      ) : (
        <p onClick={() => setIsEditing(true)} className="password-content">
          {value}
        </p>
      )}
    </div>
  );
}

export default EditableField;
