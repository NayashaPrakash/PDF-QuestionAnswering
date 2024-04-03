import React, { useState } from "react";
import PdfUpload from "./components/PdfUpload";
import QuestionInput from "./components/QuestionInput";
import ResponseDisplay from "./components/ResponseDisplay";
import "./compStyle/style.css";
import "./compStyle/pdfUpload.css";
import axios from 'axios';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

function App() {
  const [pdfFile, setPdfFile] = useState(null);
  const [response, setResponse] = useState("");

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    setPdfFile(file);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.post('https://pdf-questionanswering-1.onrender.com/upload-pdf', formData);
      console.log(response.data.message);
   
    } catch (error) {
      console.error('Error uploading PDF:', error);
    }
  };

  const handleAsk = (res) => {
    setResponse(res);
  };

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
            </div>
          </form>
        </nav>
        <div className="horizontal-line"></div>
      </div>
      <div>
        <PdfUpload file={pdfFile} /> 
        <QuestionInput onAsk={handleAsk} />
        <ResponseDisplay response={response} />
      </div>
    </div>
  );
}

export default App;
