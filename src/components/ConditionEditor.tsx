import { useState } from 'react';

interface FormField {
  id: string;
  label: string;
  type: string;
}

interface Condition {
  fieldId: string;
  operator: string;
  value: string;
}

interface ConditionEditorProps {
  fieldId: string;
  formFields: FormField[];
  onSave: (fieldId: string, condition: Condition) => void;
  onCancel: () => void;
}

const ConditionEditor = ({ fieldId, formFields, onSave, onCancel }: ConditionEditorProps) => {
  const [condition, setCondition] = useState<Condition>({
    fieldId: '',
    operator: 'equals',
    value: '',
  });

  const availableFields = formFields.filter(
    (field: FormField) => field.id !== fieldId && field.type !== 'dropdown'
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCondition(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(fieldId, condition);
  };

  return (
    <div className="condition-editor-overlay">
      <div className="condition-editor">
        <h3>Add Condition</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Field</label>
            <select
              name="fieldId"
              value={condition.fieldId}
              onChange={handleChange}
              required
            >
              <option value="">Select a field</option>
              {availableFields.map((field: FormField) => (
                <option key={field.id} value={field.id}>
                  {field.label}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Operator</label>
            <select
              name="operator"
              value={condition.operator}
              onChange={handleChange}
            >
              <option value="equals">Equals</option>
              <option value="not_equals">Not Equals</option>
            </select>
          </div>

          <div className="form-group">
            <label>Value</label>
            <input
              type="text"
              name="value"
              value={condition.value}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-actions">
            <button type="submit">Add Condition</button>
            <button type="button" onClick={onCancel}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ConditionEditor;
