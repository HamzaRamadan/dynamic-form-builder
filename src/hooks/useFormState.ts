// src/hooks/useFormState.ts
import { useReducer, useEffect, useState, useCallback } from 'react';
import type { Field, FormState, Action } from '../types/formTypes';

// تهيئة الحالة من localStorage
const initFormState = (): FormState => {
  try {
    const savedForm = localStorage.getItem('formBuilderState');
    if (savedForm) {
      const parsed = JSON.parse(savedForm);
      return {
        fields: parsed.fields || [],
        fieldValues: parsed.fieldValues || {},
      };
    }
  } catch (error) {
    console.error('Failed to load form from localStorage:', error);
  }
  return {
    fields: [],
    fieldValues: {},
  };
};

// ✅ إضافة حالة INTERNAL_UPDATE للـ reducer
function formReducer(state: FormState, action: Action): FormState {
  switch (action.type) {
    case 'ADD_FIELD':
      { const newField = action.payload;
      return {
        ...state,
        fields: [...state.fields, newField],
        fieldValues: {
          ...state.fieldValues,
          [newField.id]: '',
        },
      }; }
    case 'UPDATE_FIELD':
      return {
        ...state,
        fields: state.fields.map((field: Field) =>
          field.id === action.payload.id ? action.payload : field
        ),
      };
    case 'DELETE_FIELD':
      { const updatedFields = state.fields.filter(
        (field: Field) => field.id !== action.payload
      );
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { [action.payload]: removedValue, ...remainingFieldValues } =
        state.fieldValues;
      const cleanedFields = updatedFields.map((field: Field) => ({
        ...field,
        conditions:
          field.conditions?.filter((cond) => cond.fieldId !== action.payload) ||
          [],
      }));
      return {
        ...state,
        fields: cleanedFields,
        fieldValues: remainingFieldValues,
      }; }
    case 'UPDATE_FIELD_VALUE':
      return {
        ...state,
        fieldValues: {
          ...state.fieldValues,
          [action.payload.fieldId]: action.payload.value,
        },
      };
    case 'RESET_FORM':
      localStorage.removeItem('formBuilderState');
      return {
        fields: [],
        fieldValues: {},
      };
    // ✅ إضافة حالة جديدة للتحديث الداخلي (لـ Undo/Redo)
    case 'INTERNAL_UPDATE':
      return action.payload;
    default:
      return state;
  }
}

// ✅ تعريف نوع لحالة Undo/Redo
type HistoryState = {
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
};

// ✅ تعديل الـ hook لدعم Undo/Redo
export default function useFormState(): [FormState, React.Dispatch<Action>, HistoryState] {
  const [state, dispatch] = useReducer(formReducer, undefined, initFormState);
  
  // ✅ إضافة حالة التاريخ
  const [history, setHistory] = useState<FormState[]>([state]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // ✅ تعديل الـ dispatch لتسجيل التاريخ
  const enhancedDispatch = useCallback((action: Action) => {
    // تطبيق الإجراء للحصول على الحالة الجديدة
    const newState = formReducer(state, action);
    
    // تحديث التاريخ
    const newHistory = history.slice(0, currentIndex + 1);
    newHistory.push(newState);
    setHistory(newHistory);
    setCurrentIndex(newHistory.length - 1);
    
    // استدعاء الـ dispatch الأصلي
    dispatch({ type: 'INTERNAL_UPDATE', payload: newState });
  }, [state, history, currentIndex]);

  // ✅ دالة Undo
  const undo = useCallback(() => {
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1;
      setCurrentIndex(newIndex);
      dispatch({ type: 'INTERNAL_UPDATE', payload: history[newIndex] });
    }
  }, [currentIndex, history]);

  // ✅ دالة Redo
  const redo = useCallback(() => {
    if (currentIndex < history.length - 1) {
      const newIndex = currentIndex + 1;
      setCurrentIndex(newIndex);
      dispatch({ type: 'INTERNAL_UPDATE', payload: history[newIndex] });
    }
  }, [currentIndex, history]);

  // ✅ حفظ في localStorage عند تغير الحالة
  useEffect(() => {
    try {
      localStorage.setItem('formBuilderState', JSON.stringify(state));
    } catch (error) {
      console.error('Failed to save form to localStorage:', error);
    }
  }, [state]);

  // ✅ إرجاع الحالة والدوال المحدثة
  return [
    state, 
    enhancedDispatch, 
    { 
      undo, 
      redo, 
      canUndo: currentIndex > 0, 
      canRedo: currentIndex < history.length - 1 
    }
  ];
}