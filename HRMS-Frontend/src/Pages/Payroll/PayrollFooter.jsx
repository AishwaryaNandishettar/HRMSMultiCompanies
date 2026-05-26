import React from "react";
import "./Payroll.css";

const PayrollFooter = ({ currentPage, setCurrentPage, totalPages }) => {
  return (
    <div className="payroll-footer">
      <div className="legend">
        <span className="dot pending" /> Pending
        <span className="dot approved" /> Approved
        <span className="dot rejected" /> Rejected
      </div>

     <div className="pagination">
  <button
    disabled={currentPage === 1}
    onClick={() => setCurrentPage(currentPage - 1)}
  >
    Prev
  </button>

  {Array.from(
    {
      length: Math.min(3, totalPages),
    },
    (_, i) => {
      let pageNumber;

      if (currentPage <= 2) {
        pageNumber = i + 1;
      } else if (currentPage >= totalPages - 1) {
        pageNumber = totalPages - 2 + i;
      } else {
        pageNumber = currentPage - 1 + i;
      }

      return (
        <button
          key={pageNumber}
          className={
            currentPage === pageNumber ? "active" : ""
          }
          onClick={() => setCurrentPage(pageNumber)}
        >
          {pageNumber}
        </button>
      );
    }
  )}

  <button
    disabled={currentPage === totalPages}
    onClick={() => setCurrentPage(currentPage + 1)}
  >
    Next
  </button>
</div>
    </div>
  );
};

export default PayrollFooter;
