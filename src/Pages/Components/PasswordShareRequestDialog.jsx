import { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  List,
  ListItem,
  ListItemText,
  DialogActions,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  dialog: {
    backgroundColor: "#f5f5f5",
  },
  title: {
    color: "#333",
  },
  content: {
    color: "#666",
  },
  button: {
    width: "90px",
    marginLeft: "20px",
    border: "1px solid grey",
    fontSize: "smaller",
  },
  handledButton: {
    width: "90px",
    marginLeft: "20px",
    border: "none",
    fontSize: "smaller",
    fontWeight: "bold",
  },
});
import axios from "axios";

function PasswordShareRequestDialog({ setSharedPasswordList }) {
  const [requests, setRequests] = useState([]);
  const [isOpen, setOpen] = useState(false);
  const [handleRequests, setHandledRequests] = useState({});

  const classes = useStyles();

  useEffect(() => {
    axios
      .get("/api/password/pending-requests", {
        withCredentials: true,
      })
      .then((res) => {
        console.log("Pending requests", res.data);
        setRequests(res.data);
        if (res.data.length > 0) {
          setOpen(true);
        }
      })
      .catch((err) =>
        console.error("Error fetching password share requests:", err)
      );
  }, []);

  function handleAccept(requestId) {
    console.log(requestId);
    axios
      .put(
        `/api/password/share-request/${requestId}`,
        { status: "accepted" },
        { withCredentials: true }
      )
      .then((res) => {
        console.log("accepted request", res.data.data);
        setRequests((prevRequests) =>
          prevRequests.filter((request) => request._id !== requestId)
        );
        setSharedPasswordList((prevList) => [...prevList, res.data.data]);
        setHandledRequests((prev) => ({ ...prev, [requestId]: "accepted" }));
      })
      .catch((err) => {
        console.error("Error accepting password share request:", err);
        setRequests((prevRequests) => [...prevRequests, requestId]);
      });
  }

  function handleReject(requestId) {
    axios
      .put(
        `/api/password/share-request/${requestId}`,
        { status: "rejected" },
        { withCredentials: true }
      )
      .then((res) => {
        console.log("rejected password", res.data.data);
        setRequests((prevRequests) =>
          prevRequests.filter((request) => request._id !== requestId)
        );
        setHandledRequests((prev) => ({ ...prev, [requestId]: "rejected" }));
      })
      .catch((err) => {
        console.error("Error rejecting password share request:", err);
      });
  }

  return (
    <Dialog open={isOpen} className={classes.dialog}>
      <DialogTitle className={classes.title}>
        {"New Password Share Requests"}
      </DialogTitle>
      <DialogContent className={classes.content}>
        <List>
          {requests.map((request) => (
            <ListItem key={request._id}>
              <ListItemText
                primary={`Password share request from ${request.senderName}`}
              />
              <Button
                onClick={() => handleAccept(request.requestId)}
                className={
                  handleRequests[request.requestId] === "accepted"
                    ? classes.handledButton
                    : classes.button
                }
              >
                Accept
              </Button>
              <Button
                onClick={() => handleReject(request.requestId)}
                className={
                  handleRequests[request.requestId] === "rejected"
                    ? classes.handledButton
                    : classes.button
                }
              >
                Reject
              </Button>
            </ListItem>
          ))}
        </List>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => setOpen(false)}
          disabled={Object.keys(handleRequests).length !== requests.length}
        >
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default PasswordShareRequestDialog;
