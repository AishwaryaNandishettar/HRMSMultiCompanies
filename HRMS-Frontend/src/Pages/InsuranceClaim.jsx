// InsuranceClaim.jsx
import React, { useState, useContext, useEffect, useRef } from "react";
import { AuthContext } from "../Context/Authcontext";
import "./InsuranceClaim.css";
import { createClaim, getClaims, updateClaimStatus, updateApprovedAmount,saveEmployeeInsurance,
  saveNominee } from "../api/insuranceApi";
import jsPDF from "jspdf";

const InsuranceClaim = () => {
  const { user } = useContext(AuthContext);
  console.log("LOGGED USER:", user);
  console.log("ROLE FROM BACKEND:", user?.role);

  useEffect(() => {
    fetchClaims();
  }, []);

useEffect(() => {
  const handleClick = (e) => {
    if (popupRef.current && !popupRef.current.contains(e.target)) {
      setActiveFilter(null);
      setFilterText("");
    }
  };

  document.addEventListener("mousedown", handleClick);
  return () => document.removeEventListener("mousedown", handleClick);
}, []);

  const ROLE_EMP = "employee";
  const ROLE_ADMIN = "admin";

  const fetchClaims = async () => {
    const data = await getClaims();
    console.log("API DATA:", data);
    setClaims([...data]);
  };

  const [showForm, setShowForm] = useState(false);
  const [activeFilter, setActiveFilter] = useState(null);
  const [filterText, setFilterText] = useState("");
  const popupRef = useRef();
  const [claims, setClaims] = useState([]);
const [insuranceDetails, setInsuranceDetails] = useState({
  insurancePlan: "Silver Plan",
  coverageAmount: "",
  monthlyPremium: "",
  policyStart: "",
  policyEnd: "",
  status: "Active"
});
const handleInsuranceUpdate = async () => {
  try {
const payload = {
  employeeCode: insuranceDetails.employeeCode,
  department: user?.department,
  companyId: user?.companyId,

  insurancePlan: insuranceDetails.insurancePlan,
  coverageAmount: Number(insuranceDetails.coverageAmount),
  monthlyPremium: Number(insuranceDetails.monthlyPremium),
  policyStartDate: insuranceDetails.policyStart,
  policyEndDate: insuranceDetails.policyEnd,
  status: insuranceDetails.status
};
    await saveEmployeeInsurance(payload);

    alert("Insurance details saved");
  } catch (err) {
    console.error(err);
    alert("Failed to save insurance");
  }
};
const [nominee, setNominee] = useState({
  nomineeName:"",
  relationship:"Spouse",
  share:"",
  mobile:""
});

const [nominees,setNominees] = useState([]);
const handleSaveNominee = async () => {
  try {
    const payload = {
      employeeCode: user?.employeeCode,
      nomineeName: nominee.nomineeName,
      relationship: nominee.relationship,
      share: Number(nominee.share),
      mobile: nominee.mobile
    };

    const savedNominee =
      await saveNominee(payload);

    setNominees([
      ...nominees,
      savedNominee
    ]);

    setNominee({
      nomineeName: "",
      relationship: "Spouse",
      share: "",
      mobile: ""
    });

    alert("Nominee saved");
  } catch (err) {
    console.error(err);
    alert("Failed to save nominee");
  }
};

const policyData = {
  policyNo: "GMC-2026-001245",
  insurer: "Star Health Insurance",
  plan: "Corporate Family Floater",
  startDate: "01-Jan-2026",
  endDate: "31-Dec-2026",
};

const coverageData = {
  totalCoverage: 500000,
  utilized: 125000,
};

const dependents = [
  {
    id: 1,
    name: "Priya Sharma",
    relation: "Spouse",
    age: 29,
    status: "Active",
  },
  {
    id: 2,
    name: "Rahul Sharma",
    relation: "Son",
    age: 4,
    status: "Active",
  },
];

const claimTimeline = [
  {
    stage: "Claim Submitted",
    date: "02-Jun-2026",
    status: "completed",
  },
  {
    stage: "Manager Approved",
    date: "03-Jun-2026",
    status: "completed",
  },
  {
    stage: "Insurance Review",
    date: "05-Jun-2026",
    status: "active",
  },
  {
    stage: "Settlement",
    date: "",
    status: "pending",
  },
];

const [selectedFilterValues, setSelectedFilterValues] = useState({});
const [sortConfig, setSortConfig] = useState({
  key: "",
  direction: ""
});
const getUnique = (key) => {
  return [
    ...new Set(
      claims
        .map((row) => row?.[key])
        .filter(
          (value) =>
            value !== null &&
            value !== undefined &&
            String(value).trim() !== ""
        )
    )
  ];
};
const handleCheckboxChange = (column, value) => {
  setSelectedFilterValues((prev) => {
    const current = prev[column] || [];

    if (current.includes(value)) {
      return {
        ...prev,
        [column]: current.filter((v) => v !== value)
      };
    }

    return {
      ...prev,
      [column]: [...current, value]
    };
  });
};

const handleSelectAll = (column, values) => {
  setSelectedFilterValues((prev) => ({
    ...prev,
    [column]: [...values]
  }));
};

const applyExcelFilter = (column) => {
  const values = selectedFilterValues[column] || [];

  setFilters({
    ...filters,
    [column]: values
  });

  setActiveFilter(null);
};

const clearExcelFilter = (column) => {
  setFilters({
    ...filters,
    [column]: []
  });

  setSelectedFilterValues({
    ...selectedFilterValues,
    [column]: []
  });
};

const sortColumn = (key, direction) => {
  setSortConfig({ key, direction });

  const sorted = [...claims].sort((a, b) => {
    const valA = String(a[key] || "").toLowerCase();
    const valB = String(b[key] || "").toLowerCase();

    if (direction === "asc") {
      return valA.localeCompare(valB);
    }

    return valB.localeCompare(valA);
  });

  setClaims(sorted);
};
  const [role, setRole] = useState("");

  useEffect(() => {
    if (user?.role) {
      setRole((user.role || "").toLowerCase());
      // Pre-fill employee data for employees
      if ((user.role || "").toLowerCase() === "employee") {
        setFormData(prev => ({
          ...prev,
          employeeName: user?.email || "",
          employeeCode: user?.employeeCode || "",
          department: user?.department || ""
        }));
      }
    }
  }, [user]);

 const suggestions =
  activeFilter
    ? getUnique(activeFilter).filter((v) =>
        String(v).toLowerCase().includes(filterText.toLowerCase())
      )
    : [];

  const [fromMonth, setFromMonth] = useState("");
  const [toMonth, setToMonth] = useState("");

  const [formData, setFormData] = useState({
    employeeName: "",
    employeeCode: "",
    department: "",
    relationship: "",
    claimType: "",
    fromDate: "",
    toDate: "",
    admittedDays: "",
    hospitalName: "",
    doctorName: "",
    deliveryType: "",
    surgeryType: "",
    amount: "",
    description: "",
    documents: [],
    otherClaimReason: "",
    otherDetails: "",
  });

  const [filters, setFilters] = useState({});

  const handleInput = (e) => {
    if (e.target.name === "documents") {
      setFormData({ ...formData, documents: Array.from(e.target.files) });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const exportToCSV = () => {
    const header = [
     "EmployeeID,Name,Type,Date,Days,Amount,Approved,Status"
    ];

    const rows = filteredClaims.map(c =>
   [
  c.employeeCode,
  c.employeeName,
  c.claimType,
        c.fromDate,
        c.admittedDays,
        c.amount,
        c.approvedAmount,
        c.status
      ].join(",")
    );

    const csv = [...header, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "insurance_claims.csv";
    a.click();
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    let y = 10;
    filteredClaims.forEach((c, i) => {
      doc.text(
        `${i + 1}. ${c.employeeName} - ₹${c.amount} - ${c.status}`,
        10,
        y
      );
      y += 10;
    });
    doc.save("claims.pdf");
  };


  const downloadInsuranceCard = () => {
  const doc = new jsPDF();

  doc.setFontSize(20);
  doc.text("Employee Insurance Card", 20, 20);

  doc.setFontSize(12);
  doc.text(`Employee : ${user?.email || ""}`, 20, 40);
  doc.text(`Employee Code : ${user?.employeeCode || ""}`, 20, 50);
  doc.text(`Department : ${user?.department || ""}`, 20, 60);
  doc.text(`Policy No : ${policyData.policyNo}`, 20, 70);
  doc.text(`Insurer : ${policyData.insurer}`, 20, 80);
  doc.text(`Plan : ${policyData.plan}`, 20, 90);

  doc.save("InsuranceCard.pdf");
};

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.claimType === "Hospitalization" && !formData.hospitalName) {
      alert("Hospital Name is required");
      return;
    }
    if (formData.claimType === "Maternity" && !formData.deliveryType) {
      alert("Delivery Type is required");
      return;
    }
    if (formData.claimType === "Surgery" && !formData.surgeryType) {
      alert("Surgery Type is required");
      return;
    }
    if (formData.claimType === "Other" && !formData.otherClaimReason) {
      alert("Please enter claim reason");
      return;
    }

    try {
      const payload = {
        ...formData,
        admittedDays: Number(formData.admittedDays || 0),
        amount: Number(formData.amount || 0),
        department: formData.department || user.department || "",
        companyId: user.companyId || "",
        status: "SUBMITTED",
      };

      const res = await createClaim(payload);
      setClaims((prev) => [...prev, res]);
      setShowForm(false);
    } catch (err) {
      console.error("SAVE ERROR:", err?.response?.data || err);
      alert(err?.response?.data?.message || "Error saving claim");
    }
  };

  const updateStatus = async (id, value) => {
    try {
      await updateClaimStatus(id, value);
      await fetchClaims();
    } catch (err) {
      console.error("Status update failed:", err);
    }
  };

  const updateApprovedAmountHandler = async (id, value) => {
    await updateApprovedAmount(id, value);
    fetchClaims();
  };

  // ✅ TIMELINE LOGIC
  const getTimeline = (status) => {
    const stages = [
      "Submitted",
      "Manager Approved",
      "HR Approved",
      "Insurance Approved",
      "Settled",
    ];
    const currentIndex = stages.indexOf(status);

    return stages.map((stage, index) => ({
      stage,
      completed: index <= currentIndex,
    }));
  };
  const normalizeKey = (key) => key?.toLowerCase();

console.log("Logged Employee Code:", user?.employeeCode);

claims.forEach((c) => {
  console.log(
    "Claim Employee Code:",
    c.employeeCode,
    "Match:",
    user?.employeeCode === c.employeeCode
  );
});

console.log("ROLE =", role);
console.log("USER CODE =", user?.employeeCode);

claims.forEach((c) => {
  console.log(
    "CLAIM CODE =", c.employeeCode,
    "MATCH =", String(c.employeeCode).trim().toLowerCase() ===
              String(user?.employeeCode).trim().toLowerCase()
  );
});

  const filteredClaims = claims.filter((claim) => {
  // ROLE FILTER
if (role === ROLE_EMP) {

  const userCode =
    user?.employeeCode ||
    user?.empCode ||
    user?.employeeId ||
    user?.id ||
    "";

  const claimCode =
    claim?.employeeCode ||
    claim?.empCode ||
    claim?.employeeId ||
    "";

  console.log("Insurance Employee Filter", {
    userCode,
    claimCode,
    match:
      String(userCode).trim().toLowerCase() ===
      String(claimCode).trim().toLowerCase()
  });

  if (
    String(userCode).trim().toLowerCase() !==
    String(claimCode).trim().toLowerCase()
  ) {
    return false;
  }
}

  if (role === ROLE_ADMIN) {
  const allowed = [
    "SUBMITTED",
    "MANAGER_APPROVED",
    "REJECTED",
    "INSURANCE_APPROVED",
    "SETTLED"
  ];

  const status = (claim.status || "").toUpperCase();

  if (!allowed.includes(status)) {
    return false;
  }
}
  // COLUMN FILTERS (HEADER DROPDOWN FILTERS)
  return Object.keys(filters).every((key) => {
    if (
  !filters[key] ||
  (Array.isArray(filters[key]) && filters[key].length === 0)
) {
  return true;
}

const value =
  claim?.[key] ??
  claim?.[normalizeKey(key)] ??
  "";

if (Array.isArray(filters[key])) {
return filters[key].includes(String(value));
}

return String(value ?? "")
  .toLowerCase()
  .includes(String(filters[key]).toLowerCase());
  });
});

console.log("Claims:", claims);
console.log(
  "Departments:",
  claims.map(c => c.department)
);
  return (
    <div className="insurance-container">
      <h2>Insurance Claim Management</h2>

      {/* ================= DASHBOARD ================= */}



      
      <div className="claim-dashboard">


        
        <div className="card total">
          <h4>Total Claims</h4>
          <p>{claims.length}</p>
        </div>

        <div className="card approved" style={{ color: "white" }}>
          <h4>Approved</h4>
          <p>{claims.filter(c => c.status === "INSURANCE_APPROVED" || c.status === "Settled").length}</p>
        </div>

        <div className="card pending">
          <h4>Pending</h4>
          <p>{claims.filter(c =>
            ["Submitted", "MANAGER_APPROVED"].includes(c.status)
          ).length}</p>
        </div>

        <div className="card rejected">
          <h4>Rejected</h4>
          <p>{claims.filter(c => c.status === "Rejected").length}</p>
        </div>

        <div className="card amount">
          <h4>Total Amount</h4>
          <p>₹{claims.reduce((acc, c) => acc + Number(c.amount || 0), 0)}</p>
        </div>
      </div>

<div className="overview-card employee-insurance-card">
  <h3>Employee Insurance Details</h3>

  <div className="form-grid">

  <input
  type="text"
  name="employeeCode"
  value={insuranceDetails.employeeCode}
  onChange={(e) =>
    setInsuranceDetails({
      ...insuranceDetails,
      employeeCode: e.target.value
    })
  }
  placeholder="Employee Code"
/>

    <input
      type="text"
      value={user?.department}
      readOnly
      placeholder="Department"
    />

    <select name="insurancePlan">
      <option>Silver Plan</option>
      <option>Gold Plan</option>
      <option>Platinum Plan</option>
    </select>

    <input
      type="number"
      placeholder="Coverage Amount"
    />

    <input
      type="number"
      placeholder="Monthly Premium"
    />

    <input
      type="date"
      placeholder="Policy Start"
    />

    <input
      type="date"
      placeholder="Policy End"
    />

    <select>
      <option>Active</option>
      <option>Expired</option>
      <option>Cancelled</option>
    </select>

  </div>

<button
  className="save-btn"
  onClick={handleInsuranceUpdate}
>
  Update Insurance
</button>

</div>

<div className="nominee-card">

  <h3>Nominee Details</h3>

  <div className="form-grid">
<input
  placeholder="Nominee Name"
  value={nominee.nomineeName}
  onChange={(e) =>
    setNominee({
      ...nominee,
      nomineeName: e.target.value
    })
  }
/>

<select
  value={nominee.relationship}
  onChange={(e) =>
    setNominee({
      ...nominee,
      relationship: e.target.value
    })
  }
>
  <option>Spouse</option>
  <option>Father</option>
  <option>Mother</option>
  <option>Son</option>
  <option>Daughter</option>
</select>

<input
  type="number"
  placeholder="Nominee Share %"
  value={nominee.share}
  onChange={(e) =>
    setNominee({
      ...nominee,
      share: e.target.value
    })
  }
/>

<input
  type="tel"
  placeholder="Mobile Number"
  value={nominee.mobile}
  onChange={(e) =>
    setNominee({
      ...nominee,
      mobile: e.target.value
    })
  }
/>
  </div>

<button
  className="save-btn"
  onClick={handleSaveNominee}
>
  Save Nominee
</button>

</div>

<div className="plan-comparison-card">

<h3>Available Plans</h3>

<table>

<thead>
<tr>
<th>Plan</th>
<th>Coverage</th>
<th>Premium</th>
<th>Action</th>
</tr>
</thead>

<tbody>

<tr>
<td>Silver</td>
<td>₹3,00,000</td>
<td>₹500</td>
<td>
<button>Select</button>
</td>
</tr>

<tr>
<td>Gold</td>
<td>₹5,00,000</td>
<td>₹1000</td>
<td>
<button>Select</button>
</td>
</tr>

<tr>
<td>Platinum</td>
<td>₹10,00,000</td>
<td>₹1800</td>
<td>
<button>Select</button>
</td>
</tr>

</tbody>

</table>

</div>

{/* POLICY SECTION */}
<div className="insurance-overview-grid">

  <div className="overview-card">
    <h3>Policy Summary</h3>

    <div className="policy-row">
      <span>Policy Number</span>
      <strong>{policyData.policyNo}</strong>
    </div>

    <div className="policy-row">
      <span>Insurer</span>
      <strong>Star Health Insurance</strong>
    </div>

    <div className="policy-row">
      <span>Plan</span>
      <strong>Corporate Family Floater</strong>
    </div>

    <div className="policy-row">
      <span>Validity</span>
      <strong>01-Jan-2026 - 31-Dec-2026</strong>
    </div>
  </div>

  <div className="overview-card">
    <h3>Coverage Balance</h3>

    <div className="coverage-circle">
      ₹375,000
    </div>

    <div className="coverage-footer">
      <div>
        <small>Total Cover</small>
        <strong>₹500,000</strong>
      </div>

      <div>
        <small>Utilized</small>
        <strong>₹125,000</strong>
      </div>
    </div>
  </div>

  <div className="overview-card">
    <h3>Insurance Card</h3>

    <div className="insurance-card-ui">
  <h4>{user?.email}</h4>

  <p>Employee Code : {user?.employeeCode}</p>

  <p>Department : {user?.department}</p>

  <p>Policy ID : {policyData.policyNo}</p>

  <button
    className="download-card-btn"
    onClick={downloadInsuranceCard}
  >
    Download Insurance Card
  </button>
</div>
  </div>

</div>

<div className="dependents-card">

  <h3>Dependents Covered</h3>

  <table className="dependents-table">

    <thead>
      <tr>
        <th>Name</th>
        <th>Relationship</th>
        <th>Age</th>
        <th>Status</th>
      </tr>
    </thead>

  {nominees.map((n,index)=>(
  <tr key={index}>
    <td>{n.nomineeName}</td>
    <td>{n.relationship}</td>
    <td>-</td>
    <td>Active</td>
  </tr>
))}

  </table>

</div>



<div className="timeline-card">

  <h3>Claim Timeline</h3>

  <div className="claim-timeline">

    <div className="timeline-step completed">
      Submitted
    </div>

    <div className="timeline-step completed">
      Manager Review
    </div>

    <div className="timeline-step active">
      HR Approval
    </div>

    <div className="timeline-step">
      Insurance Approval
    </div>

    <div className="timeline-step">
      Settled
    </div>

  </div>

</div>

      <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
        <button onClick={exportToCSV} className="export-btn">
          Export CSV
        </button>
      </div>

      <div style={{ marginBottom: 10, fontWeight: "bold" }}>
        Logged in as {role?.toUpperCase()}
      </div>

      {/* FILTER */}
      {!showForm && (
        <div className="filter-section">
          <input
            type="text"
            placeholder="Employee Name"
            onChange={(e) => setFilters({ ...filters, employeeName: e.target.value })}
          />

          <input
            type="text"
            placeholder="Department"
            onChange={(e) => setFilters({ ...filters, department: e.target.value })}
          />

          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <label>From:</label>
            <input
              type="month"
              onChange={(e) => setFromMonth(e.target.value)}
            />

            <label>To:</label>
            <input
              type="month"
              onChange={(e) => setToMonth(e.target.value)}
            />
          </div>

          <select onChange={(e) => setFilters({ ...filters, status: e.target.value })}>
            <option value="">Status</option>

            {role === ROLE_ADMIN && (
              <>
                <option value="Manager Approved">Pending</option>
                <option value="Insurance Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </>
            )}
          </select>

          {(filters.employeeName || filters.department || filters.status || fromMonth || toMonth || 
            Object.keys(filters).some(key => Array.isArray(filters[key]) && filters[key].length > 0)) && (
            <button
              onClick={() => {
                setFilters({});
                setFromMonth("");
                setToMonth("");
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

          {(role === ROLE_ADMIN || role === ROLE_EMP) && (
            <button className="new-claim-btn" onClick={() => setShowForm(!showForm)}>
              + New Claim
            </button>
          )}
        </div>
      )}

      {/* CLAIM FORM */}
      {(role === ROLE_ADMIN || role === ROLE_EMP) && showForm && (
        <div className="claim-form">
          <h3>Create New Claim</h3>

          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <input name="employeeName" placeholder="Employee Name *" value={role === ROLE_EMP ? user?.email || "" : formData.employeeName} onChange={handleInput} required readOnly={role === ROLE_EMP} />
              <input name="employeeCode" placeholder="Employee Code *" value={role === ROLE_EMP ? user?.employeeCode || "" : formData.employeeCode} onChange={handleInput} required readOnly={role === ROLE_EMP} />
              <input name="department" placeholder="Department *" value={role === ROLE_EMP ? user?.department || "" : formData.department} onChange={handleInput} required readOnly={role === ROLE_EMP} />
              <select name="relationship" onChange={handleInput} required>
                <option value="">Relationship *</option>
                <option value="Self">Self</option>
                <option value="Father">Father</option>
                <option value="Mother">Mother</option>
                <option value="Wife">Wife</option>
                <option value="Husband">Husband</option>
                <option value="Brother">Brother</option>
                <option value="Other">Other</option>
              </select>
              <select name="claimType" onChange={handleInput} required>
                <option value="">Select Claim Type</option>
                <option value="Hospitalization">Hospitalization</option>
                <option value="Maternity">Maternity</option>
                <option value="Surgery">Surgery</option>
                <option value="Medical">Medical</option>
                <option value="Accident">Accident</option>
                <option value="Other">Other</option>
              </select>

              <div className="date-range">
                <input
                  type="date"
                  name="fromDate"
                  onChange={handleInput}
                  required
                />
                <span className="date-separator">to</span>
                <input
                  type="date"
                  name="toDate"
                  onChange={handleInput}
                  required
                />
              </div>
              <input type="number" name="admittedDays" placeholder="No of Admitted Days" onChange={handleInput} />
              <input type="number" name="amount" placeholder="Claim Amount *" onChange={handleInput} required />
            </div>

            {/* Dynamic Fields */}
            {formData.claimType === "Hospitalization" && (
              <div className="form-grid">
                <input name="hospitalName" placeholder="Hospital Name *" onChange={handleInput} required />
                <input name="doctorName" placeholder="Doctor Name *" onChange={handleInput} required />
              </div>
            )}

            {formData.claimType === "Maternity" && (
              <div className="form-grid">
                <select name="deliveryType" onChange={handleInput} required>
                  <option value="">Delivery Type *</option>
                  <option value="Normal">Normal</option>
                  <option value="C-Section">C-Section</option>
                </select>
                <input name="hospitalName" placeholder="Hospital Name *" onChange={handleInput} required />
              </div>
            )}

            {formData.claimType === "Surgery" && (
              <div className="form-grid">
                <input name="surgeryType" placeholder="Surgery Type *" onChange={handleInput} required />
                <input name="hospitalName" placeholder="Hospital Name *" onChange={handleInput} required />
              </div>
            )}

            {formData.claimType === "Medical" && (
              <div className="form-grid">
                <input name="doctorName" placeholder="Doctor Name *" onChange={handleInput} required />
              </div>
            )}

            {formData.claimType === "Other" && (
              <div className="form-grid">
                <input
                  name="otherClaimReason"
                  placeholder="Enter Claim Reason *"
                  onChange={handleInput}
                  required
                />
                <input
                  name="otherDetails"
                  placeholder="Additional Details"
                  onChange={handleInput}
                />
              </div>
            )}

            <textarea name="description" placeholder="Description" onChange={handleInput}></textarea>
            <input type="file" name="documents" multiple onChange={handleInput} />

            {formData.documents.length > 0 && (
              <ul>
                {formData.documents.map((file, index) => (
                  <li key={index}>{file.name}</li>
                ))}
              </ul>
            )}

            <button type="submit" className="submit-btn">
              Submit Claim
            </button>

            <button
              type="button"
              className="cancel-btn"
              onClick={() => setShowForm(false)}
            >
              Close
            </button>
          </form>
        </div>
      )}

      {/* TABLE */}
      <div className="table-wrapper">
<div className="grid-table">

  {/* HEADER */}
  <div className="grid-header">
    <div className="cell sticky col-1 table-header-cell" onClick={() => { setActiveFilter("id"); setFilterText(""); }}>
      <span className="header-label">Employee ID ⏷</span>
   {activeFilter === "id" && (
  <div className="excel-filter-popup" ref={popupRef}>

  

    <div className="excel-filter-divider"></div>

    <input
      type="text"
      placeholder="Search"
      value={filterText}
      onChange={(e) => setFilterText(e.target.value)}
      className="excel-filter-search"
    />

    <div className="excel-checkbox-list">

      <label className="excel-checkbox-item">
        <input
          type="checkbox"
          checked={
            (selectedFilterValues["employeeCode"] || []).length ===
            getUnique("employeeCode").length
          }
          onChange={() =>
            handleSelectAll("id", getUnique("employeeCode"))
          }
        />
        (Select All)
      </label>

      {getUnique("employeeCode")
        .filter((v) =>
          String(v)
            .toLowerCase()
            .includes(filterText.toLowerCase())
        )
        .map((val, i) => (
          <label
            key={i}
            className="excel-checkbox-item"
          >
            <input
              type="checkbox"
              checked={
                selectedFilterValues["employeeCode"]?.includes(val)||
                false
              }
              onChange={() =>
                handleCheckboxChange("employeeCode", val)
              }
            />
            {val || "Empty"}
          </label>
        ))}
    </div>

    <div className="excel-filter-footer">
      <button
        className="excel-ok-btn"
        onClick={() => applyExcelFilter("employeeCode")}
      >
        OK
      </button>

      <button
        className="excel-cancel-btn"
        onClick={() => {
          clearExcelFilter("employeeCode");
          setActiveFilter(null);
        }}
      >
        Cancel
      </button>
    </div>

  </div>
      
)}

    </div>
    
    <div className="cell sticky col-2 table-header-cell" onClick={() => { setActiveFilter("employeeName"); setFilterText(""); }}>
      <span className="header-label">Employee Name ⏷</span>
    {activeFilter === "employeeName" && (
  <div className="excel-filter-popup" ref={popupRef}>

   

    <div className="excel-filter-divider"></div>

    <input
      type="text"
      placeholder="Search"
      value={filterText}
      onChange={(e) => setFilterText(e.target.value)}
      className="excel-filter-search"
    />

    <div className="excel-checkbox-list">

      <label className="excel-checkbox-item">
        <input
          type="checkbox"
          checked={
            (selectedFilterValues["employeeName"] || []).length ===
            getUnique("employeeName").length
          }
          onChange={() =>
            handleSelectAll(
              "employeeName",
              getUnique("employeeName")
            )
          }
        />
        (Select All)
      </label>

      {getUnique("employeeName")
        .filter((v) =>
          String(v)
            .toLowerCase()
            .includes(filterText.toLowerCase())
        )
        .map((val, i) => (
          <label
            key={i}
            className="excel-checkbox-item"
          >
            <input
              type="checkbox"
              checked={
                selectedFilterValues["employeeName"]?.includes(val) ||
                false
              }
              onChange={() =>
                handleCheckboxChange("employeeName", val)
              }
            />
            {val || "Empty"}
          </label>
        ))}
    </div>

    <div className="excel-filter-footer">
      <button
        className="excel-ok-btn"
        onClick={() => applyExcelFilter("employeeName")}
      >
        OK
      </button>

      <button
        className="excel-cancel-btn"
        onClick={() => {
          clearExcelFilter("employeeName");
          setActiveFilter(null);
        }}
      >
        Cancel
      </button>
    </div>

  </div>
)}
    </div>
    
    <div className="cell table-header-cell department-header" onClick={() => { setActiveFilter("department"); setFilterText(""); }}>
      <span className="header-label">Department ⏷</span>
    {activeFilter === "department" && (
  <div className="excel-filter-popup" ref={popupRef}>
    <input
      type="text"
      placeholder="Search"
      value={filterText}
      onChange={(e) => setFilterText(e.target.value)}
      className="excel-filter-search"
    />

    <div className="excel-checkbox-list">
      <label className="excel-checkbox-item">
        <input
          type="checkbox"
          checked={
            (selectedFilterValues["department"] || []).length ===
            getUnique("department").length
          }
          onChange={() =>
            handleSelectAll(
              "department",
              getUnique("department")
            )
          }
        />
        (Select All)
      </label>

      {getUnique("department")
        .filter((v) =>
          String(v)
            .toLowerCase()
            .includes(filterText.toLowerCase())
        )
        .map((val, i) => (
          <label
            key={i}
            className="excel-checkbox-item"
          >
            <input
              type="checkbox"
              checked={
                selectedFilterValues["department"]?.includes(
                  String(val)
                ) || false
              }
              onChange={() =>
                handleCheckboxChange(
                  "department",
                  String(val)
                )
              }
            />
            {val || "Empty"}
          </label>
        ))}
    </div>

    <div className="excel-filter-footer">
      <button
        className="excel-ok-btn"
        onClick={() => applyExcelFilter("department")}
      >
        OK
      </button>

      <button
        className="excel-cancel-btn"
        onClick={() => {
          clearExcelFilter("department");
          setActiveFilter(null);
        }}
      >
        Cancel
      </button>
    </div>
  </div>
)}
    </div>
    
    {[
      { label: "Reporting Manager", key: "managerName" },
    
      { label: "Claim Type", key: "claimType" },
      { label: "Claim Raised Date", key: "fromDate" },
      { label: "Claim Settled Date", key: "claimSettledDate" },
      { label: "Admitted Days", key: "admittedDays" },
      { label: "Claim Amount", key: "amount" },
      { label: "Approved Amount", key: "approvedAmount" },
      { label: "Status", key: "status" }
    ].map((col, index) => (
      <div 
        key={col.key} 
        className="cell table-header-cell"
        onClick={() => {
          setActiveFilter(col.key);
          setFilterText("");
        }}
      >
        <span className="header-label">
          {col.label} ⏷
        </span>

{activeFilter === col.key && (
  <div className="excel-filter-popup" ref={popupRef}>

    

    

    <div className="excel-filter-divider"></div>

    <input
      type="text"
      placeholder="Search"
      value={filterText}
      onChange={(e) => setFilterText(e.target.value)}
      className="excel-filter-search"
    />

    <div className="excel-checkbox-list">

      <label className="excel-checkbox-item">
        <input
          type="checkbox"
          checked={
            (selectedFilterValues[col.key] || []).length ===
            getUnique(col.key).length
          }
          onChange={() =>
            handleSelectAll(col.key, getUnique(col.key))
          }
        />
        (Select All)
      </label>

      {getUnique(col.key)
        .filter((v) =>
          String(v)
            .toLowerCase()
            .includes(filterText.toLowerCase())
        )
        .map((val, i) => (
          <label
            key={i}
            className="excel-checkbox-item"
          >
            <input
              type="checkbox"
              checked={
                selectedFilterValues[col.key]?.includes(String(val))||
                false
              }
              onChange={() =>
                handleCheckboxChange(col.key, String(val))
              }
            />
            {val || "Empty"}
          </label>
        ))}
    </div>

    <div className="excel-filter-footer">
      <button
        className="excel-ok-btn"
        onClick={() => applyExcelFilter(col.key)}
      >
        OK
      </button>

      <button
        className="excel-cancel-btn"
        onClick={() => {
          clearExcelFilter(col.key);
          setActiveFilter(null);
        }}
      >
        Cancel
      </button>
    </div>

  </div>
)}
      </div>
    ))}
  </div>

  {/* BODY */}
  <div className="grid-body">
    {filteredClaims.map((c) => (
      <div className="grid-row" key={c.id}>

       <div className="cell sticky col-1">{c.employeeCode}</div>
        <div className="cell sticky col-2">{c.employeeName}</div>
        <div className="cell">{c.department || 'N/A'}</div>
        <div className="cell">{c.managerName}</div>
      
        <div className="cell">{c.claimType}</div>
        <div className="cell">{c.fromDate}</div>
        <div className="cell">{c.claimSettledDate}</div>
        <div className="cell">{c.admittedDays}</div>
        <div className="cell">₹{c.amount}</div>
        <div className="cell">{c.approvedAmount}</div>
        <div className="cell">{c.status}</div>

      </div>
    ))}
  </div>

</div>
      </div>
    </div>
  );
};

export default InsuranceClaim;