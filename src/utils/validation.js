import { getVisibleFields } from './formLogic';

export const validateForm = (formState, fieldValues) => {
  const errors = {};
  
  // Get only visible fields based on current values
  const visibleFields = getVisibleFields(formState, fieldValues);

  visibleFields.forEach(field => {
    // Only validate required fields that are visible
    if (field.required && (!fieldValues[field.id] || fieldValues[field.id].trim() === '')) {
      errors[field.id] = `${field.label} is required`;
    }
  });

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};