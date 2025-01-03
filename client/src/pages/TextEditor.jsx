import React, { useState } from 'react';
import axios from 'axios';

const TextEditor = () => {
  const [banglishText, setBanglishText] = useState('');
  const [banglaText, setBanglaText] = useState('');

  const handleTranslate = async () => {
    try {
      const response = await axios.post('/api/translate', { text: banglishText });
      setBanglaText(response.data.translation);
    } catch (error) {
      console.error(error);
      alert('Translation failed!');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Banglish to Bangla Text Editor</h2>
      <textarea
        placeholder="Type Banglish text here..."
        value={banglishText}
        onChange={(e) => setBanglishText(e.target.value)}
        style={{ width: '100%', height: '100px', marginBottom: '10px' }}
      />
      <button onClick={handleTranslate}>Translate</button>
      <textarea
        placeholder="Translated Bangla text will appear here..."
        value={banglaText}
        readOnly
        style={{ width: '100%', height: '100px', marginTop: '10px' }}
      />
    </div>
  );
};

export default TextEditor;
