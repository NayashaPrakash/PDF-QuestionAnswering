import React, { useState, useRef, useEffect } from "react"; 
import axios from "axios";
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import "../compStyle/chat.css";

const QuestionInput = ({ onClose }) => {
  const [userQuestion, setUserQuestion] = useState("");
  const [conversation, setConversation] = useState([]); // Stores conversation history

  const askQuestion = async () => {
    try {
      const response = await axios.post("http://localhost:5000/ask-question", {
        question: userQuestion,
      });
      setConversation((prevConversation) => [
        ...prevConversation,
        { question: userQuestion, answer: response.data.response },
      ]);
      setUserQuestion("");
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

  const conversationRef = useRef(null); // Ref for scrolling to bottom

  const scrollToBottom = () => {
    conversationRef.current.scrollTop = conversationRef.current.scrollHeight;
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversation]); // Scroll to bottom after new message

  return (
<div className="input-container">
      <div className="question-container" ref={conversationRef}>
        {conversation.map((item, index) => (
          <div key={index} className="message">
            {item.question && <p className="question">{item.question}</p>}
            {item.answer && (
              <div className="answer-container">
                <p className="answer">{item.answer}</p>
              </div>
            )}
          </div>
        ))}
   
      <textarea
        className="question-input"
        value={userQuestion}
        onChange={(e) => setUserQuestion(e.target.value)}
        placeholder="Enter your question..."
      />
      <div className="button-cont">
      
      <button className="ask-button" title="Enter" onClick={askQuestion}>
      <ArrowUpwardIcon />
      </button >
      <button
         className="ask-button"
        title="Delete Chat History"
        onClick={handleDeleteChat}
      >
      
        <DeleteIcon sx={{ color: "white" }}/>
   
      </button>
      <button
         className="ask-button"
        title="Closing pdf clears all data"
        onClick={handleDeleteChat}
      >
      
        <CloseIcon sx={{ color: "white" }}/>
   
      </button>
      
      </div>
    </div>
    </div>
  );
};

export default QuestionInput;
