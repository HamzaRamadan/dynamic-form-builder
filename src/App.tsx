import  { useState } from 'react';
import FormBuilder from './components/FormBuilder.js';
import FormPreview from './components/FormPreview.js';
import FormOutput from './components/FormOutput.js';
import useFormState from './hooks/useFormState.js';
import ClearConfirmation from './components/ClearConfirmation.js';
import './index.css';

function App() {
  const [formState, dispatch] = useFormState();
  const [submittedData, setSubmittedData] = useState<Record<string, string> | null>(null);

  const [activeTab, setActiveTab] = useState('builder');

  const [showClearModal, setShowClearModal] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);

  
const handleSubmit = (data: Record<string, string>) => {
  setSubmittedData(data);
  setActiveTab('output');
};


  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Dynamic Form Builder</h1>
        <div className="tabs">
          <button 
            className={`tab ${activeTab === 'builder' ? 'active' : ''}`}
            onClick={() => setActiveTab('builder')}
          >
            Builder
          </button>
          <button 
            className={`tab ${activeTab === 'preview' ? 'active' : ''}`}
            onClick={() => setActiveTab('preview')}
          >
            Preview
          </button>
          <button 
            className={`tab ${activeTab === 'output' ? 'active' : ''}`}
            onClick={() => setActiveTab('output')}
            disabled={!submittedData}
          >
            Output
          </button>
          <button 
            className={`tab clear-btn`}
            onClick={() => setShowClearModal(true)}
          >
            Clear All Data
          </button>
        </div>
      </header>

      <main className="app-main">
        {activeTab === 'builder' && (
          <FormBuilder 
            formState={formState} 
            dispatch={dispatch} 
          />
        )}
        {activeTab === 'preview' && (
          <FormPreview 
            formState={formState} 
            dispatch={dispatch}
            onSubmit={handleSubmit} 
          />
        )}
        {activeTab === 'output' && submittedData && (
          <FormOutput data={submittedData} />
        )}
      </main>

      
      
      <ClearConfirmation
  visible={showClearModal}
  onCancel={() => setShowClearModal(false)}
  onConfirm={() => {
    dispatch({ type: 'RESET_FORM' });
    setSubmittedData(null);
    setShowClearModal(false);
    setActiveTab('builder');
    setShowSuccessAlert(true);
    setTimeout(() => setShowSuccessAlert(false), 3000);
  }}
  showSuccess={showSuccessAlert}
  title="Confirm Clear Data"
  message="Are you sure you want to clear all form data? This action cannot be undone."
  confirmText="Clear All Data"
  successMessage="Data cleared successfully!"
/>

    </div>
  );
}

export default App;
