export default function SharedPasswordList({ sharedPasswordInfos }) {
  return (
    <div className="password-list">
      <div className="shared-title-container">
        <h4 className="shared-url-title">URL</h4>
        <h4 className="password-title">Password</h4>
        <h4 className="password-title">Password Owner</h4>
      </div>
      {sharedPasswordInfos &&
        sharedPasswordInfos.map(
          (info) =>
            info && (
              <div key={info.requestId} className="shared-password-item">
                <p className="password-content">{info.url}</p>
                <p className="password-content">{info.password}</p>
                <p className="password-content">{info.senderName}</p>
              </div>
            )
        )}
    </div>
  );
}
