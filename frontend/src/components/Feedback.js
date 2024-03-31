import React, { useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from "@mui/material";

const FeedbackDialog = ({ open, onClose, onFeedbackSubmit }) => {
  const [feedback, setFeedback] = useState("");

  const handleFeedbackChange = (event) => {
    setFeedback(event.target.value);
  };

  const handleSubmit = () => {
    onFeedbackSubmit(feedback);
    setFeedback("");
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Provide Feedback</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Feedback"
          type="text"
          fullWidth
          multiline
          value={feedback}
          onChange={handleFeedbackChange}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FeedbackDialog;
