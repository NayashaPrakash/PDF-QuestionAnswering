// frontend/src/components/TranslateText.js
import React, { useState } from 'react';
import axios from 'axios';

const TranslateText = () => {
  const [inputText, setInputText] = useState('');
  const [targetLanguage, setTargetLanguage] = useState('');
  const [translatedText, setTranslatedText] = useState('');

  const translate = async () => {
    try {
      const response = await axios.post('http://localhost:5000/translate', { text: inputText, target_language: targetLanguage });
      setTranslatedText(response.data.translated_text);
    } catch (error) {
      console.error('Error translating text:', error);
    }
  };

  return (
    <div>
      <input type="text" value={inputText} onChange={(e) => setInputText(e.target.value)} />
      <input type="text" placeholder="Target Language" value={targetLanguage} onChange={(e) => setTargetLanguage(e.target.value)} />
      <button onClick={translate}>Translate</button>
      {translatedText && <p>{translatedText}</p>}
    </div>
  );
};

export default TranslateText;
