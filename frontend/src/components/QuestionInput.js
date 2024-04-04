import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import "../compStyle/chat.css";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ChatBotIcon from "../images/logo.png";
import FeedbackDialog from "./Feedback";

const QuestionInput = ({ onClose }) => {
  const [userQuestion, setUserQuestion] = useState("");
  const [conversation, setConversation] = useState([]);
  const [askedQuestionsCount, setAskedQuestionsCount] = useState(0);
  const [showFeedbackDialog, setShowFeedbackDialog] = useState(false);

  const askQuestion = async () => {
    if (userQuestion.trim() === "") {
      alert("No question asked!");
      return;
    }
    try {
      const response = await axios.post("https://pdf-questionanswering-1.onrender.com/ask-question", {
        question: userQuestion,
      });
      setConversation((prevConversation) => [
        ...prevConversation,
        { question: userQuestion, answer: response.data.response },
      ]);
      setUserQuestion("");

      setAskedQuestionsCount((prevCount) => prevCount + 1);

      // Check if askedQuestionsCount is equal to 3, then show feedback dialog
      if (askedQuestionsCount === 2) {
        setShowFeedbackDialog(true);
      }
    } catch (error) {
      console.error("Error asking question:", error);
    }
  };

  const handleClose = () => {
    onClose();
  };

  const handleDeleteChat = () => {
    setConversation([]);
  };

  // To Handle feedback submission
  const handleFeedbackSubmit = (feedback) => {  
    console.log("Feedback submitted:", feedback);
  };

  const conversationRef = useRef(null);

  const scrollToBottom = () => {
    if (conversationRef.current) {
      conversationRef.current.scrollTop = conversationRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversation]);

  return (
    <div className="chat-container">
      <div className="conversation-container">
        <div className="conversation" ref={conversationRef}>
          {conversation.map((item, index) => (
            <div key={index} className="message">
              {item.question && (
                <div className="user-message">
                  <AccountCircleIcon
                    className="user-icon"
                    style={{ fontSize: "40px", paddingLeft: "4px" }}
                  />
                  <span className="message-text">{item.question}</span>
                </div>
              )}
              {item.answer && (
                <div className="bot-message">
                  <img
                    src={ChatBotIcon}
                    alt="ChatBot"
                    className="chatbot-icon"
                  />
                  <span className="message-text">{item.answer}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="input-container">
        <div className="chat-bubble">
          <input
            type="text"
            className="question-input"
            value={userQuestion}
            onChange={(e) => setUserQuestion(e.target.value)}
            placeholder="Ask me anything..."
          />
          <button className="submit-button" style={{marginTop: '-59px', marginLeft: '96%'}} onClick={askQuestion}>
            <ArrowUpwardIcon />
          </button>
          
          
        </div>
      </div>
      
      <FeedbackDialog
        open={showFeedbackDialog}
        onClose={() => setShowFeedbackDialog(false)}
        onFeedbackSubmit={handleFeedbackSubmit}
      />
    </div>
  );
};

export default QuestionInput;
