import { useState } from 'react';
import FieldEditor from './FieldEditor';
import ConditionEditor from './ConditionEditor';
import ClearConfirmation from './ClearConfirmation';
import type { Field, Condition } from '../types/formTypes';

// ✅ أنواع TypeScript
// interface Condition {
//   fieldId: string;
//   operator: string;
//   value: string;
// }

// interface Field {
//   id: string;
//   type: string;
//   label: string;
//   required: boolean;
//   options: string[];
//   conditions: Condition[];
// }

interface FormState {
  fields: Field[];
}

type Action =
  | { type: 'ADD_FIELD'; payload: Field }
  | { type: 'UPDATE_FIELD'; payload: Field }
  | { type: 'DELETE_FIELD'; payload: string };

type Dispatch = (action: Action) => void;

interface FormBuilderProps {
  formState: FormState;
  dispatch: Dispatch;
}

const FormBuilder: React.FC<FormBuilderProps> = ({ formState, dispatch }) => {
  const [editingField, setEditingField] = useState<Field | null>(null);
  const [showConditionEditor, setShowConditionEditor] = useState<string | false>(false);
  const [fieldToDelete, setFieldToDelete] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const [successMessage, setSuccessMessage] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const addField = (type: string) => {
    const newField: Field = {
      id: `field_${Date.now()}`,
      type,
      label: `${type.charAt(0).toUpperCase() + type.slice(1)} Field`,
      required: false,
      options: type === 'dropdown' ? ['Option 1', 'Option 2'] : [],
      conditions: [],
    };
    dispatch({ type: 'ADD_FIELD', payload: newField });
    setEditingField(newField);
  };

  const updateField = (updatedField: Field) => {
    dispatch({ type: 'UPDATE_FIELD', payload: updatedField });
    setEditingField(null);

    setSuccessMessage('Field updated successfully!');
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const confirmDeleteField = (fieldId: string) => {
    setFieldToDelete(fieldId);
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirmed = () => {
    if (!fieldToDelete) return;
    dispatch({ type: 'DELETE_FIELD', payload: fieldToDelete });

    if (editingField?.id === fieldToDelete) {
      setEditingField(null);
    }
    setFieldToDelete(null);
    setShowDeleteConfirm(false);

    setSuccessMessage('Field deleted successfully!');
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleDeleteCanceled = () => {
    setFieldToDelete(null);
    setShowDeleteConfirm(false);
  };

  const addCondition = (fieldId: string, condition: Condition) => {
    const field = formState.fields.find(f => f.id === fieldId);
    if (!field) return;
    const updatedField = {
      ...field,
      conditions: [...field.conditions, condition],
    };
    dispatch({ type: 'UPDATE_FIELD', payload: updatedField });
    setShowConditionEditor(false);
  };

  return (
    <div className="form-builder">
      <div className="builder-controls">
        <h2>Form Builder</h2>
        <div className="field-types">
          <button onClick={() => addField('text')} >
             <span className="btn-icon">📝</span>
            + Text</button>
          <button onClick={() => addField('number')}>
            <span className="btn-icon">🔢</span>
            + Number</button>
          <button 
            onClick={() => addField('dropdown')}
          >
            <span className="btn-icon">📋</span>
            <span className="btn-text">+ Dropdown Field</span>
          </button>
        </div>
      </div>

      <div className="fields-list">
        {formState.fields.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📝</div>
            <h3>No fields added yet</h3>
            <p>Start by adding a field type above</p>
            </div>
              
          // <p>No fields added yet. Start by adding a field type above.</p>
        ) : (
          formState.fields.map((field) => (
            <div key={field.id} className="field-item">
              <div className="field-header">
                <span className="field-label">{field.label}</span>
                <div className="field-actions">
                  <button onClick={() => setEditingField(field)}>Edit</button>
                  <button onClick={() => setShowConditionEditor(field.id)}>Logic</button>
                  <button onClick={() => confirmDeleteField(field.id)}>Delete</button>
                </div>
              </div>

              {field.conditions.length > 0 && (
                <div className="field-conditions">
                  <strong>Conditions:</strong>
                  {field.conditions.map((cond, idx) => (
                    <div key={idx} className="condition-item">
                      Show if {cond.fieldId} {cond.operator} "{cond.value}"
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {editingField && (
        <FieldEditor
          field={editingField}
          onSave={updateField}
          onCancel={() => setEditingField(null)}
        />
      )}

      {showConditionEditor && (
        <ConditionEditor
          fieldId={showConditionEditor}
          formFields={formState.fields}
          onSave={addCondition}
          onCancel={() => setShowConditionEditor(false)}
        />
      )}

      {/* ✅ Confirmation popup for deleting single field */}
      <ClearConfirmation
        visible={showDeleteConfirm}
        onCancel={handleDeleteCanceled}
        onConfirm={handleDeleteConfirmed}
        title="Delete Field"
        message="Are you sure you want to delete this field?"
        confirmText="Delete"
        showSuccess={showSuccess}
        successMessage={successMessage}
      />

      {/* ✅ Alert for success (used in update as well) */}
      {!showDeleteConfirm && showSuccess && (
        <ClearConfirmation
          visible={false}
          onCancel={() => {}}
          onConfirm={() => {}}
          showSuccess={showSuccess}
          successMessage={successMessage}
        />
      )}
    </div>
  );
};

export default FormBuilder;
