import { useState,type ChangeEvent,type FormEvent } from 'react';
import { type Field } from '../types/formTypes';

interface FieldEditorProps {
  field: Field;
  onSave: (updatedField: Field) => void;
  onCancel: () => void;
}

// interface Field {
//   id: string;
//   label: string;
//   type: string;
//   required: boolean;
//   options: string[];
// }

interface FieldEditorProps {
  field: Field;
  onSave: (updatedField: Field) => void;
  onCancel: () => void;
}

const FieldEditor = ({ field, onSave, onCancel }: FieldEditorProps) => {
  const [formData, setFormData] = useState<Field>({ ...field });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    setFormData(prev => ({ ...prev, options: newOptions }));
  };

  const addOption = () => {
    setFormData(prev => ({
      ...prev,
      options: [...prev.options, `Option ${prev.options.length + 1}`],
    }));
  };

  const removeOption = (index: number) => {
    if (formData.options.length <= 1) return;
    const newOptions = [...formData.options];
    newOptions.splice(index, 1);
    setFormData(prev => ({ ...prev, options: newOptions }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="field-editor-overlay">
      <div className="field-editor">
        <h3>Edit Field</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Label</label>
            <input
              type="text"
              name="label"
              value={formData.label}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>
              <input
                type="checkbox"
                name="required"
                checked={formData.required}
                onChange={handleChange}
              />
              Required
            </label>
          </div>

          {formData.type === 'dropdown' && (
            <div className="form-group">
              <label>Options</label>
              {formData.options.map((option, index) => (
                <div key={index} className="option-item">
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    required
                  />
                  <button 
                    type="button" 
                    onClick={() => removeOption(index)}
                    disabled={formData.options.length <= 1}
                  >
                    ×
                  </button>
                </div>
              ))}
              <button type="button" onClick={addOption}>
                + Add Option
              </button>
            </div>
          )}

          <div className="form-actions">
            <button type="submit">Save</button>
            <button type="button" onClick={onCancel}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FieldEditor;
