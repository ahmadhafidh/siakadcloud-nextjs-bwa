"use client";
import { useEffect, useState } from "react";

interface StatusOption {
  label: string;
  className: string;
}

const options: StatusOption[] = [
  { label: "-", className: "btn-secondary" },
  { label: "Hadir", className: "btn-success" },
  { label: "Izin", className: "btn-info" },
  { label: "Sakit", className: "btn-warning" },
  { label: "Alfa", className: "btn-danger" },
];

interface AbsensiButtonProps {
  defaultValue?: string | null; // ✅ status awal dari API
  onChange?: (status: string) => void;
}

const AbsensiButton = ({ defaultValue, onChange }: AbsensiButtonProps) => {
  const [index, setIndex] = useState(0);

  // set default index berdasarkan nilai awal
  useEffect(() => {
    if (defaultValue) {
      const foundIndex = options.findIndex(
        (opt) => opt.label.toLowerCase() === defaultValue.toLowerCase()
      );
      if (foundIndex >= 0) {
        setIndex(foundIndex);
      }
    }
  }, [defaultValue]);

  const handleToggle = () => {
    const nextIndex = (index + 1) % options.length;
    setIndex(nextIndex);
    onChange?.(options[nextIndex].label);
  };

  return (
    <button
      type="button"
      className={`btn btn-sm mx-1 ${options[index].className}`}
      onClick={handleToggle}
      style={{ width: 80 }}
    >
      {options[index].label}
    </button>
  );
};

export default AbsensiButton;
