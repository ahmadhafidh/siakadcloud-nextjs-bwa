import React from "react";

interface PasswordStatusProps {
  status: "active" | "inactive";
}

const PasswordStatus: React.FC<PasswordStatusProps> = ({ status }) => {
  return (
    <span
      className={`btn btn-sm rounded-circle p-0 ${
        status === "inactive" ? "btn-danger" : "btn-success"
      }`}
      style={{
        width: "12px",
        height: "12px",
        minWidth: "12px",
        animation: "blink 3s infinite",
      }}
    >
      <style>
        {`
          @keyframes blink {
            0%, 50%, 100% { opacity: 1; }
            25%, 75% { opacity: 0.3; }
          }
        `}
      </style>
    </span>
  );
};

export default PasswordStatus;
