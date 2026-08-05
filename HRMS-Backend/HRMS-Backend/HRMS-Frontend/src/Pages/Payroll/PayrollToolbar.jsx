import { FaFilter } from "react-icons/fa";

const PayrollToolbar = ({
  search,
  setSearch,
  fromMonth,
  setFromMonth,
  toMonth,
  setToMonth,
  sortType,
  setSortType,
  columnFilters,
  setColumnFilters,
  onExport,
  onUpdatePayroll,
  onProcessAll   // ✅ ADD THIS LINE
}) => {
  return (
    <div className="payroll-toolbar">
      <input
        type="text"
        placeholder="Search employee or department..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <input
        type="month"
        value={fromMonth}
        onChange={(e) => setFromMonth(e.target.value)}
      />

      <input
        type="month"
        value={toMonth}
        onChange={(e) => setToMonth(e.target.value)}
      />

      <select value={sortType} onChange={(e) => setSortType(e.target.value)}>
        <option value="">Sort</option>
        <option value="high">High Salary (6L+)</option>
        <option value="low">Low Salary</option>
      </select>

      {(search || fromMonth || toMonth || sortType || Object.keys(columnFilters || {}).some(key => columnFilters[key])) && (
        <button
          onClick={() => {
            setSearch("");
            setFromMonth("");
            setToMonth("");
            setSortType("");
            if (setColumnFilters) {
              setColumnFilters({});
            }
          }}
          style={{
            padding: "6px 12px",
            borderRadius: "6px",
            border: "1px solid #ccc",
            cursor: "pointer",
            background: "#f5f5f5"
          }}
        >
          Clear Filters
        </button>
      )}

    

      <button className="btn-secondary" onClick={onExport}>Export</button>

     
     {onProcessAll && (
  <button className="btn-primary" onClick={onProcessAll}>
    Process All Payroll
  </button>
)}
    
    </div>
  );
};

export default PayrollToolbar;
