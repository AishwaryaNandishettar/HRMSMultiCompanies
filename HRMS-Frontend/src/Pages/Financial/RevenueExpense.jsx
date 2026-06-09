import React, { useState } from "react";
import "./financialDetails.css";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const initialData = [
  { month: "Jan", revenue: 3000, expense: 2000, profit: 1000, loss: 500 },
  { month: "Feb", revenue: 4200, expense: 2800, profit: 1400, loss: 600 },
  { month: "Mar", revenue: 5000, expense: 3400, profit: 1600, loss: 700 },
  { month: "Apr", revenue: 3800, expense: 2600, profit: 1200, loss: 400 },
  { month: "May", revenue: 6200, expense: 4300, profit: 1900, loss: 800 }
];


export default function RevenueExpense() {
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
  <h2>Revenue & Expense Details</h2>

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
            <th>Revenue</th>
            <th>Expense</th>
            <th>Profit</th>
            <th>Loss</th>
          </tr>
        </thead>

        <tbody>
        {tableData.map((item, i) => (
            <tr key={i}>
              <td>{item.month}</td>
              <td>${item.revenue}</td>
              <td>${item.expense}</td>
              <td>${item.profit}</td>
              <td>${item.loss}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}