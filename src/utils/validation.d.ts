import type { Field } from '../types/formTypes';

export declare function validateForm(
  formState: { fields: Field[] },
  fieldValues: Record<string, string>
): {
  isValid: boolean;
  errors: Record<string, string>;
};
