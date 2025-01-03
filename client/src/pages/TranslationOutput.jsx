import React from 'react';

const TranslationOutput = ({ banglaText }) => {
  return (
    <div style={{ marginTop: '20px' }}>
      <h3>Translated Bangla Text:</h3>
      <textarea
        value={banglaText}
        readOnly
        style={{ width: '100%', height: '100px' }}
      />
    </div>
  );
};

export default TranslationOutput;
