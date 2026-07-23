import React, { useState } from "react";
import axios from "axios";

export default function InviteEmployee() {
 console.log("INVITE COMPONENT LOADED");
  const [email, setEmail] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(false);

  // ✅ EXISTING SINGLE INVITE LOGIC (UNCHANGED)
  const sendInviteEmployee = async () => {

    try {

      const apiBase =
        import.meta.env.VITE_API_BASE_URL ||
        'https://trowel-eldercare-scouting.ngrok-free.dev';

      await axios.post(`${apiBase}/api/onboarding/invite`, {
        email,
        fullName: "Test User",
        department: "IT",
        designation: "Developer",
      });

      alert("Invite sent successfully 📩");

      setShowPopup(false);

    } catch (err) {

      console.error(err);

      alert("Failed to send invite");
    }
  };

  // ✅ NEW BULK INVITE LOGIC
 const handleInviteAll = async (employeesToInvite = []) => {
  try {
    setLoading(true);

    const apiBase =
      import.meta.env.VITE_API_BASE_URL ||
      "https://trowel-eldercare-scouting.ngrok-free.dev";

    const token = localStorage.getItem("token");

    // Pass the payload array expected by the controller
    const response = await axios.post(
      `${apiBase}/api/onboarding/invite-all`,
      employeesToInvite, // Array of employee objects { email, fullName, department, designation }
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    alert(response.data.message || "Bulk invites sent successfully 📩");
  } catch (err) {
    console.error(err);
    alert(
      err?.response?.data?.message ||
        "Failed to send bulk invites. Ensure backend route exists."
    );
  } finally {
    setLoading(false);
  }
};
  return (
    <div>

      <h3>Invite Employee</h3>

      {/* ✅ EXISTING BUTTON */}
     <button
  style={{
    position: "relative",
    zIndex: 9999,
    pointerEvents: "auto",
    cursor: "pointer",
  }}
  onClick={() => {
    console.log("BUTTON CLICKED");
    setShowPopup(true);
  }}
>
        Invite Employee
      </button>

      {/* ✅ NEW BULK INVITE BUTTON */}
    <button
  onClick={handleInviteAll}
  disabled={loading}
  style={{
    marginLeft: "10px",
    position: "relative",
    zIndex: 9999,
    pointerEvents: "auto",
    cursor: "pointer",
  }}
>
  {loading ? "Sending..." : "Send All Invites"}
</button>

      {/* ✅ EXISTING POPUP */}
      {showPopup && (
       <div
  style={{
    position: "fixed",
    top: "30%",
    left: "40%",
    background: "white",
    padding: "20px",
    border: "1px solid black",
    zIndex: 9999,
  }}
>

          <input
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <button onClick={sendInviteEmployee}>
            Send Invite Link
          </button>

        </div>
      )}

    </div>
  );
}