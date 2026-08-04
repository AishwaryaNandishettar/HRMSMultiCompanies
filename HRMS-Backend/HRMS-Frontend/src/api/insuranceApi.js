  import axios from "axios";

  const API = `${import.meta.env.VITE_API_BASE_URL}/api/insurance`;

 export const getClaims = async () => {
  const res = await axios.get(`${API}/all`);

  return res.data.map((c) => ({
    id: c.id,

    // 👇 normalize ALL possible backend variations
    employeeName: c.employeeName || c.empName || c.name || "",
    employeeCode: c.employeeCode || c.empCode || c.employeeId || "",
    department: c.department || "",
    managerName: c.managerName || "",

    claimType: c.claimType || "",
    fromDate: c.fromDate || "",
    claimSettledDate: c.claimSettledDate || "",
    admittedDays: c.admittedDays || 0,

    amount: c.amount || 0,
    approvedAmount: c.approvedAmount || 0,
    status: c.status || ""
  }));
};

  export const createClaim = async (claim) => {
    const res = await axios.post(`${API}/create`, claim);
    return res.data;
  };

  export const updateClaimStatus = async (id, status) => {
    const res = await axios.put(`${API}/status/${id}?status=${status}`);
    return res.data;
  };

  export const updateApprovedAmount = async (id, amount) => {
    const res = await axios.put(`${API}/amount/${id}?amount=${amount}`);
    return res.data;
  };
  export const getInsurancePlans = async (companyId) => {
    const res = await axios.get(`${API}/plans/${companyId}`);
    return res.data;
  };

export const saveEmployeeInsurance = async (data) => {
  console.log("BASE URL =", import.meta.env.VITE_API_BASE_URL);
  console.log("FULL URL =", `${API}/employee-details`);

  const res = await axios.post(
    `${API}/employee-details`,
    data
  );

  return res.data;
};
  export const saveNominee = async (data) => {
    const res = await axios.post(
      `${API}/nominee`,
      data
    );
    return res.data;
  };

  export const getDependents = async (employeeCode) => {
    const res = await axios.get(
      `${API}/dependents/${employeeCode}`
    );
    return res.data;
  };

  export const renewPolicy = async (employeeCode) => {
    const res = await axios.post(
      `${API}/renew/${employeeCode}`
    );
    return res.data;
  };
  export const upgradePlan = async (employeeCode, plan) => {
    const res = await axios.put(
      `${API}/management/upgrade/${employeeCode}?plan=${plan}`
    );
    return res.data;
  };