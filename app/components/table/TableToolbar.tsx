"use client";
import React from "react";

interface TableToolbarProps {
  globalFilter: string;
  setGlobalFilter: (value: string) => void;
  pageSize: number;
  setPageSize: (size: number) => void;
}

const TableToolbar: React.FC<TableToolbarProps> = ({
  globalFilter,
  setGlobalFilter,
  pageSize,
  setPageSize,
}) => {
  return (
    <div className="d-flex justify-content-between align-items-center mb-3 mt-2">
      {/* Show entries */}
      <div className="dataTables_length">
        <label>
          Show{" "}
          <select
            className="form-control form-control-sm d-inline-block"
            style={{ width: "auto" }}
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
          >
            {[10, 25, 50, 100].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>{" "}
          entries
        </label>
      </div>

      {/* Search */}
      <div>
        <input
          type="text"
          placeholder="Search..."
          className="form-control form-control-sm"
          value={globalFilter ?? ""}
          onChange={(e) => setGlobalFilter(e.target.value)}
          style={{ width: "200px" }}
        />
      </div>
    </div>
  );
};

export default TableToolbar;
