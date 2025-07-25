// src/components/PromptDialog.jsx
import React, { useState } from 'react';

const overlayStyle = {
  position: 'fixed',
  top: 0, left: 0, right: 0, bottom: 0,
  backgroundColor: 'rgba(0,0,0,0.5)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 999,
};

const dialogStyle = {
  background: 'white',
  borderRadius: '8px',
  padding: '20px',
  width: '300px',
  boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
};

const inputStyle = {
  padding: '8px',
  borderRadius: '4px',
  border: '1px solid #ccc',
  fontSize: '14px',
};

const buttonRowStyle = {
  display: 'flex',
  justifyContent: 'flex-end',
  gap: '10px',
};

const PromptDialog = ({ message, onSubmit, onCancel }) => {
  const [value, setValue] = useState('');

  return (
    <div style={overlayStyle}>
      <div style={dialogStyle}>
        <div style={{ fontWeight: 'bold' }}>{message}</div>
        <input
          type="text"
          style={inputStyle}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          autoFocus
        />
        <div style={buttonRowStyle}>
          <button onClick={onCancel}>Cancel</button>
          <button
            style={{ background: '#059669', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px' }}
            onClick={() => onSubmit(value)}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default PromptDialog;
