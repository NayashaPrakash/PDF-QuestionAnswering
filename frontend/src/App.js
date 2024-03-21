import React, { useState } from "react";
import PdfUpload from "./components/PdfUpload";
import QuestionInput from "./components/QuestionInput";
import ResponseDisplay from "./components/ResponseDisplay";
import "./compStyle/style.css";
import "./compStyle/pdfUpload.css";

function App() {
  const [uploaded, setUploaded] = useState(false);
  const [response, setResponse] = useState("");

  const handleUpload = () => {
    setUploaded(true);
  };

  const handleAsk = (res) => {
    setResponse(res);
  };

  return (
    // <div>
      <div className="home">
        <h1>Query your PDF 💬</h1>
      {!uploaded && <PdfUpload onUpload={handleUpload} />}
      {uploaded && (
        <div>
          <QuestionInput onAsk={handleAsk} />
          <ResponseDisplay response={response} />
        </div>
      )}
      
    </div>
  );
}

export default App;
