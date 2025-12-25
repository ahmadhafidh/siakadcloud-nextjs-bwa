"use client";
import React from "react";
import AsyncSelect from "react-select/async";

interface SelectOption {
  label: string;
  value: string;
}

interface FieldConfig {
  label: string;
  name: string;
  type?:
    | "text"
    | "number"
    | "select"
    | "asyncSelect"
    | "textarea"
    | "checkbox"
    | "date"
    | "datetime-local";
  value: string | number | boolean;
  placeholder?: string;
  disabled?: boolean;
  onChange: (
    e:
      | React.ChangeEvent<
          HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
        >
      | SelectOption
      | null
  ) => void;
  options?: SelectOption[];
  loadOptions?: (inputValue: string) => Promise<SelectOption[]>;
}

interface ModalFormProps {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  fields: FieldConfig[];
  submitText?: string;
  cancelText?: string;
}

const ModalEditForm: React.FC<ModalFormProps> = ({
  title,
  isOpen,
  onClose,
  onSubmit,
  fields,
  submitText = "Simpan",
  cancelText = "Batal",
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="modal fade show"
      style={{
        display: "block",
        backgroundColor: "rgba(0,0,0,0.5)",
      }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <form onSubmit={onSubmit}>
            <div className="modal-header">
              <h5 className="modal-title">{title}</h5>
              <button type="button" className="close" onClick={onClose}>
                <span>&times;</span>
              </button>
            </div>

            <div className="modal-body">
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
                      defaultOptions
                      loadOptions={field.loadOptions}
                      value={
                        field.value
                          ? {
                              value: String(field.value),
                              label:
                                field.options?.find(
                                  (opt) => opt.value === field.value
                                )?.label || String(field.value),
                            }
                          : null
                      }
                      onChange={(opt) => field.onChange(opt)}
                      isClearable
                      isSearchable
                      placeholder={field.placeholder}
                    />
                  )}

                  {/* Textarea */}
                  {field.type === "textarea" && (
                    <textarea
                      name={field.name}
                      className="form-control"
                      value={field.value as string}
                      onChange={field.onChange}
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

                  {/* Input default: text, number, date, datetime-local */}
                  {["text", "number", "date", "datetime-local"].includes(
                    field.type || "text"
                  ) && (
                    <input
                      type={field.type}
                      name={field.name}
                      className="form-control"
                      value={field.value as string}
                      onChange={field.onChange}
                      placeholder={field.placeholder}
                      disabled={field.disabled}
                      required
                    />
                  )}
                </div>
              ))}
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary btn-danger"
                onClick={onClose}
              >
                {cancelText}
              </button>
              <button type="submit" className="btn btn-primary">
                {submitText}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ModalEditForm;
