import { useState } from "react";
import FieldEditor from "../FieldEditor/FieldEditor";
import ConditionEditor from "../ConditionEditor/ConditionEditor";
import ClearConfirmation from "../ClearConfirmation/ClearConfirmation";
import type { Field, Condition } from "../../types/formTypes";
import style from './FormBuilder.module.css'

interface FormState {
  fields: Field[];
}
type Action =
  | { type: "ADD_FIELD"; payload: Field }
  | { type: "UPDATE_FIELD"; payload: Field }
  | { type: "DELETE_FIELD"; payload: string };
type Dispatch = (action: Action) => void;
interface FormBuilderProps {
  formState: FormState;
  dispatch: Dispatch;
}

const FormBuilder: React.FC<FormBuilderProps> = ({ formState, dispatch }) => {
  const [editingField, setEditingField] = useState<Field | null>(null);
  const [showConditionEditor, setShowConditionEditor] = useState<string | false>(false);
  const [fieldToDelete, setFieldToDelete] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [newFieldType, setNewFieldType] = useState<string | null>(null);

  // تعديل دالة إضافة ال label
  const startAddField = (type: string) => {
    // حفظ نوع ال label فقط بدون إضافته للقائمة
    setNewFieldType(type);
    
    const tempField: Field = {
      id: `temp_${Date.now()}`, 
      type,
      label: "", 
      required: false,
      options: type === "dropdown" ? ["Option 1", "Option 2"] : [],
      conditions: [],
    };
    
    setEditingField(tempField);
  };

  // دالة حفظ ال label الجديد
  const saveNewField = (field: Field) => {
    // التحقق من أن ال label يحتوي على اسم على الأقل
    if (!field.label.trim()) {
      alert("Please enter a field label");
      return;
    }
    
    // إنشاء label جديد بمعرف دائم
    const newField = {
      ...field,
      id: `field_${Date.now()}`, 
    };
    
    // إضافة ال label للحالة
    dispatch({ type: "ADD_FIELD", payload: newField });
    setEditingField(null);
    setNewFieldType(null);
    setSuccessMessage("Field added successfully!");
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const updateField = (updatedField: Field) => {
    dispatch({ type: "UPDATE_FIELD", payload: updatedField });
    setEditingField(null);
    setSuccessMessage("Field updated successfully!");
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const confirmDeleteField = (fieldId: string) => {
    setFieldToDelete(fieldId);
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirmed = () => {
    if (!fieldToDelete) return;
    dispatch({ type: "DELETE_FIELD", payload: fieldToDelete });
    if (editingField?.id === fieldToDelete) {
      setEditingField(null);
    }
    setFieldToDelete(null);
    setShowDeleteConfirm(false);
    setSuccessMessage("Field deleted successfully!");
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleDeleteCanceled = () => {
    setFieldToDelete(null);
    setShowDeleteConfirm(false);
  };

  const addCondition = (fieldId: string, condition: Condition) => {
    const field = formState.fields.find((f) => f.id === fieldId);
    if (!field) return;
    const updatedField = {
      ...field,
      conditions: [...field.conditions, condition],
    };
    dispatch({ type: "UPDATE_FIELD", payload: updatedField });
    setShowConditionEditor(false);
  };

  const cancelEditing = () => {
    setEditingField(null);
    setNewFieldType(null);
  };

  return (
    <div className={style.form_builder}>
      <div className={style.builder_controls}>
        <h2>Form Builder</h2>
        <div className={style.field_types}>
          <button onClick={() => startAddField("text")}>
            <span className={style.btn_icon}>📝</span>+ Text
          </button>
          <button onClick={() => startAddField("number")}>
            <span className={style.btn_icon}>🔢</span>+ Number
          </button>
          <button onClick={() => startAddField("dropdown")}>
            <span className={style.btn_icon}>📋</span>
            <span className={style.btn_text}>+ Dropdown Field</span>
          </button>
        </div>
      </div>
      <div className={style.fields_list}>
        {formState.fields.length === 0 ? (
          <div className={style.empty_state}>
            <div className={style.empty_icon}>📝</div>
            <h3>No fields added yet</h3>
            <p>Start by adding a field type above</p>
          </div>
        ) : (
          formState.fields.map((field) => (
            <div key={field.id} className={style.field_item}>
              <div className={style.field_header}>
                <span className={style.field_label}>{field.label}</span>
                <div className={style.field_actions}>
                  <button onClick={() => setEditingField(field)}>Edit</button>
                  <button onClick={() => setShowConditionEditor(field.id)}>
                    Logic
                  </button>
                  <button onClick={() => confirmDeleteField(field.id)}>
                    Delete
                  </button>
                </div>
              </div>
              {field.conditions.length > 0 && (
                <div className={style.field_conditions}>
                  <strong>Conditions:</strong>
                  {field.conditions.map((cond, idx) => (
                    <div key={idx} className={style.condition_item}>
                      Show if {cond.fieldId} {cond.operator} "{cond.value}"
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
      {editingField && (
        <FieldEditor
          field={editingField}
          onSave={newFieldType ? saveNewField : updateField}
          onCancel={cancelEditing}
        />
      )}
      {showConditionEditor && (
        <ConditionEditor
          fieldId={showConditionEditor}
          formFields={formState.fields}
          onSave={addCondition}
          onCancel={() => setShowConditionEditor(false)}
        />
      )}
      <ClearConfirmation
        visible={showDeleteConfirm}
        onCancel={handleDeleteCanceled}
        onConfirm={handleDeleteConfirmed}
        title="Delete Field"
        message="Are you sure you want to delete this field?"
        confirmText="Delete"
        showSuccess={showSuccess}
        successMessage={successMessage}
      />
      {!showDeleteConfirm && showSuccess && (
        <ClearConfirmation
          visible={false}
          onCancel={() => {}}
          onConfirm={() => {}}
          showSuccess={showSuccess}
          successMessage={successMessage}
        />
      )}
    </div>
  );
};

export default FormBuilder;

