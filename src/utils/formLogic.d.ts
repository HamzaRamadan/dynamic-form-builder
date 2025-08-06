// src/utils/formLogic.d.ts
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { Field, Condition } from '../types/formTypes';

export declare function evaluateConditions(
  field: Field,
  formState: { fields: Field[] },
  fieldValues: Record<string, unknown>
): boolean;

export declare function getVisibleFields(
  formState: { fields: Field[] },
  fieldValues: Record<string, unknown>
): Field[];
