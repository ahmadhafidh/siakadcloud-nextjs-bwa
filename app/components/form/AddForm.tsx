"use client";
import React from "react";
import dynamic from "next/dynamic";

// Import react-select secara dinamis, hanya di client
const AsyncSelect = dynamic(() => import("react-select/async"), { ssr: false });

interface SelectOption {
  label: string;
  value: string;
}

export type FieldType =
  | "text"
  | "number"
  | "select"
  | "asyncSelect"
  | "textarea"
  | "checkbox"
  | "date"
  | "datetime-local";

interface FieldConfig {
  label: string;
  name: string;
  type: FieldType;
  value: string | number | boolean;
  onChange: (
    e:
      | React.ChangeEvent<
          HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
        >
      | SelectOption
      | null
  ) => void;
  placeholder?: string;
  disabled?: boolean;
  options?: SelectOption[];
  loadOptions?: (inputValue: string) => Promise<SelectOption[]>;
}

interface DynamicFormProps {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  fields: FieldConfig[];
  submitText?: string;
  cancelText?: string;
  collapseTargetId?: string;
}

const AddForm: React.FC<DynamicFormProps> = ({
  onSubmit,
  fields,
  submitText = "Simpan",
  cancelText = "Batal",
  collapseTargetId,
}) => {
  return (
    <form onSubmit={onSubmit}>
      {fields.map((field, idx) => (
        <div
          className={`form-group ${
            field.type === "checkbox" ? "form-check" : ""
          }`}
          key={idx}
        >
          {field.type !== "checkbox" && <label>{field.label}</label>}

          {/* Select biasa */}
          {field.type === "select" && field.options && (
            <select
              name={field.name}
              className="form-control"
              value={field.value as string}
              onChange={field.onChange}
              required
            >
              <option value="">-- Pilih --</option>
              {field.options.map((opt, i) => (
                <option key={i} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          )}

          {/* Async Select */}
          {field.type === "asyncSelect" && field.loadOptions && (
            <AsyncSelect
              cacheOptions
              defaultOptions={field.options}
              loadOptions={field.loadOptions}
              value={
                field.value
                  ? {
                      value: String(field.value),
                      label:
                        field.options?.find((opt) => opt.value === field.value)
                          ?.label || String(field.value),
                    }
                  : null
              }
              onChange={(opt) => field.onChange(opt as SelectOption | null)}
              isClearable
              isSearchable
              placeholder={field.placeholder}
              required
            />
          )}

          {/* Textarea */}
          {field.type === "textarea" && (
            <textarea
              name={field.name}
              className="form-control"
              value={field.value as string}
              onChange={field.onChange}
              placeholder={field.placeholder}
              disabled={field.disabled}
              required
            />
          )}

          {/* Checkbox */}
          {field.type === "checkbox" && (
            <div className="form-check">
              <input
                type="checkbox"
                name={field.name}
                className="form-check-input"
                checked={field.value as boolean}
                onChange={field.onChange}
              />
              <label className="form-check-label">{field.label}</label>
            </div>
          )}

          {/* Input default */}
          {["text", "number", "date", "datetime-local"].includes(
            field.type
          ) && (
            <input
              type={field.type}
              name={field.name}
              className="form-control"
              value={field.value as string}
              onChange={field.onChange}
              disabled={field.disabled}
              placeholder={field.placeholder}
              required
            />
          )}
        </div>
      ))}

      <button type="submit" className="btn btn-primary">
        {submitText}
      </button>
      {collapseTargetId && ( // ✅ render tombol batal hanya kalau ada collapseTargetId
        <button
          type="button"
          className="btn btn-danger m-2"
          data-toggle="collapse"
          data-target={`#${collapseTargetId}`} // ✅ dinamis
        >
          {cancelText}
        </button>
      )}
    </form>
  );
};

export default AddForm;
