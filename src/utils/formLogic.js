// src/utils/formLogic.js

export const evaluateConditions = (field, formState, fieldValues) => {
  const conditions = Array.isArray(field.conditions) ? field.conditions : [];

  if (conditions.length === 0) {
    return true; 
  }

  return conditions.every(condition => {
    const dependentField = formState.fields.find(f => f.id === condition.fieldId);
    if (!dependentField) return false;

    const dependentValue = fieldValues[condition.fieldId];

    if (dependentValue === undefined || dependentValue === null) {
      return false;
    }

    switch (condition.operator) {
      case 'equals':
        return String(dependentValue).trim() === String(condition.value).trim();
      case 'not_equals':
        return String(dependentValue).trim() !== String(condition.value).trim();
      default:
        return false;
    }
  });
};

export const getVisibleFields = (formState, fieldValues) => {
  return formState.fields.filter(field =>
    evaluateConditions(field, formState, fieldValues)
  );
};
