import React, { useState } from 'react';
import style from './FormOutput.module.css';

interface FormOutputProps {
  data: Record<string, unknown>;
}

const FormOutput: React.FC<FormOutputProps> = ({ data }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(data, null, 2));
      setCopied(true);
      
      // إخفاء الرسالة بعد 3 ثواني
      setTimeout(() => {
        setCopied(false);
      }, 3000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
      alert('Failed to copy to clipboard');
    }
  };

  return (
    <div className={style.form_output}>
      <h2>Form Submission Data</h2>
      <pre>{JSON.stringify(data, null, 2)}</pre>
      <button 
        onClick={handleCopy}
        className={copied ? style.copied : ''}
      >
        {copied ? '✓ Copied!' : 'Copy to Clipboard'}
      </button>
      
     
    </div>
  );
};

export default FormOutput;