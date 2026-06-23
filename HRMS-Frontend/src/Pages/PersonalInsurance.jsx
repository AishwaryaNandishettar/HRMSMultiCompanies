import React, { useState } from "react";
import "./PersonalInsurance.css";

export default function PersonalInsurance() {
  const [tab, setTab] = useState("dashboard");
  const [activeKpi, setActiveKpi] = useState("all");

  const role = "Admin";

  const plans = [
    {
      company: "LIC",
      plan: "Health Shield",
      coverage: "₹5,00,000",
      premium: "₹799/mo",
    },
    {
      company: "Star Health",
      plan: "Family Optima",
      coverage: "₹10,00,000",
      premium: "₹1299/mo",
    },
    {
      company: "HDFC Ergo",
      plan: "Health Suraksha",
      coverage: "₹7,50,000",
      premium: "₹999/mo",
    },
  ];

  const claims = [
    {
      id: "CLM001",
      policy: "Health Shield",
      amount: "₹45,000",
      status: "Approved",
    },
    {
      id: "CLM002",
      policy: "Family Secure",
      amount: "₹80,000",
      status: "Processing",
    },
  ];

  const nominees = [
    {
      name: "Priya Sharma",
      relation: "Wife",
      share: "70%",
    },
    {
      name: "Rahul Sharma",
      relation: "Son",
      share: "30%",
    },
  ];

  return (
    <div className="personal-insurance-module">

      {/* Header */}

      <div className="insurance-header">
        <div>
          <h1>Personal Insurance Portal</h1>
          <p>
            Manage policies, claims, nominees, documents and renewals
          </p>
        </div>

        <div className="header-actions">
          <span className="role-badge">{role}</span>

          <button className="primary-btn">
            Browse Plans
          </button>
        </div>
      </div>

      {/* KPI */}

      <div className="stats-grid">

      <div
  className={`kpi-card green ${activeKpi === "policies" ? "active" : ""}`}
  onClick={() => setActiveKpi("policies")}
>
  <h4>Active Policies</h4>
  <h2>12</h2>
</div>

        <div className="kpi-card blue">
          <h4>Total Coverage</h4>
          <h2>₹10L</h2>
        </div>

       <div
  className={`kpi-card orange ${activeKpi === "claims" ? "active" : ""}`}
  onClick={() => setActiveKpi("claims")}
>
  <h4>Claims</h4>
  <h2>04</h2>
</div>

       <div
  className={`kpi-card red ${activeKpi === "renewals" ? "active" : ""}`}
  onClick={() => setActiveKpi("renewals")}
>
  <h4>Renewal Due</h4>
  <h2>29 Days</h2>
</div>

      </div>

      {/* Tabs */}

      <div className="tabs">

        {[
          "dashboard",
          "plans",
          "claims",
          "nominees",
          "history",
          "renewals"
        ].map((t) => (
          <button
            key={t}
            className={tab === t ? "active" : ""}
            onClick={() => setTab(t)}
          >
            {t}
          </button>
        ))}

      </div>

      {/* Dashboard */}
{tab === "dashboard" && (
  <>
    <div className="insurance-dashboard-grid">

      {/* Employee Insurance Profile */}

      <div className="dashboard-card profile-card">
        <div className="profile-top">
          <div className="profile-avatar">
            AP
          </div>

          <div>
            <div className="profile-info"></div>
            <h3>Ankita paul</h3>
            <p>EMP-001245</p>
            <span className="active-badge">
              Active Policy
            </span>
          </div>
        </div>

        <div className="profile-details">
          <div>
            <label>Policy Number</label>
            <span>LIC-HS-2026-001</span>
          </div>

          <div>
            <label>Provider</label>
            <span>LIC India</span>
          </div>

          <div>
            <label>Coverage</label>
            <span>₹10,00,000</span>
          </div>

          <div>
            <label>Premium</label>
            <span>₹1,299 / Month</span>
          </div>

          <div>
            <label>Start Date</label>
            <span>01-Jan-2026</span>
          </div>

          <div>
            <label>Expiry Date</label>
            <span>01-Jan-2027</span>
          </div>
        </div>

        <div className="policy-actions">
          <button>Download Policy</button>
          <button>Raise Claim</button>
          <button>Renew</button>
        </div>
      </div>

      {/* Coverage Progress */}

      <div className="dashboard-card">
        <h3>Coverage Utilization</h3>

        <div className="coverage-circle">
          68%
        </div>

        <div className="coverage-stats">
          <p>Used : ₹6.8L</p>
          <p>Available : ₹3.2L</p>
        </div>
      </div>

    </div>

    {/* Lower Cards */}

    <div className="dashboard-bottom-grid">

      <div className="dashboard-card">
        <h3>Recent Claims</h3>

        <table className="mini-table">
          <tbody>
            <tr>
              <td>CLM001</td>
              <td>₹45,000</td>
              <td>
                <span className="status approved">
                  Approved
                </span>
              </td>
            </tr>

            <tr>
              <td>CLM002</td>
              <td>₹15,000</td>
              <td>
                <span className="status pending">
                  Pending
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="dashboard-card">
        <h3>Upcoming Renewals</h3>

        <div className="renewal-item">
          <span>Family Shield Plan</span>
          <strong>29 Days Left</strong>
        </div>

        <div className="renewal-item">
          <span>Health Plus Plan</span>
          <strong>85 Days Left</strong>
        </div>
      </div>

    </div>
  </>
)}
      {/* Plans */}

      {tab === "plans" && (
        <div className="plans-grid">

          {plans.map((p, i) => (
            <div className="plan-card" key={i}>
              <h3>{p.company}</h3>
              <h4>{p.plan}</h4>

              <p>{p.coverage}</p>
              <p>{p.premium}</p>

              <button className="primary-btn">
                Apply Now
              </button>
            </div>
          ))}

        </div>
      )}

      {/* Claims */}

{tab === "claims" && (
  <div className="card">

    <div className="table-toolbar">
      <input
        className="search-box"
        placeholder="Search Employee / Claim ID"
      />

      <select className="filter-select">
        <option>All Claims</option>
        <option>Approved</option>
        <option>Pending</option>
        <option>Rejected</option>
      </select>
    </div>

    <div className="table-wrapper">

      <table className="insurance-table">

        <thead>
          <tr>
            <th>Claim ID</th>
            <th>Employee ID</th>
            <th>Employee Name</th>
            <th>Policy No</th>
            <th>Provider</th>
            <th>Hospital</th>
            <th>Claim Amount</th>
            <th>Approved Amount</th>
            <th>Status</th>
            <th>Date</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>

          <tr>
            <td>CLM001</td>
            <td>EMP001</td>
            <td>Aishwarya Panchal</td>
            <td>LIC001245</td>
            <td>LIC</td>
            <td>Apollo</td>
            <td>₹45,000</td>
            <td>₹45,000</td>
            <td>
              <span className="status approved">
                Approved
              </span>
            </td>
            <td>12-Jun-2026</td>
            <td>
              <button className="renew-btn">
                View
              </button>
            </td>
          </tr>

          <tr>
            <td>CLM002</td>
            <td>EMP004</td>
            <td>Rahul Sharma</td>
            <td>LIC004521</td>
            <td>LIC</td>
            <td>Manipal</td>
            <td>₹80,000</td>
            <td>Pending</td>
            <td>
              <span className="status pending">
                Pending
              </span>
            </td>
            <td>08-Jun-2026</td>
            <td>
              <button className="renew-btn">
                Review
              </button>
            </td>
          </tr>

        </tbody>

      </table>

    </div>

  </div>
)}
      {/* Nominees */}

      {tab === "nominees" && (
  <div className="card">

    <div className="table-wrapper">

      <table className="insurance-table">

        <thead>
          <tr>
            <th>Employee ID</th>
            <th>Employee Name</th>
            <th>Policy No</th>
            <th>Nominee Name</th>
            <th>Relationship</th>
            <th>DOB</th>
            <th>Contact</th>
            <th>Allocation %</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>

          <tr>
            <td>EMP001</td>
            <td>Aishwarya Panchal</td>
            <td>LIC001245</td>
            <td>Priya Sharma</td>
            <td>Wife</td>
            <td>12-03-1995</td>
            <td>9876543210</td>
            <td>70%</td>
            <td>
              <span className="status approved">
                Active
              </span>
            </td>
          </tr>

          <tr>
            <td>EMP001</td>
            <td>Aishwarya Panchal</td>
            <td>LIC001245</td>
            <td>Rahul Sharma</td>
            <td>Son</td>
            <td>05-01-2020</td>
            <td>-</td>
            <td>30%</td>
            <td>
              <span className="status approved">
                Active
              </span>
            </td>
          </tr>

        </tbody>

      </table>

    </div>

  </div>
)}

      {/* History */}

      {tab === "history" && (
  <div className="card">

    <div className="timeline-header">
      <h3>Policy History</h3>
    </div>

    <div className="table-wrapper">

      <table className="insurance-table">

        <thead>
          <tr>
            <th>Policy Number</th>
            <th>Provider</th>
            <th>Coverage</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Premium</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>

          <tr>
            <td>LIC001245</td>
            <td>LIC</td>
            <td>₹5,00,000</td>
            <td>01-Jan-2024</td>
            <td>01-Jan-2025</td>
            <td>₹799</td>
            <td>
              <span className="status warning">
                Expired
              </span>
            </td>
          </tr>

          <tr>
            <td>LIC009985</td>
            <td>LIC</td>
            <td>₹10,00,000</td>
            <td>01-Jan-2025</td>
            <td>01-Jan-2026</td>
            <td>₹1299</td>
            <td>
              <span className="status approved">
                Active
              </span>
            </td>
          </tr>

        </tbody>

      </table>

    </div>

  </div>
)}

      {/* Renewals */}

      {tab === "renewals" && (
  <div className="card">

    <div className="renewal-header">

      <input
        placeholder="Search Employee..."
        className="search-box"
      />

      <select className="filter-select">
        <option>All Status</option>
        <option>Expiring Soon</option>
        <option>Expired</option>
        <option>Active</option>
      </select>

    </div>

    <div className="table-wrapper">

      <table className="insurance-table">

        <thead>
          <tr>
            <th>Employee ID</th>
            <th>Employee Name</th>
            <th>Policy No</th>
            <th>Provider</th>
            <th>Coverage</th>
            <th>Expiry Date</th>
            <th>Days Left</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>

          <tr>
            <td>EMP001</td>
            <td>Aishwarya</td>
            <td>LIC001</td>
            <td>LIC</td>
            <td>₹10L</td>
            <td>01-Jan-2027</td>
            <td>29</td>
            <td>
              <span className="status warning">
                Expiring Soon
              </span>
            </td>
            <td>
              <button className="renew-btn">
                Renew
              </button>
            </td>
          </tr>

        </tbody>

      </table>

    </div>

  </div>
)}

    </div>
  );
}