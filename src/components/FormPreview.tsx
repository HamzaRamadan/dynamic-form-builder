import { useState, useEffect,type FormEvent } from 'react';
import { getVisibleFields } from '../utils/formLogic';
import { validateForm } from '../utils/validation';
import type { Field, Action } from '../types/formTypes';

// type Props = {
//   formState: {
//     fields: Field[];
//     fieldValues: Record<string, string>;
//   };
//   dispatch: React.Dispatch<unknown>;
//   onSubmit: (data: Record<string, string>) => void;
// };
type Props = {
  formState: {
    fields: Field[];
    fieldValues: Record<string, string>;
  };
  dispatch: React.Dispatch<Action>; // ✅ هنا التعديل
  onSubmit: (data: Record<string, string>) => void;
};

const FormPreview = ({ formState, dispatch, onSubmit }: Props) => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [localValues, setLocalValues] = useState<Record<string, string>>({});

  useEffect(() => {
    setLocalValues(formState.fieldValues);
  }, [formState.fieldValues]);

  const handleChange = (fieldId: string, value: string) => {
    const newValues = { ...localValues, [fieldId]: value };
    setLocalValues(newValues);

    dispatch({
      type: 'UPDATE_FIELD_VALUE',
      payload: { fieldId, value },
    });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const tempFormState = {
      ...formState,
      fieldValues: localValues,
    };

    const { isValid, errors: validationErrors } = validateForm(tempFormState, localValues);

    if (isValid) {
      const visibleFields = getVisibleFields(tempFormState, localValues);
      const submissionData: Record<string, string> = {};

      visibleFields.forEach((field: Field) => {
        submissionData[field.id] = localValues[field.id] || '';
      });

      onSubmit(submissionData);
    } else {
      setErrors(validationErrors);
    }
  };

  const visibleFields = getVisibleFields(formState, localValues);

  const renderField = (field: Field) => {
    const commonProps = {
      id: field.id,
      value: localValues[field.id] || '',
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
        handleChange(field.id, e.target.value),
      className: errors[field.id] ? 'error' : '',
    };

    switch (field.type) {
      case 'text':
        return <input type="text" {...commonProps} />;
      case 'number':
        return <input type="number" {...commonProps} />;
      case 'dropdown':
        return (
          <select {...commonProps}>
            <option value="">Select an option</option>
            {field.options?.map((option: string, idx: number) => (
              <option key={idx} value={option}>
                {option}
              </option>
            ))}
          </select>
        );
      default:
        return null;
    }
  };

  return (
    <div className="form-preview">
      <h2>Form Preview</h2>
      <div className="debug-info">
        <small>
          Visible fields: {visibleFields.length} | Total fields: {formState.fields.length}
        </small>
      </div>
      <form onSubmit={handleSubmit}>
        {visibleFields.length === 0 ? (
          <p>No fields to display. Add fields in the Builder tab.</p>
        ) : (
          visibleFields.map((field: Field) => (
            <div key={field.id} className="form-group">
              <label htmlFor={field.id}>
                {field.label}
                {field.required && <span className="required">*</span>}
              </label>
              {renderField(field)}
              {errors[field.id] && <div className="error-message">{errors[field.id]}</div>}
            </div>
          ))
        )}

        {visibleFields.length > 0 && (
          <button type="submit" className="submit-btn">
            Submit Form
          </button>
        )}
      </form>
    </div>
  );
};

export default FormPreview;
