import React, { useState } from "react";
import "./financialDetails.css";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const initialData = [
  { month: "Jan", cost: 20000 },
  { month: "Feb", cost: 24000 },
  { month: "Mar", cost: 30000 },
  { month: "Apr", cost: 36000 },
  { month: "May", cost: 42000 }
];

export default function PayrollDetails() {
   const [tableData, setTableData] = useState(initialData);
  
     const handleFileUpload = (e) => {
    const file = e.target.files[0];
  
    if (!file) return;
  
    const reader = new FileReader();
  
    reader.onload = (evt) => {
      const workbook = XLSX.read(evt.target.result, {
        type: "binary",
      });
  
      const sheetName = workbook.SheetNames[0];
  
      const worksheet = workbook.Sheets[sheetName];
  
      const uploadedData = XLSX.utils.sheet_to_json(worksheet);
  
      setTableData(uploadedData);
    };
  
    reader.readAsBinaryString(file);
  };
    const exportToExcel = () => {
   const worksheet = XLSX.utils.json_to_sheet(tableData);
  
    const workbook = XLSX.utils.book_new();
  
    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "RevenueExpense"
    );
  
   
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
  
    const fileData = new Blob(
      [excelBuffer],
      {
        type:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      }
    );
  
    saveAs(fileData, "RevenueExpense.xlsx");
  };
  return (
    <div className="fd-page">
       <button onClick={() => window.history.back()}>
      ← Back
    </button>
        <div className="fd-header">
      <h2>Payroll Details</h2>

<div style={{ display: "flex", gap: "10px" }}>
  <input
    type="file"
    accept=".xlsx,.xls"
    onChange={handleFileUpload}
  />
  <button
    className="export-btn"
    onClick={exportToExcel}
  >
    Export Excel
  </button>
</div>
</div>
      <table>
        <thead>
          <tr>
            <th>Month</th>
            <th>Payroll Cost</th>
          </tr>
        </thead>

        <tbody>
          {tableData.map((item, i) => (
            <tr key={i}>
              <td>{item.month}</td>
              <td>₹{item.cost}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}