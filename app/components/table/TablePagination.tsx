"use client";
import React from "react";
import { Table as TableType } from "@tanstack/react-table";

interface TablePaginationProps<T> {
  table: TableType<T>;
}

const TablePagination = <T,>({ table }: TablePaginationProps<T>) => {
  const pagination = table.getState().pagination;
  const totalPages = table.getPageCount();
  const currentPage = pagination.pageIndex;
  React.useEffect(() => {
    if (currentPage >= totalPages && totalPages > 0) {
      table.setPageIndex(0);
    }
  }, [currentPage, totalPages, table]);
  const maxVisible = 4; // jumlah halaman maksimal ditampilkan

  // Hitung range halaman
  let start = Math.max(currentPage - Math.floor(maxVisible / 2), 0);
  let end = start + maxVisible;

  if (end > totalPages) {
    end = totalPages;
    start = Math.max(end - maxVisible, 0);
  }

  const pages = Array.from({ length: end - start }, (_, i) => start + i);

  return (
    <div className="d-flex justify-content-between align-items-center mt-3">
      <div>
        Showing{" "}
        {Math.min(
          pagination.pageIndex * pagination.pageSize,
          table.getFilteredRowModel().rows.length
        ) + 1}{" "}
        to{" "}
        {Math.min(
          (pagination.pageIndex + 1) * pagination.pageSize,
          table.getFilteredRowModel().rows.length
        )}{" "}
        of {table.getFilteredRowModel().rows.length} entries
      </div>
      <ul className="pagination mb-0">
        {/* Previous */}
        <li
          className={`paginate_button page-item previous ${
            !table.getCanPreviousPage() ? "disabled" : ""
          }`}
          onClick={(e) => {
            e.preventDefault();
            if (table.getCanPreviousPage()) table.previousPage();
          }}
        >
          <a href="#" className="page-link">
            Previous
          </a>
        </li>

        {/* First Page */}
        {start > 0 && (
          <li
            className="paginate_button page-item"
            onClick={(e) => {
              e.preventDefault();
              table.setPageIndex(0);
            }}
          >
            <a href="#" className="page-link">
              1
            </a>
          </li>
        )}

        {/* Ellipsis sebelum */}
        {start > 1 && (
          <li className="paginate_button page-item disabled">
            <a href="#" className="page-link">
              ...
            </a>
          </li>
        )}

        {/* Halaman dinamis */}
        {pages.map((i) => (
          <li
            key={i}
            className={`paginate_button page-item ${
              currentPage === i ? "active" : ""
            }`}
            onClick={(e) => {
              e.preventDefault();
              table.setPageIndex(i);
            }}
          >
            <a href="#" className="page-link">
              {i + 1}
            </a>
          </li>
        ))}

        {/* Ellipsis sesudah */}
        {end < totalPages - 1 && (
          <li className="paginate_button page-item disabled">
            <a href="#" className="page-link">
              ...
            </a>
          </li>
        )}

        {/* Last Page */}
        {end < totalPages && (
          <li
            className="paginate_button page-item"
            onClick={(e) => {
              e.preventDefault();
              table.setPageIndex(totalPages - 1);
            }}
          >
            <a href="#" className="page-link">
              {totalPages}
            </a>
          </li>
        )}

        {/* Next */}
        <li
          className={`paginate_button page-item next ${
            !table.getCanNextPage() ? "disabled" : ""
          }`}
          onClick={(e) => {
            e.preventDefault();
            if (table.getCanNextPage()) table.nextPage();
          }}
        >
          <a href="#" className="page-link">
            Next
          </a>
        </li>
      </ul>
    </div>
  );
};

export default TablePagination;
