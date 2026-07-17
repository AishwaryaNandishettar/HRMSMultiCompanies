import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../Context/Authcontext";
import { useTheme } from "../context/ThemeContext"; // ✅ Multi-tenant theme
import LogoManager from "../components/LogoManager"; // ✅ Multi-tenant logo
import logo from "../assets/Background less.png";
import "./Login.css";
import api from "../api/axios";

export const login = (data) => {
  return api.post("/api/auth/login", data);
};

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const [isForgot, setIsForgot] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  // kept from team file
  const [otp, setOtp] = useState("");

  const [enteredOtp, setEnteredOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const { login } = useContext(AuthContext);
  const theme = useTheme(); // ✅ Get company theme
  const navigate = useNavigate();

  /* ================= LOGIN USING BACKEND ================= */
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    console.log("🔍 Environment check:");
    console.log("VITE_API_BASE_URL:", import.meta.env.VITE_API_BASE_URL);
    console.log("VITE_TENANT_ID:", import.meta.env.VITE_TENANT_ID);

    try {
      const apiUrl = import.meta.env.VITE_API_BASE_URL;
      const tenantId = import.meta.env.VITE_TENANT_ID;

      if (!apiUrl) {
        setError("Configuration error: API URL not set.");
        return;
      }

      // tenantId is OPTIONAL - only required for client portals (company-a, b, c)
      // Default HRMS portal (for Omoi employees) doesn't need tenantId

      const res = await fetch(`${apiUrl}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          tenantId, // ✅ Send tenant ID for validation (undefined for default portal)
        }),
      });

      console.log("📥 Response status:", res.status);

      if (!res.ok) {
        throw new Error("Invalid credentials");
      }

      const data = await res.json();

      console.log("🔥 LOGIN RESPONSE:", data);

      // KEEPING YOUR FULL LOGIN DATA
      login({
        id: data.id,
        _id: data.id,
        name: data.name,
        email: data.email,
        role: data.role,
        token: data.token,
        empId: data.empId || data.employeeId,
        employeeId: data.employeeId || data.empId,
        department: data.department || data.dept,
        reportingManager: data.reportingManager || data.manager,
        managerEmail: data.managerEmail,
        companyId: data.companyId,
      });

      console.log("✅ LOGIN SUCCESSFUL");

      // KEEPING TEAM REDIRECT LOGIC
      const postLoginRedirect =
        sessionStorage.getItem("postLoginRedirect");

      if (postLoginRedirect) {
        sessionStorage.removeItem("postLoginRedirect");
        navigate(postLoginRedirect);
      } else {
        navigate("/Home");
      }

    } catch (err) {
      console.error("❌ Login Error:", err);
      setError("Invalid email or password.");
    }
  };

  /* ================= FORGOT PASSWORD ================= */
  const handleForgotPassword = () => {
    setIsForgot(true);
    setError("");
  };

  /* ================= SEND OTP ================= */
  const sendOtp = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const apiUrl =
        import.meta.env.VITE_API_BASE_URL ||
        "http://localhost:8082";

      console.log(
        "🔍 Sending OTP request:",
        `${apiUrl}/api/auth/forgot-password`
      );

      const res = await fetch(
        `${apiUrl}/api/auth/forgot-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || "Failed to send OTP");
      }

      const data = await res.json();

      console.log("✅ OTP Response:", data);

      // kept from team logic
      setOtp(data.otp || "");

      setOtpSent(true);

      alert(`✅ OTP sent to ${email}. Please check your email inbox.`);

    } catch (err) {
      console.error("❌ Send OTP Error:", err);
      setError(err.message || "Failed to send OTP.");
    }
  };

  /* ================= VERIFY OTP ================= */
  const verifyOtp = (e) => {
    e.preventDefault();

    if (enteredOtp && enteredOtp.trim().length === 4) {
      setError("");
    } else {
      setError("Please enter valid 4-digit OTP");
    }
  };

  /* ================= RESET PASSWORD ================= */
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");

    if (!newPassword || newPassword.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    try {
      const apiUrl =
        import.meta.env.VITE_API_BASE_URL ||
        "http://localhost:8082";

      const res = await fetch(
        `${apiUrl}/api/auth/reset-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            otp: enteredOtp,
            newPassword,
          }),
        }
      );

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || "Failed to reset password");
      }

      alert(
        `✅ Password reset successful! You can now login with your new password.`
      );

      // RESET STATES
      setIsForgot(false);
      setOtp("");
      setOtpSent(false);
      setEnteredOtp("");
      setNewPassword("");
      setEmail("");
      setPassword("");

    } catch (err) {
      console.error("❌ Reset Password Error:", err);
      setError(
        err.message || "Failed to reset password."
      );
    }
  };

  return (
    <div className="login-page">
      <div className="login-overlay">
        <form
          className="login-form"
          onSubmit={
            isForgot
              ? otpSent
                ? verifyOtp
                : sendOtp
              : handleLogin
          }
        >
          <div className="header-section">
            <div className="logo-wrapper">
              {/* ✅ MULTI-TENANT LOGO - Shows TH/WP/PS or custom logo */}
              <LogoManager
                logoPath={theme.logos.loginLogo}
                fallbackInitials={theme.initials}
                backgroundColor={theme.colors.primary}
                size={120}
                alt={`${theme.companyName} Logo`}
                className="logo-logo"
              />
            </div>

            <h1 className="app-title">
              {/* ✅ MULTI-TENANT COMPANY NAME - Shows TalentHub/WorkForce/PeopleSync */}
              {theme.companyName}
            </h1>
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          {/* ---------- LOGIN ---------- */}
          {!isForgot && (
            <>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                required
              />

              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                required
              />

              <button type="submit">
                Login
              </button>

              <p
                className="forgot-link"
                onClick={handleForgotPassword}
              >
                Forgot Password?
              </p>
            </>
          )}

          {/* ---------- SEND OTP ---------- */}
          {isForgot && !otpSent && (
            <>
              <h3 className="reset-title">
                Forgot Password
              </h3>

              <input
                type="email"
                placeholder="Enter your registered email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                required
              />

              <button type="submit">
                Send OTP
              </button>

              <p
                className="back-link"
                onClick={() =>
                  setIsForgot(false)
                }
              >
                ← Back to Login
              </p>
            </>
          )}

          {/* ---------- VERIFY OTP ---------- */}
          {isForgot && otpSent && (
            <>
              <h3 className="reset-title">
                Enter OTP
              </h3>

              <input
                type="text"
                placeholder="Enter 4-digit OTP"
                value={enteredOtp}
                onChange={(e) =>
                  setEnteredOtp(e.target.value)
                }
                required
              />

              <button type="submit">
                Verify OTP
              </button>

              <p
                className="back-link"
                onClick={() =>
                  setIsForgot(false)
                }
              >
                ← Cancel
              </p>

              {enteredOtp &&
                enteredOtp.trim().length === 4 && (
                  <>
                    <input
                      type="password"
                      placeholder="Enter new password"
                      value={newPassword}
                      onChange={(e) =>
                        setNewPassword(
                          e.target.value
                        )
                      }
                      required
                    />

                    <button
                      onClick={
                        handleResetPassword
                      }
                    >
                      Reset Password
                    </button>
                  </>
                )}
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default Login;