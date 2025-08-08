import { useState } from 'react';
import style from './ConditionEditor.module.css';

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

  const [notification, setNotification] = useState<string | null>(null);

  const availableFields = formFields.filter(
    (field: FormField) => field.id !== fieldId && field.type !== 'dropdown'
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCondition(prev => ({ ...prev, [name]: value }));
  };

const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();

  // إظهار الرسالة الأول
  setNotification("✅ Condition added successfully!");

  // بعد ثانية ننفذ الحفظ ونقفل
  setTimeout(() => {
    onSave(fieldId, condition);
    setNotification(null);
  }, 1000);
};


  return (
    <div className={style.condition_editor_overlay}>
      
      {/* الـ Notification */}
      {notification && (
        <div style={{
          position: "fixed",
          top: "20px",
          left: "50%",
          transform: "translateX(-50%)",
          backgroundColor: "#4caf50",
          color: "#fff",
          padding: "10px 20px",
          borderRadius: "6px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
          zIndex: 1000
        }}>
          {notification}
        </div>
      )}

      <div className={style.condition_editor}>
        <h3>Add Condition</h3>
        <form onSubmit={handleSubmit}>
          <div className={style.form_group}>
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

          <div className={style.form_group}>
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

          <div className={style.form_group}>
            <label>Value</label>
            <input
              type="text"
              name="value"
              value={condition.value}
              onChange={handleChange}
              required
            />
          </div>

          <div className={style.form_actions}>
            <button type="submit">Add Condition</button>
            <button type="button" onClick={onCancel}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ConditionEditor;
