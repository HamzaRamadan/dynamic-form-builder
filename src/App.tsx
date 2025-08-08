import {  useState } from "react";
import FormBuilder from "./components/FormBuilder/FormBuilder.js";
import FormPreview from "./components/FormPreview/FormPreview.js";
import FormOutput from "./components/FormOutput/FormOutput.js";
import useFormState from "./hooks/useFormState.js";
import ClearConfirmation from "./components/ClearConfirmation/ClearConfirmation.js";
import "./index.css";
import Header from "./components/Header/Header.js";

function App() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [formState, dispatch, { undo, redo, canUndo, canRedo }] =
    useFormState();
  const [submittedData, setSubmittedData] = useState<Record<
    string,
    string
  > | null>(null);

  
  const [activeTab, setActiveTab] = useState("builder");
  const [showClearModal, setShowClearModal] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);

  const handleSubmit = (data: Record<string, string>) => {
    setSubmittedData(data);
    setActiveTab("output");
  };

  return (
    <div className="app-container">
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        canUndo={canUndo}
        canRedo={canRedo}
        undo={undo}
        redo={redo}
        setShowClearModal={setShowClearModal}
        submittedData={submittedData}
      />
      
      <main className="app-main">
        {activeTab === "builder" && (
          <FormBuilder formState={formState} dispatch={dispatch} />
        )}
        {activeTab === "preview" && (
          <FormPreview
            formState={formState}
            dispatch={dispatch}
            onSubmit={handleSubmit}
          />
        )}
        {activeTab === "output" && submittedData && (
          <FormOutput data={submittedData} />
        )}
      </main>
      
      <ClearConfirmation
        visible={showClearModal}
        onCancel={() => setShowClearModal(false)}
        onConfirm={() => {
          dispatch({ type: "RESET_FORM" });
          setSubmittedData(null);
          setShowClearModal(false);
          setActiveTab("builder");
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