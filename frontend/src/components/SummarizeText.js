import React, { useState } from 'react';
import axios from 'axios';
import '../compStyle/pdfUpload.css';

const SummarizeText = () => {
  const [inputText, setInputText] = useState('');
  const [summary, setSummary] = useState('');

  const summarize = async () => {
    try {
      const response = await axios.post('http://localhost:5000/summarize', { text: inputText });
      setSummary(response.data.summary);
    } catch (error) {
      console.error('Error summarizing text:', error);
    }
  };

  return (
    <div>
      <button className='StyledViewButton' onClick={summarize}>Summarize</button>
      <div className='text-container'>
      {summary && <p>{summary}</p>}
      </div>
    </div>
  );
};

export default SummarizeText;
