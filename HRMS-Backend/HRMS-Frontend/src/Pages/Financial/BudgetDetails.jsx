import React, { useState } from "react";
import "./financialDetails.css";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const initialData = [
  { quarter: "Q1", budget: 200000, actual: 180000 },
  { quarter: "Q2", budget: 240000, actual: 210000 },
  { quarter: "Q3", budget: 230000, actual: 200000 },
  { quarter: "Q4", budget: 260000, actual: 240000 }
];

export default function BudgetDetails() {
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
      "BudgetVsActual"
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

    saveAs(fileData, "BudgetVsActual.xlsx");
  };

  return (
    <div className="fd-page">
       <button onClick={() => window.history.back()}>
      ← Back
    </button>
     <div className="fd-header">
      <h2>Budget vs Actual</h2>
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
            <th>Quarter</th>
            <th>Budget</th>
            <th>Actual</th>
          </tr>
        </thead>

        <tbody>
          {tableData.map((item, i) => (
            <tr key={i}>
              <td>{item.quarter}</td>
              <td>₹{item.budget}</td>
              <td>₹{item.actual}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}