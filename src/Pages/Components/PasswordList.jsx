import DeleteButton from "./DeleteButton";
import EditableField from "./EditableFields";
import "./password_list.css";

function PasswordList({ passwordInfos, refreshPasswordList }) {
  return (
    <div className="password-list">
      <div className="title-container">
        <h4 className="url-title">URL</h4>
        <h4 className="password-title">Password</h4>
      </div>

      {passwordInfos &&
        passwordInfos.map((info) => (
          <div key={info._id} className="password-item">
            <EditableField
              initialValue={info.url}
              id={info._id}
              field="url"
              className="url"
            />
            <EditableField
              initialValue={info.password}
              id={info._id}
              field="password"
            />
            <DeleteButton
              id={info._id}
              refreshPasswordList={refreshPasswordList}
            />
          </div>
        ))}
    </div>
  );
}

export default PasswordList;
