import React, { useState } from 'react';
import axios from 'axios';
import '../compStyle/pdfUpload.css';
import QuestionInput from './QuestionInput';
import VisibilityIcon from '@mui/icons-material/Visibility';

const PdfUpload = ({ file, onUploadSuccess }) => {
  const [extractedText, setExtractedText] = useState('');
  const [showQuestionDialog, setShowQuestionDialog] = useState(false);



  const handleView = async () => {
    const response = await axios.post('https://pdf-questionanswering-1.onrender.com/view');
    console.log(response.data);
    setExtractedText(response.data);
    setShowQuestionDialog(true);

  };


  return (
    <div className="upload-container">
      

      {showQuestionDialog && (
        <div className='button-group'>
          <QuestionInput onClose={() => setShowQuestionDialog(false)}  />
          <button className='upload-container hover-effect StyledViewButton' onClick={handleView}>
            <VisibilityIcon /> View
          </button>
        </div>
      )}

      {/* Conditionally render content box outside of question dialog */}
      {extractedText && (
        <div className="text-container">
          <div className="content-box">
            <button className="ask-button" onClick={() => setExtractedText('')}>
              Close
            </button>
            <p>{extractedText}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PdfUpload;
