import React, { useState, useEffect } from "react";
import PdfUpload from "./components/PdfUpload";
import QuestionInput from "./components/QuestionInput";
import ResponseDisplay from "./components/ResponseDisplay";
import "./compStyle/style.css";
import "./compStyle/pdfUpload.css";
import axios from 'axios';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import Loader from "./components/loader";


function App() {
  const [pdfFile, setPdfFile] = useState(null);
  const [response, setResponse] = useState("");
  const [resetChat, setResetChat] = useState(false); 
  const [loading, setLoading] = useState(false);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    setPdfFile(file);
    setResetChat(true);


    try {
      const formData = new FormData();
      formData.append('file', file);
      setLoading(true);
      const response = await axios.post('https://pdf-questionanswering-1.onrender.com/upload-pdf', formData);
      console.log(response.data.message);
      alert("PDF uploaded successfully");
   
    } catch (error) {
      alert("File size too large!");
      console.error('Error uploading PDF:', error);
    } finally {
      setLoading(false);
    }
  };

  // https://pdf-questionanswering-1.onrender.com/upload-pdf

  const handleAsk = (res) => {
    setResponse(res);
  };

  useEffect(() => {
    // Add event listener for beforeunload event
    const handleBeforeUnload = async () => {
      try {
        // Make a DELETE request to delete the PDF content
        await axios.delete("https://pdf-questionanswering-1.onrender.com/delete-pdf-content");
        console.log("PDF content deleted successfully");
      } catch (error) {
        console.error("Error deleting PDF content:", error);
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    // Remove event listener on component unmount
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  useEffect(() => {
    // Reset chat state after a short delay to ensure conversation display is cleared
    const timeout = setTimeout(() => {
      setResetChat(false);
    }, 10);
    
    return () => clearTimeout(timeout);
  }, [resetChat]);

  
  return (
    <div>
      <div class="container">
        <div class="logo">
        <a href="https://aiplanet.com/">
          <img src={require("./aiplan.png")} className="d-inline-block align-top" height={80} alt="" />
        </a>
        </div>
 
        <nav>
          <form class="form-inline my-2 my-lg-0">
            <div class="file">
            <p className="filename" style={{paddingRight: '10px'}}>{pdfFile?.name}</p>
              <label for='input-file'>
              <AddCircleOutlineIcon style={{paddingRight: '10px'}}/>Upload PDF
                <input id='input-file' type='file' style={{ display: 'none' }} onChange={handleFileChange} />
              </label>
              {loading && <Loader />}
            </div>
          </form>
        </nav>
        <div className="horizontal-line"></div>
      </div>
      <div>
      
        <PdfUpload  file={pdfFile} /> 
        <QuestionInput  onAsk={handleAsk} pdfFile={pdfFile} resetChat={resetChat}/>
        <ResponseDisplay response={response} />
      </div>
    </div>
  );
}

export default App;
