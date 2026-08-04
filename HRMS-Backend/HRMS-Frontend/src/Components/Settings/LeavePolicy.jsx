import React, { useState } from "react";
import { saveLeavePolicy } from "../../api/leaveApi";

const LeavePolicy = () => {
  const [policy, setPolicy] = useState({
    monthly: "",
    carry: "",
  });

  const handleSave = async () => {
  try {
    const payload = {
      monthly: policy.monthly,
      carry: policy.carry
    };

    await saveLeavePolicy(payload);

    alert("Policy saved successfully!");
  } catch (err) {
    console.error(err);
  }
};
  return (
    <div className="settings-section">
      <h3>Leave Policy</h3>

      <div className="form-group">
        <label>Monthly Leave</label>
        <input
          type="number"
          onChange={(e) =>
            setPolicy({ ...policy, monthly: e.target.value })
          }
        />
      </div>

      <div className="form-group">
        <label>Carry Forward</label>
        <input
          type="number"
          onChange={(e) =>
            setPolicy({ ...policy, carry: e.target.value })
          }
        />
      </div>

     <button className="save-btn" onClick={handleSave}>
  Save
</button>
    </div>
  );
};

export default LeavePolicy;