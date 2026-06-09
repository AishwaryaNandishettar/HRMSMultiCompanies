import React, { useState } from "react";
import "./CashFlow.css";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const initialData = [
  { month: "Jan", inflow: 5000, outflow: 3500, net: 1500 },
  { month: "Feb", inflow: 6500, outflow: 4200, net: 2300 },
  { month: "Mar", inflow: 7200, outflow: 5000, net: 2200 },
  { month: "Apr", inflow: 8000, outflow: 5600, net: 2400 },
  { month: "May", inflow: 9000, outflow: 6200, net: 2800 }
];

export default function CashFlowDetails() {

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
    <div className="cf-page">
 <button onClick={() => window.history.back()}>
      ← Back
    </button>
            <div className="fd-header">
      <h2>Cash Flow Analysis</h2>


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
      {/* SUMMARY CARD */}
      <div className="cf-card">
        <h4>Overview</h4>
        <p>Total Inflow: ₹36,700</p>
        <p>Total Outflow: ₹24,500</p>
        <p><b>Net Balance: ₹12,200</b></p>
      </div>

      {/* TABLE ONLY */}
      <div className="cf-card">
        <h4>Detailed Breakdown</h4>

        <table>
          <thead>
            <tr>
              <th>Month</th>
              <th>Inflow</th>
              <th>Outflow</th>
              <th>Net</th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((item, i) => (
              <tr key={i}>
                <td>{item.month}</td>
                <td>₹{item.inflow}</td>
                <td>₹{item.outflow}</td>
                <td style={{ color: item.net > 0 ? "green" : "red" }}>
                  ₹{item.net}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}