import React, { useState } from 'react';
import axios from 'axios';
import '../compStyle/pdfUpload.css';
import QuestionInput from './QuestionInput';
import Summarization from './SummarizeText'; 
import FileUploadIcon from '@mui/icons-material/FileUpload';
import CloseIcon from '@mui/icons-material/Close';


const PdfUpload = ({ onUploadSuccess }) => {
  const [pdfFile, setPdfFile] = useState(null);
  const [extractedText, setExtractedText] = useState('');
  const [showQuestionDialog, setShowQuestionDialog] = useState(false);
  const [showExtractedContent, setShowExtractedContent] = useState(false);

  const handleFileChange = (e) => {
    setPdfFile(e.target.files[0]);
  };

  const ContentBox = ({ content, onClose }) => {
    return (
      <div className="content-box">
        <button className="ask-button" onClick={onClose}>
          <CloseIcon />
        </button>
        <p>{content}</p>
      </div>
    );
  };

  const handleDeleteChat = () => {
    setExtractedText([]);
    setShowExtractedContent(false); // Hide the content box when deleting chat
  };

  const uploadPdf = async () => {
    try {
      const formData = new FormData();
      formData.append('file', pdfFile);

      const response = await axios.post('http://localhost:5000/upload-pdf', formData);
      console.log(response.data.message); 
      setShowQuestionDialog(true); // Show the question dialog after successful upload
      onUploadSuccess && onUploadSuccess(response.data.message); // Call the provided callback function

    } catch (error) {
      console.error('Error uploading PDF:', error);
    }
  };

  const handleView = async () => {
    const response = await axios.post('http://localhost:5000/view');
    console.log(response.data);
    setExtractedText(response.data);
    setShowExtractedContent(true); // Show the content box when viewing
  };

  return (
    <div className="upload-container">
      <div className='button-group'>
        <label htmlFor="file-upload" className="StyledUploadButton hover-effect" style={{ height: '40px', paddingTop: '20px', paddingBottom: '10px' }}>
          <FileUploadIcon />
        </label>
        <input type="file" id="file-upload" onChange={handleFileChange} style={{ display: 'none' }} />
        <button className="StyledUploadButton hover-effect" onClick={uploadPdf} style={{ marginLeft: '10%' }}>
          Submit
        </button>
      </div>
      <p className="filename">{pdfFile?.name}</p>

      {showQuestionDialog && (
        <div className='button-group'>
          <QuestionInput onClose={() => setShowQuestionDialog(false)} />
          { <button className='upload-container hover-effect StyledViewButton' 
            onClick={handleView}>View</button> }
          { <div className='text-container'>
            {showExtractedContent && <ContentBox content={extractedText} onClose={handleDeleteChat} />}
          </div> }

          {/* <Summarization file={pdfFile} /> */}
          
        </div>
      )}
    </div>
  );
};

export default PdfUpload;

