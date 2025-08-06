import React from 'react';

interface FormOutputProps {
  data: Record<string, unknown>;
}

const FormOutput: React.FC<FormOutputProps> = ({ data }) => {
  return (
    <div className="form-output">
      <h2>Form Submission Data</h2>
      <pre>{JSON.stringify(data, null, 2)}</pre>
      <button onClick={() => navigator.clipboard.writeText(JSON.stringify(data, null, 2))}>
        Copy to Clipboard
      </button>
    </div>
  );
};

export default FormOutput;
