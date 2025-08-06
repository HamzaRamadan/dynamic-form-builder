export const evaluateConditions = (field, formState, fieldValues) => {
  if (!field.conditions || field.conditions.length === 0) {
    return true; // Show field if no conditions
  }

  return field.conditions.every(condition => {
    const dependentField = formState.fields.find(f => f.id === condition.fieldId);
    if (!dependentField) return false;

    const dependentValue = fieldValues[condition.fieldId];
    
    // Handle undefined/null values
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