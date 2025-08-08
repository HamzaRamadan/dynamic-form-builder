import React from 'react';
import styles from './Header.module.css';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  canUndo: boolean;
  canRedo: boolean;
  undo: () => void;
  redo: () => void;
  setShowClearModal: (show: boolean) => void;
  submittedData: Record<string, string> | null;
}

const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  canUndo,
  canRedo,
  undo,
  redo,
  setShowClearModal,
  submittedData
}) => {
  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        <h1>Dynamic Form Builder</h1>
        <div className={styles.historyControls}>
          <button
            onClick={undo}
            disabled={!canUndo}
            className={`${styles.historyBtn} ${!canUndo ? styles.disabled : ""}`}
            title="Undo (Ctrl+Z)"
          >
            ↶ Undo
          </button>
          <button
            onClick={redo}
            disabled={!canRedo}
            className={`${styles.historyBtn} ${!canRedo ? styles.disabled : ""}`}
            title="Redo (Ctrl+Y)"
          >
            ↷ Redo
          </button>
        </div>
      </div>
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === "builder" ? styles.active : ""}`}
          onClick={() => setActiveTab("builder")}
        >
          🛠️ Builder
        </button>
        <button
          className={`${styles.tab} ${activeTab === "preview" ? styles.active : ""}`}
          onClick={() => setActiveTab("preview")}
        >
          👁️ Preview
        </button>
        <button
          className={`${styles.tab} ${activeTab === "output" ? styles.active : ""}`}
          onClick={() => setActiveTab("output")}
          disabled={!submittedData}
        >
          📊 Output
        </button>
        <button
          className={`${styles.tab} ${styles.clearBtn}`}
          onClick={() => setShowClearModal(true)}
        >
          Clear All Data
        </button>
      </div>
    </header>
  );
};

export default Header;