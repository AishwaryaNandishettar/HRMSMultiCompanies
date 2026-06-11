    import React, { useMemo, useState, useEffect, useContext } from "react";
    import Calendar from "react-calendar";
    import axios from "axios";
    import { useNavigate } from "react-router-dom";
    import "react-calendar/dist/Calendar.css";
    import ViewPayslipModal from "./Payroll/ViewPayslipModal";
    
    import {
      PieChart,
      Cell,
      Pie,
      ResponsiveContainer,
      BarChart,
      Bar,
      XAxis,
      YAxis,
      Tooltip,
    } from "recharts";
    import {
      FaUsers,
      FaBell,
      FaMoneyBillWave,
      FaBirthdayCake,
      FaSearch,
      FaEllipsisH,
      FaMapMarkerAlt,
      FaCalendarCheck,
      FaUserCheck,
      
    } from "react-icons/fa";
    import { AuthContext } from "../Context/Authcontext";
    import { fetchHomeData } from "../api/homeApi";
    import { getAllEmployees } from "../api/employeeApi";
    import { getMyAttendance } from "../api/attendanceApi";
    import { getMyLeaves } from "../api/leaveApi";
    import { getEmployeePayroll } from "../api/payrollApi";
    import "./Home.css";

    /* ================= DUMMY USERS ================= */

  

/* ================= FORMAT TIME TO HH:MM:SS (display only) ================= */
const formatTime = (timeStr) => {
  if (!timeStr || timeStr === "-") return timeStr;
  // Extract only HH:MM:SS from strings like "10:57:04.125480300" or "10:57:04 AM"
  const match = String(timeStr).match(/^(\d{1,2}:\d{2}:\d{2})/);
  return match ? match[1] : timeStr;
};


    export default function Home() {
      const navigate = useNavigate();
      const { user } = useContext(AuthContext);

      const [showPayslipModal, setShowPayslipModal] = useState(false);
  const [selectedPayroll, setSelectedPayroll] = useState(null);
      const [search, setSearch] = useState("");
      const [activeFilter, setActiveFilter] = useState(null);
  const [filterText, setFilterText] = useState("");
  const [filters, setFilters] = useState({});
  const [payrollActiveFilter, setPayrollActiveFilter] = useState(null);
  const [payrollFilters, setPayrollFilters] = useState({});
      const [dept, setDept] = useState("All");
      const [location, setLocation] = useState("Fetching...");
      const [employees, setEmployees] = useState([]);
      const [attendanceChartData, setAttendanceChartData] = useState([]);
      const [leaveChartData, setLeaveChartData] = useState([]);
      const [homeData, setHomeData] = useState(null);


      
      // Enhanced state for role-based KPIs
      const [myAttendancePercentage, setMyAttendancePercentage] = useState(0);
      const [myLeaveNotifications, setMyLeaveNotifications] = useState(0);
      const [myPayrollAmount, setMyPayrollAmount] = useState(0);
      const [teamAttendancePercentage, setTeamAttendancePercentage] = useState(0);
      const [teamLeaveNotifications, setTeamLeaveNotifications] = useState(0);
      const [selectedDate, setSelectedDate] = useState(new Date());
      const [calendarEvents, setCalendarEvents] = useState([]);
      const [last3MonthsPayroll, setLast3MonthsPayroll] = useState([]);
      const [systemNotifications, setSystemNotifications] = useState([]);
      const [showEmpFilter, setShowEmpFilter] = useState(false);
      const employeeSummary = employees.map(emp => ({
    fullName: emp.fullName,
    employeeId: emp.employeeId,
    department: emp.department,
    designation: emp.designation,
  }));
      
  const handleEmployeeSelect = (employee) => {
  setSelectedEmployees((prev) => {
    if (prev.includes(employee)) {
      return prev.filter((e) => e !== employee);
    }
    return [...prev, employee];
  });

  // CLOSE POPUP AFTER SELECTION
  setShowEmpFilter(false);
};
      // 🔄 LIVE ATTENDANCE AUTO REFRESH (30 sec) - Trigger immediate refresh on component mount
  useEffect(() => {
    if (user?.email) {
      // Immediate refresh when component mounts or user changes
      refreshAttendanceStatus();
    }
    
    const interval = setInterval(() => {
      if (user?.email) {
        refreshAttendanceStatus();
      }
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [user]);
      const refreshAttendanceStatus = async () => {
    try {
      // Always try to fetch fresh attendance data immediately
      const userId = user.id || user._id || user.employeeId || user.empId;
      
      // Fetch both homeData and attendance data in parallel for faster loading
      const [homeDataResult, attendanceDataResult] = await Promise.allSettled([
        fetchHomeData(user.email),
        getMyAttendance(userId)
      ]);
      
      // Find today's attendance record
      const today = new Date().toLocaleDateString("en-CA"); // YYYY-MM-DD format
      
      let todayRecord = null;
      
      // First, try to get today's record from attendance API
      if (attendanceDataResult.status === 'fulfilled') {
        const attendanceData = attendanceDataResult.value;
        todayRecord = Array.isArray(attendanceData) 
          ? attendanceData.find(r => r.date === today)
          : Array.isArray(attendanceData?.data)
          ? attendanceData.data.find(r => r.date === today)
          : null;
      }
      
      // Update home data with fresh attendance info
      if (homeDataResult.status === 'fulfilled') {
        const freshHomeData = homeDataResult.value;
        
        // Prefer todayRecord from attendance API over homeData
        const finalTodayAttendance = todayRecord ? {
          status: todayRecord.status || (todayRecord.checkIn && todayRecord.checkIn !== "-" ? "Checked In" : "Not Checked In"),
          checkIn: todayRecord.checkIn,
          checkOut: todayRecord.checkOut,
          date: todayRecord.date,
          tos: todayRecord.tos,
          attendanceType: todayRecord.attendanceType || todayRecord.type
        } : freshHomeData.todayAttendance;
        
        setHomeData({
          ...freshHomeData,
          todayAttendance: finalTodayAttendance
        });
        
        console.log("✅ Attendance refreshed:", finalTodayAttendance);
      } else if (todayRecord) {
        // Fallback: update only today's attendance if homeData failed
        const updatedTodayAttendance = {
          status: todayRecord.status || (todayRecord.checkIn && todayRecord.checkIn !== "-" ? "Checked In" : "Not Checked In"),
          checkIn: todayRecord.checkIn,
          checkOut: todayRecord.checkOut,
          date: todayRecord.date,
          tos: todayRecord.tos,
          attendanceType: todayRecord.attendanceType || todayRecord.type
        };
        
        setHomeData(prev => ({
          ...prev,
          todayAttendance: updatedTodayAttendance
        }));
        
        console.log("✅ Attendance refreshed (fallback):", updatedTodayAttendance);
      }
      
    } catch (err) {
      console.error("Attendance refresh failed:", err);
    }
  };
      const [showEventsPopup, setShowEventsPopup] = useState(false);
      const [events, setEvents] = useState(0);
      const [upcomingHolidays, setUpcomingHolidays] = useState([]);
      const currentMonth = new Date().getMonth();
      const currentMonthEvents = useMemo(() => {

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return (homeData?.events || [])
      .filter((e) => {

        // only holidays
        if (e.type !== "Holiday") return false;

        // date check
        if (!e.date) return false;

        const eventDate = new Date(e.date);
        eventDate.setHours(0, 0, 0, 0);

        // only current/future holidays
        return eventDate >= today;
      })
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(0, 6); // show only next 6 holidays

  }, [homeData]);

      const eventDates = useMemo(() => {
    return employees
      .filter(emp => emp.dob)
      .map(emp => {
        const d = new Date(emp.dob);
        return new Date(new Date().getFullYear(), d.getMonth(), d.getDate());
      });
  }, [employees]);

  const currentMonthBirthdays = useMemo(() => {
    return employees.filter(emp => {
      if (!emp.dob) return false;
      return new Date(emp.dob).getMonth() === currentMonth;
    });
  }, [employees]);

      const [notifications, setNotifications] = useState([]);
      const [payrollData, setPayrollData] = useState([]);

      // ✅ Add here
  const [readNotifications, setReadNotifications] = useState(
    JSON.parse(
      localStorage.getItem("readNotifications") || "[]"
    )
  );

  useEffect(() => {
    localStorage.setItem(
      "readNotifications",
      JSON.stringify(readNotifications)
    );
  }, [readNotifications]);


      // ✅ Weekly off days from company settings (loaded via homeData)
      const [weeklyOffDays, setWeeklyOffDays] = useState(["SATURDAY", "SUNDAY"]);

      // Enhanced calendar events for May 2026
      const mayEvents = {
        1: ["International Labour Day", "May Day", "Maharashtra Day", "Buddha Purnima"],
        3: ["World Press Freedom Day", "World Laughter Day"],
        4: ["Star Wars Day"],
        5: ["World Asthma Day"],
        8: ["World Red Cross Day", "Rabindra Jayanti"],
        10: ["Mother's Day", "World Lupus Day"],
        12: ["International Nurses Day"],
        15: ["International Day of Families"],
        18: ["International Museum Day"],
        21: ["World Day for Cultural Diversity for Dialogue and Development"],
        22: ["International Day for Biological Diversity"],
        23: ["World Turtle Day"],
        28: ["Menstrual Hygiene Day"],
        31: ["World No Tobacco Day"]
      };

      // Get events for selected date
      const getEventsForDate = (date) => {
        const day = date.getDate();
        const month = date.getMonth();
        const year = date.getFullYear();
        
        // Only show events for May 2026 and from current date onwards
        if (year === 2026 && month === 4) { // May is month 4 (0-indexed)
          const today = new Date();
          if (date >= today) {
            return mayEvents[day] || [];
          }
        }
        return [];
      };

      // Load role-based KPI data
      const loadRoleBasedData = async () => {
        if (!user?.email) return;

        try {
          const userRole = user.role?.toLowerCase();
          
          // ✅ Attendance % now comes from homeData.stats for ALL roles
          // homeData is loaded by the loadHomeData useEffect which sets myAttendancePercentage
          
          if (userRole === 'employee' || userRole === 'manager') {
            await loadEmployeeKPIData();
          }
          
          // Load last 3 months payroll for all roles
          await loadLast3MonthsPayroll();
          
          // Load system notifications
          await loadSystemNotifications();
          
        } catch (error) {
          console.error('Error loading role-based data:', error);
        }
      };

      const loadEmployeeKPIData = async () => {
        try {
          // ✅ Attendance % is now set from homeData.stats in the loadHomeData useEffect
          // No need to recalculate here

          // Get employee leave notifications
          const leaveData = await getMyLeaves(user.employeeId || user.id);
          if (leaveData && leaveData.data) {
            const notifications = leaveData.data.filter(leave => 
              leave.status === 'Approved' || leave.status === 'Rejected'
            ).length;
            setMyLeaveNotifications(notifications);
          }

          // Get employee payroll amount
          const payrollData = await getEmployeePayroll(user.employeeCode || user.employeeId);
          if (payrollData && payrollData.data) {
            const latestPayroll = payrollData.data[0];
            if (latestPayroll) {
              const amount = latestPayroll.netPay || latestPayroll.net || latestPayroll.salary || 0;
              setMyPayrollAmount(amount);
            }
          }
        } catch (error) {
          console.error('Error loading employee KPI data:', error);
        }
      };

      const loadManagerKPIData = async () => {
        try {
          // ✅ Manager attendance % now comes from homeData.stats (same as employee)
          // Team leave notifications from leaveGraph
          if (homeData) {
            if (homeData.leaveGraph && homeData.leaveGraph.length > 0) {
              const latestMonth = homeData.leaveGraph[homeData.leaveGraph.length - 1];
              setTeamLeaveNotifications(latestMonth.pending || 0);
            }
          }
        } catch (error) {
          console.error('Error loading manager KPI data:', error);
        }
      };

      const loadLast3MonthsPayroll = async () => {
        try {
          // Mock data for last 3 months payroll - replace with actual API call
        const employeeName =
    user?.fullName ||
    user?.name ||
    (user?.email ? user.email.split("@")[0] : "Current User");

  const mockPayrollData = [
    {
      employee: employeeName,
      month: "Mar 2026",
      gross: 5000,
      deductions: 500,
      net: 4500,
    },
    {
      employee: employeeName,
      month: "Apr 2026",
      gross: 5000,
      deductions: 450,
      net: 4550,
    },
    {
      employee: employeeName,
      month: "May 2026",
      gross: 5200,
      deductions: 520,
      net: 4680,
    },
  ];
          setLast3MonthsPayroll(mockPayrollData);
        } catch (error) {
          console.error('Error loading payroll data:', error);
        }
      };

      const loadSystemNotifications = async () => {
        try {
          const userRole = user.role?.toLowerCase();
          let notifications = [];

          if (userRole === 'admin') {
            // ✅ Fetch real attendance data to find checkout-missing employees
            try {
              const attendanceRes = await axios.get(
                `${import.meta.env.VITE_API_BASE_URL}/api/attendance/all`
              );

              const attendanceData = Array.isArray(attendanceRes.data)
                ? attendanceRes.data
                : Array.isArray(attendanceRes.data?.data)
                ? attendanceRes.data.data
                : [];

              // Find employees who checked in but not checked out
              const checkoutMissing = attendanceData.filter(
                (record) =>
                  record.checkIn &&
                  record.checkIn !== "-" &&
                  (!record.checkOut || record.checkOut === "-")
              );

              // Create one notification per employee with missing checkout
              // De-duplicate by employee name so same person across multiple dates shows once
              const seenNames = new Set();
              const checkoutNotifications = [];

              checkoutMissing.forEach((record, idx) => {
                const name = record.name || record.employeeName || "Employee";
                const empId = record.empId || record.employeeId || "";

                // Use name as dedup key (same employee, multiple missing days → one notification)
                if (!seenNames.has(name)) {
                  seenNames.add(name);
                  checkoutNotifications.push({
                    id: `checkout-missing-${empId || idx}`,
                    type: "warning",
                    message: `${name} - Not checked out`,
                    badge: 1,
                    link: "/attendance",
                    employeeId: empId,
                    employeeName: name,
                  });
                }
              });

              notifications.push(...checkoutNotifications);

              // Add other admin notifications
              notifications.push({
                id: "admin-payroll",
                type: "info",
                message: "Payroll processed for April 2026",
                badge: 0,
                link: "/payroll",
              });
            } catch (err) {
              console.error("Failed to fetch attendance for notifications:", err);
              // Fallback to static notification
              notifications.push({
                id: "admin-checkout-fallback",
                type: "warning",
                message: "Some employees forgot to checkout",
                badge: 1,
                link: "/attendance",
              });
            }
          } else {
            // Employee/Manager notifications: payroll, insurance, reimbursements
            notifications = [
              { id: 'emp-1', type: 'success', message: 'Payroll credited for April 2026', badge: 0, link: '/payroll' },
              { id: 'emp-2', type: 'info', message: 'Insurance claim approved', badge: 0, link: '/insurance-claim' },
              { id: 'emp-3', type: 'pending', message: 'Reimbursement request pending', badge: 1, link: '/reimbursement' },
            ];
          }

          setSystemNotifications(notifications);
        } catch (error) {
          console.error('Error loading system notifications:', error);
        }
      };

      // Load role-based data when user changes
      useEffect(() => {
        if (user?.email) {
          loadRoleBasedData();
        }
      }, [user, homeData]);

      // Fetch employees
useEffect(() => {
  const fetchEmployees = async () => {
    try {
      const employees = await getAllEmployees();

      console.log("Employees Count:", employees?.length);
      console.log("Employees:", employees);

      if (Array.isArray(employees)) {
        setEmployees(employees);
      } else {
        setEmployees([]);
      }
    } catch (err) {
      console.error("Home fetch employees error:", err);
      setEmployees([]);
    }
  };

  fetchEmployees();
}, []);

      const loadHomeData = async () => {
    if (!user?.email) return;

    try {
      const data = await fetchHomeData(user.email);

      setHomeData(data);

      if (data.attendanceGraph) {
        setAttendanceChartData(data.attendanceGraph);
      }

      if (data.leaveGraph) {
        const totals = data.leaveGraph.reduce(
          (acc, item) => ({
            approved: acc.approved + (item.approved || 0),
            pending: acc.pending + (item.pending || 0),
            rejected: acc.rejected + (item.rejected || 0),
          }),
          { approved: 0, pending: 0, rejected: 0 }
        );

        setLeaveChartData([
          { name: "Approved", value: totals.approved },
          { name: "Pending", value: totals.pending },
          { name: "Rejected", value: totals.rejected },
        ]);
      }

    } catch (err) {
      console.error(err);
    }
  };




      useEffect(() => {
    const fetchPayroll = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/payroll`
        );

        setPayrollData(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Payroll fetch error:", err);
        setPayrollData([]);
      }
    };

    fetchPayroll();
  }, []);
      // Fetch home data (includes attendance and leave graphs)
      useEffect(() => {
        const loadHomeData = async () => {
          if (!user?.email) return;

          try {
            const data = await fetchHomeData(user.email);
            console.log("✅ Home data loaded:", data);
            console.log("📊 Leave users count:", data.leaveUsers?.length || 0);
            console.log("📋 Leave users data:", data.leaveUsers);
            console.log("🕐 Today attendance data:", data.todayAttendance);
            setHomeData(data);

            // ✅ If todayAttendance is not in homeData, fetch it separately from attendance API
            if (!data.todayAttendance || !data.todayAttendance.checkIn) {
              console.log("🔄 Fetching today's attendance separately...");
              try {
                const userId = user.id || user._id || user.employeeId || user.empId;
                const attendanceData = await getMyAttendance(userId);
                
                // Find today's attendance record
                const today = new Date().toLocaleDateString("en-CA"); // YYYY-MM-DD format
                
                const todayRecord = Array.isArray(attendanceData) 
                  ? attendanceData.find(r => r.date === today)
                  : Array.isArray(attendanceData?.data)
                  ? attendanceData.data.find(r => r.date === today)
                  : null;
                
                console.log("📅 Today's record found:", todayRecord);
                
                if (todayRecord) {
                  const updatedTodayAttendance = {
                    status: todayRecord.status || (todayRecord.checkIn && todayRecord.checkIn !== "-" ? "Checked In" : "Not Checked In"),
                    checkIn: todayRecord.checkIn,
                    checkOut: todayRecord.checkOut,
                    date: todayRecord.date,
                    tos: todayRecord.tos,
                    attendanceType: todayRecord.attendanceType || todayRecord.type
                  };
                  
                  setHomeData(prev => ({
                    ...prev,
                    todayAttendance: updatedTodayAttendance
                  }));
                  
                  console.log("✅ Updated today's attendance:", updatedTodayAttendance);
                }
              } catch (err) {
                console.error("Failed to fetch today's attendance:", err);
              }
            } else {
              console.log("✅ Today's attendance from homeData:", data.todayAttendance);
            }

            // ✅ Set attendance percentage from backend stats (works for ALL roles)
            if (data.stats && data.stats.attendancePercentage !== undefined) {
              setMyAttendancePercentage(data.stats.attendancePercentage);
              console.log("📊 Attendance %:", data.stats.attendancePercentage, 
                "| Working days:", data.stats.workingDays,
                "| Checked in:", data.stats.checkedInDays,
                "| Leaves:", data.stats.approvedLeaveDays,
                "| Absent:", data.stats.absentDays);
            }

            // ✅ Set weekly off days from company settings
            if (data.weeklyOffDays && Array.isArray(data.weeklyOffDays)) {
              setWeeklyOffDays(data.weeklyOffDays);
            }

            // Set attendance graph data
            if (data.attendanceGraph && Array.isArray(data.attendanceGraph)) {
              const formatted = data.attendanceGraph.map((item) => ({
                month: item.month || "N/A",
                present: item.present || 0,
                leave: item.leave || 0,
                absent: item.absent || 0,
              }));
              setAttendanceChartData(formatted);
            }

            // Set leave graph data
            if (data.leaveGraph && Array.isArray(data.leaveGraph)) {
              // Sum up all months for pie chart
              const totals = data.leaveGraph.reduce(
                (acc, item) => ({
                  approved: acc.approved + (item.approved || 0),
                  pending: acc.pending + (item.pending || 0),
                  rejected: acc.rejected + (item.rejected || 0),
                }),
                { approved: 0, pending: 0, rejected: 0 }
              );

              setLeaveChartData([
                { name: "Approved", value: totals.approved },
                { name: "Pending", value: totals.pending },
                { name: "Rejected", value: totals.rejected },
              ]);
            }

            // Extract upcoming holidays from events
          // Extract ONLY FUTURE upcoming holidays
  if (data.events && Array.isArray(data.events)) {

    const today = new Date();

    // remove time for proper comparison
    today.setHours(0, 0, 0, 0);

    const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  const holidays = data.events
    .filter((event) => {

      if (event.type !== "Holiday") return false;
      if (!event.date) return false;

      const holidayDate = new Date(event.date);
      holidayDate.setHours(0, 0, 0, 0);

      // ✅ only current month + future dates
      return (
        holidayDate >= today &&
        holidayDate.getMonth() === currentMonth &&
        holidayDate.getFullYear() === currentYear
      );
    })
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0);

  setUpcomingHolidays(holidays);
  }

            // Fallback: if no holidays found in homeData, fetch directly from /api/events
            // This ensures employees and managers also see holidays
            if (!data.events || data.events.filter(e => e.type === "Holiday").length === 0) {
              try {
                const eventsRes = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/events`);
                if (Array.isArray(eventsRes.data)) {
                const today = new Date();
  today.setHours(0, 0, 0, 0);

  const holidays = eventsRes.data
    .filter((event) => {

      if (event.type !== "Holiday") return false;
      if (!event.date) return false;

      const holidayDate = new Date(event.date);
      holidayDate.setHours(0, 0, 0, 0);

      return (
        holidayDate >= today &&
        holidayDate.getMonth() === currentMonth &&
        holidayDate.getFullYear() === currentYear
      );
    })
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 5);
                  setUpcomingHolidays(holidays);
                }
              } catch (e) {
                console.error("Fallback holiday fetch failed:", e);
              }
            }
          } catch (err) {
            console.error("Home data fetch error:", err);
          }
        };

        loadHomeData();
      }, [user]);

      // Fetch events (birthdays)
      useEffect(() => {
        const fetchEvents = async () => {
          try {
            const employees = await getAllEmployees();
            const currentMonth = new Date().getMonth();
          
            const filtered = employees.filter((emp) => {
              if (!emp.dob) return false;
              return new Date(emp.dob).getMonth() === currentMonth;
            });

            setEvents(filtered.length);
          } catch (err) {
            console.error("Events fetch error:", err);
          }
        };

        fetchEvents();
      }, []);

      // Fetch notifications from backend and merge with system notifications
      useEffect(() => {
        const fetchNotifications = async () => {
          try {

        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/notifications`
        );
            
            // Transform notifications to include proper structure
            const notifs = Array.isArray(res.data) 
              ? res.data.map((n, index) => ({
                  id: n.id || index,
                  message: n.message || n.text || "New notification",
                  time: n.time || n.createdAt || new Date().toLocaleTimeString(),
                  read: n.read || false,
                  type: n.type || "info",
                  link: n.link || null,
                  badge: n.badge || 0,
                }))
              : [];
            
            setNotifications(notifs);

            // Merge real DB notifications into systemNotifications (prepend to existing)
            if (notifs.length > 0) {
              setSystemNotifications(prev => {
                // avoid duplicates by id
                const existingIds = new Set(prev.map(n => n.id));
                const newOnes = notifs.filter(n => !existingIds.has(n.id));
                return [...newOnes, ...prev];
              });
            }
          } catch (err) {
            console.error("Notifications fetch error:", err);
            setNotifications([]);
          }
        };

        fetchNotifications();
        
        // Refresh notifications every 30 seconds
        const interval = setInterval(fetchNotifications, 30000);
        return () => clearInterval(interval);
      }, []);

      const totalEmployees = employees.length;

      const pendingLeaves = homeData?.stats?.leavePending || 0;
      const payrollTotal = Array.isArray(payrollData)
    ? payrollData.reduce(
        (sum, emp) =>
          sum +
          (
            emp.net || 
            emp.netPay || 
            emp.gross || 
            emp.grossPay || 
            emp.salary || 
            0
          ),
        0
      )
    : 0;

      const KpiCard = ({ icon, title, value, color, onClick }) => (
    <div className={`kpi-card ${color}`} onClick={onClick}>
      <div className="kpi-content">
        <h1 className="kpi-title">{title}</h1>
        <div className="kpi-value">{value}</div>
      </div>
      <div className="kpi-icon">{icon}</div>
    </div>
  );

      const usersData = useMemo(() => {
        return employees.filter(
          (u) =>
            (u.fullName || u.name || "").toLowerCase().includes(search.toLowerCase()) &&
            (dept === "All" || u.department === dept)
        );
      }, [search, dept, employees]);

      useEffect(() => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (pos) => {
              const { latitude, longitude } = pos.coords;
              setLocation(`Lat: ${latitude.toFixed(3)}, Lon: ${longitude.toFixed(3)}`);
            },
            () => setLocation("Location not available")
          );
        }
      }, []);

      const getUniqueValues = (key) => {
    return [...new Set(employees.map(emp => emp[key]))];
  };

  const getVisibleUniqueValues = (key) => {
  return [
    ...new Set(
      employees
        .filter((emp) => {
          const matchesSearch =
            (emp.fullName || "")
              .toLowerCase()
              .includes(search.toLowerCase()) ||
            (emp.employeeId || "")
              .toString()
              .toLowerCase()
              .includes(search.toLowerCase());

          return matchesSearch;
        })
        .slice(0, 5) // same records shown in table
        .map((emp) => emp[key])
        .filter(Boolean)
    ),
  ];
};
  const filteredEmployees = employees.filter((emp) => {
    const active =
      (emp.status || "").toUpperCase() === "ACTIVE";

    const matchesSearch =
      (emp.fullName || "")
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      (emp.employeeId || "")
        .toString()
        .toLowerCase()
        .includes(search.toLowerCase());

    const matchesFilters = Object.keys(filters).every((key) => {
      if (!filters[key] || filters[key].length === 0) return true;

      const value =
        key === "fullName"
          ? emp.fullName
          : key === "designation"
          ? emp.designation
          : key === "department"
          ? emp.department
          : emp.status;

      return filters[key].includes(value);
    });

    return active && matchesSearch && matchesFilters;
  });

  const getPayrollUniqueValues = (key) => {
    return [...new Set(last3MonthsPayroll.map((item) => item[key]))];
  };
      return (
        <div className="dashboard">

          {/* KPI ROW - ROLE BASED */}
          <div className="kpi-row">
            {user?.role === "employee" && (
              <>
                <KpiCard 
                  title="My Attendance" 
                  value={`${myAttendancePercentage}%`} 
                  icon={<FaCalendarCheck />} 
                  color="blue" 
                  onClick={() => navigate("/attendance")}
                />
                <KpiCard 
                  title="Leave Notifications" 
                  value={myLeaveNotifications} 
                  icon={<FaBell />} 
                  color="red" 
                  onClick={() => navigate("/leave")}
                />
                <KpiCard 
                  title="My Payroll" 
                  value={`$${myPayrollAmount.toLocaleString()}`} 
                  icon={<FaMoneyBillWave />} 
                  color="green" 
                  onClick={() => navigate("/payroll")}
                />
                <KpiCard 
                  title="Events" 
                  value={events} 
                  icon={<FaBirthdayCake />} 
                  color="blue" 
                  onClick={() => setShowEventsPopup(true)}
                />
              </>
            )}

            {user?.role === "manager" && (
              <>
                <KpiCard 
                  title="Team Attendance" 
                  value={`${teamAttendancePercentage}%`} 
                  icon={<FaUserCheck />} 
                  color="blue" 
                  onClick={() => navigate("/attendance")}
                />
                <KpiCard 
                  title="Team Leave Notifications" 
                  value={teamLeaveNotifications} 
                  icon={<FaBell />} 
                  color="red" 
                  onClick={() => navigate("/leave")}
                />
                <KpiCard 
                  title="My Payroll" 
                  value={`$${myPayrollAmount.toLocaleString()}`} 
                  icon={<FaMoneyBillWave />} 
                  color="green" 
                  onClick={() => navigate("/payroll")}
                />
                <KpiCard 
                  title="Events" 
                  value={events} 
                  icon={<FaBirthdayCake />} 
                  color="blue" 
                  onClick={() => setShowEventsPopup(true)}
                />
              </>
            )}

            {(user?.role === "hr" || user?.role === "admin") && (
              <>
              <KpiCard
    title="Total Employees"
    value={totalEmployees}
    icon={<FaUsers />}
    color="blue"
    onClick={() => navigate("/employee-card")}
  />
  <KpiCard 
    title="Pending Leaves" 
    value={pendingLeaves} 
    icon={<FaBell />}
    color="red"
    onClick={() => navigate("/leave", { state: { focus: "pending" } })}
  />

  <KpiCard 
    title="Org Payroll" 
    value={`$${(payrollTotal || 0).toLocaleString()}`}
    icon={<FaMoneyBillWave />}
    color="orange"
    onClick={() => navigate("/payroll")} 
  />

  <KpiCard
    title="Events"
    value={events}
    icon={<FaBirthdayCake />}
    color="yellow"
    onClick={() => setShowEventsPopup(true)}
  />
              </>
            )}
          </div>

      {showEventsPopup && (
    <div className="popup-overlay" onClick={() => setShowEventsPopup(false)}>
      <div className="popup-box" onClick={(e) => e.stopPropagation()}>
        
        <h2>📅 Events & Birthdays</h2>

        {/* 🎉 HOLIDAYS */}
        <h3>
    Upcoming Holidays ({new Date().toLocaleString("default", { month: "long" })})
  </h3>
      {currentMonthEvents.length > 0 ? (
    currentMonthEvents.map((event, i) => (
      <div key={i} className="popup-item">
      📅 <strong>{event.title}</strong> — {
    new Date(event.date + "T00:00:00").toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
      weekday: "short",
    })
  }
      </div>
    ))
  ) : (
    <p>No events this month</p>
  )}

        {/* 🎂 BIRTHDAYS */}
        {/* 🎂 BIRTHDAYS */}
  <h3 style={{ marginTop: "15px" }}>Birthdays</h3>

  {currentMonthBirthdays.length > 0 ? (
    currentMonthBirthdays.map((emp, i) => {
      const d = new Date(emp.dob);

      return (
        <div key={i} className="popup-item">
          🎂 {emp.fullName || emp.name} -{" "}
          {d.toLocaleDateString("en-US", {
            day: "numeric",
            month: "short",
          })}
        </div>
      );
    })
  ) : (
    <p>No birthdays this month</p>
  )}
        

        <button className="close-btn" onClick={() => setShowEventsPopup(false)}>
          Close
        </button>
      </div>
    </div>
  )}
          {/* WHO'S ON LEAVE TODAY + UPCOMING HOLIDAYS - KEKA STYLE */}
          {(() => {
            const todayLeaves = homeData?.leaveUsers || [];

            return (
            <div className="mobile-top-panels" style={{display:'flex', gap:'12px', marginBottom:'12px', flexWrap:'wrap'}}>
                
                {/* WHO'S ON LEAVE TODAY */}
                <div className="panel" style={{flex:'1', minWidth:'260px', borderLeft:'4px solid #3b82f6', padding:'10px 14px'}}>
                  <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'8px'}}>
                    <h3 style={{margin:0, fontSize:'13px', fontWeight:'600', color:'#1f2937'}}>🏖️ On Leave Today</h3>
                    {todayLeaves.length > 0 && (
                      <span style={{background:'#dbeafe', color:'#1e40af', padding:'2px 8px', borderRadius:'10px', fontSize:'11px', fontWeight:'600'}}>
                        {todayLeaves.length} {todayLeaves.length === 1 ? 'person' : 'people'}
                      </span>
                    )}
                  </div>

                  {todayLeaves.length === 0 ? (
                    <div style={{textAlign:'center', padding:'10px 0', color:'#6b7280'}}>
                      <span style={{fontSize:'18px'}}>✅</span>
                      <p style={{margin:'4px 0 0', fontSize:'12px', fontWeight:'600', color:'#374151'}}>Everyone is present today!</p>
                    </div>
                  ) : (
                  <div
    className="leave-today-scroll"
    style={{
      display: "flex",
      flexWrap: "wrap",
      gap: "8px",
      maxHeight: "155px",
      overflowY: "auto",
      paddingRight: "4px",
    }}
  >
    {todayLeaves.map((leave, i) => (
                        <div key={i}
                        className="leave-card"
                        style={{display:'flex', alignItems:'center', gap:'8px', padding:'6px 10px', background:'#f8fafc', borderRadius:'8px', border:'1px solid #e2e8f0'}}>
                          <img
                            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(leave.name || 'User')}&background=random&color=fff&size=32`}
                            alt={leave.name}
                            style={{width:'32px', height:'32px', borderRadius:'50%', border:'2px solid #3b82f6', flexShrink:0}}
                          />
                          <div>
                            <div style={{fontWeight:'600', fontSize:'12px', color:'#1f2937'}}>{leave.name || 'Unknown'}</div>
                            <div style={{fontSize:'10px', color:'#64748b'}}>
                              {leave.startDate ? new Date(leave.startDate + 'T00:00:00').toLocaleDateString('en-US', {month:'short', day:'numeric'}) : ''} - {leave.endDate ? new Date(leave.endDate + 'T00:00:00').toLocaleDateString('en-US', {month:'short', day:'numeric'}) : ''}
                            </div>
                            {leave.leaveType && (
                              <span style={{display:'inline-block', padding:'1px 5px', background:'#e0f2fe', color:'#0369a1', borderRadius:'3px', fontSize:'9px', fontWeight:'600'}}>
                                {leave.leaveType}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* UPCOMING HOLIDAYS */}
                <div className="panel" style={{flex:'1', minWidth:'260px', borderLeft:'4px solid #f59e0b', padding:'10px 14px'}}>
                  <div style={{marginBottom:'8px'}}>
                    <h3 style={{margin:0, fontSize:'13px', fontWeight:'600', color:'#1f2937'}}>🎉 Upcoming Holidays</h3>
                  </div>

                  {upcomingHolidays.length === 0 ? (
                    <div style={{textAlign:'center', padding:'10px 0', color:'#6b7280'}}>
                      <span style={{fontSize:'18px'}}>📅</span>
                      <p style={{margin:'4px 0 0', fontSize:'12px', fontWeight:'600', color:'#374151'}}>No upcoming holidays</p>
                    </div>
                  ) : (
                    <div style={{display:'flex', flexDirection:'column', gap:'6px'}}>
                      {upcomingHolidays.map((holiday, i) => (
                        <div key={i} style={{display:'flex', alignItems:'center', gap:'10px', padding:'6px 10px', background:'linear-gradient(135deg, #fef9c3, #fef08a)', borderRadius:'8px', border:'1px solid #fde047'}}>
                          <div style={{display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', minWidth:'36px', height:'36px', background:'#fff', borderRadius:'6px', border:'1.5px solid #f59e0b', flexShrink:0}}>
                            <div style={{fontSize:'14px', fontWeight:'700', color:'#b45309', lineHeight:'1'}}>{new Date(holiday.date + 'T00:00:00').getDate()}</div>
                            <div style={{fontSize:'8px', fontWeight:'600', color:'#92400e', textTransform:'uppercase'}}>{new Date(holiday.date + 'T00:00:00').toLocaleDateString('en-US', {month:'short'})}</div>
                          </div>
                          <div style={{flex:1, minWidth:0}}>
                            <div style={{fontWeight:'600', fontSize:'12px', color:'#78350f', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis'}}>{holiday.title}</div>
                            <div style={{fontSize:'10px', color:'#92400e', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis'}}>{holiday.description || 'Public Holiday'}</div>
                          </div>
                          <div style={{fontSize:'10px', fontWeight:'600', color:'#b45309', padding:'2px 6px', background:'#fff', borderRadius:'4px', whiteSpace:'nowrap', flexShrink:0}}>
                            {new Date(holiday.date + 'T00:00:00').toLocaleDateString('en-US', {weekday:'short'})}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>
            );
          })()}
          {/* MAIN GRID */}
          <div className="main-grid">

            {/* LEFT */}
            <div>
              {/* EMP DIRECTORY */}
              <div className="panel emp-panel">
                <div className="panel-header">
                  <h3>Employee Directory</h3>
                </div>

                <div className="emp-filters">
                  <div className="emp-search">
                    <FaSearch className="emp-search-icon" />
                    <input
                      className="emp-search-input"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search employee..."
                    />
                  </div>

                  <select
                    className="emp-select"
                    value={dept}
                    onChange={(e) => setDept(e.target.value)}
                  >
                    <option>All</option>
                    <option>HR</option>
                    <option>IT</option>
                    <option>Sales</option>
                  </select>

                  {(search || Object.keys(filters).some(key => filters[key] && filters[key].length > 0)) && (
                    <button
                      onClick={() => {
                        setSearch("");
                        setFilters({});
                      }}
                      style={{
                        padding: "6px 12px",
                        borderRadius: "6px",
                        border: "1px solid #ccc",
                        cursor: "pointer",
                        background: "#f5f5f5",
                        marginLeft: "10px"
                      }}
                    >
                      Clear Filters
                    </button>
                  )}
                </div>

                <div className="scrollable-box emp-scroll">
                  <table className="emp-table">
                  <thead>

    <tr>
  <th style={{ position: "relative" }}>
    <div
      className="header-filter"
      onClick={() =>
        setActiveFilter(
          activeFilter === "fullName"
            ? null
            : "fullName"
        )
      }
    >
      Emp Name <span>▼</span>
    </div>

    {activeFilter === "fullName" && (
      <div className="filter-popup">

        {/* Search Box */}
        <input
          type="text"
          placeholder="Search"
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
        />

        {/* Select All */}
        {(() => {
          const visibleVals = getVisibleUniqueValues("fullName").filter((v) =>
            String(v).toLowerCase().includes(filterText.toLowerCase())
          );
          const allSelected = visibleVals.length > 0 && visibleVals.every((v) => filters.fullName?.includes(v));
          return (
            <label style={{ fontWeight: 700, padding: "4px 0", display: "flex", alignItems: "center", gap: 6, borderBottom: "1px solid #e5e7eb", marginBottom: 4 }}>
              <input
                type="checkbox"
                checked={allSelected}
                onChange={(e) => {
                  setFilters((prev) => ({
                    ...prev,
                    fullName: e.target.checked
                      ? [...new Set([...(prev.fullName || []), ...visibleVals])]
                      : (prev.fullName || []).filter((v) => !visibleVals.includes(v)),
                  }));
                }}
              />
              Select All
            </label>
          );
        })()}

        {/* Checkbox List */}
<div className="filter-checkbox-list">
 {getVisibleUniqueValues("fullName")
    .filter((value) =>
      String(value)
        .toLowerCase()
        .includes(filterText.toLowerCase())
    )
    .map((value) => (
      <label key={value}>
        <input
          type="checkbox"
          checked={filters.fullName?.includes(value) || false}
          onChange={(e) => {
            setFilters((prev) => ({
              ...prev,
              fullName: e.target.checked
                ? [...(prev.fullName || []), value]
                : (prev.fullName || []).filter(
                    (v) => v !== value
                  ),
            }));
          }}
        />
        {value}
      </label>
    ))}
</div>

        {/* Buttons */}
        <div className="filter-buttons">
          <button onClick={() => setActiveFilter(null)}>
            OK
          </button>

          <button onClick={() => setActiveFilter(null)}>
            Cancel
          </button>
        </div>

      </div>
    )}
  </th>
    <th style={{ position: "relative" }}>
    <div
      className="header-filter"
      onClick={() =>
        setActiveFilter(
          activeFilter === "department"
            ? null
            : "department"
        )
      }
    >
      Department <span>▼</span>
    </div>

    {activeFilter === "department" && (
      <div className="filter-popup">

        {/* Search Box */}
        <input
          type="text"
          placeholder="Search"
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
        />

        {/* Select All */}
        {(() => {
          const visibleVals = getVisibleUniqueValues("department").filter((v) =>
            String(v).toLowerCase().includes(filterText.toLowerCase())
          );
          const allSelected = visibleVals.length > 0 && visibleVals.every((v) => filters.department?.includes(v));
          return (
            <label style={{ fontWeight: 700, padding: "4px 0", display: "flex", alignItems: "center", gap: 6, borderBottom: "1px solid #e5e7eb", marginBottom: 4 }}>
              <input
                type="checkbox"
                checked={allSelected}
                onChange={(e) => {
                  setFilters((prev) => ({
                    ...prev,
                    department: e.target.checked
                      ? [...new Set([...(prev.department || []), ...visibleVals])]
                      : (prev.department || []).filter((v) => !visibleVals.includes(v)),
                  }));
                }}
              />
              Select All
            </label>
          );
        })()}

        {/* Checkbox List */}
     <div className="filter-checkbox-list">
 {getVisibleUniqueValues("department")
    .filter((value) =>
      String(value)
        .toLowerCase()
        .includes(filterText.toLowerCase())
    )
    .map((value) => (
      <label key={value}>
        <input
          type="checkbox"
        checked={
  filters.department?.includes(value) || false
}
onChange={(e) => {
  setFilters((prev) => ({
    ...prev,
    department: e.target.checked
      ? [...(prev.department || []), value]
      : (prev.department || []).filter(
          (v) => v !== value
        ),
  }));
}}
        />
        {value}
      </label>
    ))}
</div>

        {/* Buttons */}
        <div className="filter-buttons">
          <button onClick={() => setActiveFilter(null)}>
            OK
          </button>

          <button onClick={() => setActiveFilter(null)}>
            Cancel
          </button>
        </div>

      </div>
    )}
  </th>

    <th style={{ position: "relative" }}>
    <div
      className="header-filter"
      onClick={() =>
        setActiveFilter(
          activeFilter === "designation"
            ? null
            : "designation"
        )
      }
    >
      Role <span>▼</span>
    </div>

   {activeFilter === "designation" && (
      <div className="filter-popup">

        {/* Search Box */}
        <input
          type="text"
          placeholder="Search"
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
        />

        {/* Select All */}
        {(() => {
          const visibleVals = getVisibleUniqueValues("designation").filter((v) =>
            String(v).toLowerCase().includes(filterText.toLowerCase())
          );
          const allSelected = visibleVals.length > 0 && visibleVals.every((v) => filters.designation?.includes(v));
          return (
            <label style={{ fontWeight: 700, padding: "4px 0", display: "flex", alignItems: "center", gap: 6, borderBottom: "1px solid #e5e7eb", marginBottom: 4 }}>
              <input
                type="checkbox"
                checked={allSelected}
                onChange={(e) => {
                  setFilters((prev) => ({
                    ...prev,
                    designation: e.target.checked
                      ? [...new Set([...(prev.designation || []), ...visibleVals])]
                      : (prev.designation || []).filter((v) => !visibleVals.includes(v)),
                  }));
                }}
              />
              Select All
            </label>
          );
        })()}

        {/* Checkbox List */}
        {getVisibleUniqueValues("designation")
          .filter((value) =>
            String(value)
              .toLowerCase()
              .includes(filterText.toLowerCase())
          )
          .map((value) => (
            <label key={value}>
              <input
                type="checkbox"
                checked={
                  filters.designation?.includes(value) || false
                }
                onChange={(e) => {
                 setFilters((prev) => ({
  ...prev,
  designation: e.target.checked
    ? [...(prev.designation || []), value]
    : (prev.designation || []).filter(
        (v) => v !== value
      ),
}));
                }}
              />
              {value}
            </label>
          ))}

        {/* Buttons */}
        <div className="filter-buttons">
          <button onClick={() => setActiveFilter(null)}>
            OK
          </button>

          <button onClick={() => setActiveFilter(null)}>
            Cancel
          </button>
        </div>

      </div>
    )}
  </th>
  <th style={{ position: "relative" }}>
    <div
      className="header-filter"
      onClick={() =>
        setActiveFilter(
          activeFilter === "status"
            ? null
            : "status"
        )
      }
    >
      Status <span>▼</span>
    </div>

    {activeFilter === "status" && (
      <div className="filter-popup">

        {/* Search Box */}
        <input
          type="text"
          placeholder="Search"
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
        />

        {/* Select All */}
        {(() => {
          const visibleVals = getVisibleUniqueValues("status").filter((v) =>
            String(v).toLowerCase().includes(filterText.toLowerCase())
          );
          const allSelected = visibleVals.length > 0 && visibleVals.every((v) => filters.status?.includes(v));
          return (
            <label style={{ fontWeight: 700, padding: "4px 0", display: "flex", alignItems: "center", gap: 6, borderBottom: "1px solid #e5e7eb", marginBottom: 4 }}>
              <input
                type="checkbox"
                checked={allSelected}
                onChange={(e) => {
                  setFilters((prev) => ({
                    ...prev,
                    status: e.target.checked
                      ? [...new Set([...(prev.status || []), ...visibleVals])]
                      : (prev.status || []).filter((v) => !visibleVals.includes(v)),
                  }));
                }}
              />
              Select All
            </label>
          );
        })()}

        {/* Checkbox List */}
        {getVisibleUniqueValues("status")
          .filter((value) =>
            String(value)
              .toLowerCase()
              .includes(filterText.toLowerCase())
          )
          .map((value) => (
            <label key={value}>
              <input
                type="checkbox"
                checked={
                  filters.status?.includes(value) || false
                }
                onChange={(e) => {
                 setFilters((prev) => ({
  ...prev,
  status: e.target.checked
    ? [...(prev.status || []), value]
    : (prev.status || []).filter(
        (v) => v !== value
      ),
}));
                }}
              />
              {value}
            </label>
          ))}

        {/* Buttons */}
        <div className="filter-buttons">
          <button onClick={() => setActiveFilter(null)}>
            OK
          </button>

          <button onClick={() => setActiveFilter(null)}>
            Cancel
          </button>
        </div>

      </div>
    )}
  </th>
    </tr>
  </thead>
                    <tbody>
                    {employees.length === 0 ? (
    <tr>
      <td colSpan="4">No employees</td>
    </tr>
  ) : (
  employees
    .filter((emp) => {
      const active =
        (emp.status || "").toUpperCase() === "ACTIVE";

      const matchesSearch =
        (emp.fullName || "")
          .toLowerCase()
          .includes(search.toLowerCase()) ||

        (emp.employeeId || "")
          .toString()
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesHeaderFilters = Object.keys(filters).every((key) => {
        if (!filters[key] || filters[key].length === 0) return true;

        return filters[key].includes(emp[key]);
      });

      return matchesSearch && matchesHeaderFilters;
    })
    .slice(0, 5)
    .map((emp, index) => (
        <tr key={emp.employeeId || index}>
          <td className="emp-cell">
            <img
              src={
                emp.image && emp.image !== ""
                  ? emp.image
                  : `https://ui-avatars.com/api/?name=${encodeURIComponent(emp.fullName)}`
              }
              alt=""
            />
            {emp.fullName}
          </td>

          <td>{emp.department}</td>
          <td>{emp.designation}</td>

          <td>
            <span className="status active">{emp.status}</span>
          </td>
        </tr>
      ))
  )}

                    </tbody>
                  </table>
                </div>
              </div>

              {/* CHARTS */}
              <div className="chart-row">

                {/* ATTENDANCE */}
                <div className="panel chart-box attendance-panel">
                  <h2>Attendance</h2>
                  <ResponsiveContainer width="100%" height={200}>
                  <BarChart
    data={attendanceChartData}
    margin={{ top: 10, right: 20, left: 10, bottom: 20 }}
  >
    <XAxis
      dataKey="month"
      label={{
        value: "Month",
        position: "insideBottom",
        offset: -5,
      }}
    />

    <YAxis
      label={{
        value: "No of Days",
        angle: -90,
        position: "insideLeft",
      }}
      domain={[0, 31]}
      ticks={[0, 5, 10, 15, 20, 25, 30]}
    />

    <Tooltip />

    <Bar dataKey="present" fill="#22c55e" name="Present Days" />
    <Bar dataKey="leave" fill="#facc15" name="Leave Days" />
    <Bar dataKey="absent" fill="#ef4444" name="Absent Days" />
  </BarChart>
                  </ResponsiveContainer>

                  <div className="attendance-legend">
                    <span className="legend present">● Present</span>
                    <span className="legend leave">● Leave</span>
                    <span className="legend absent">● Absent</span>
                  </div>
                </div>

                {/* LEAVE */}
                <div className="panel chart-box">
                  <h2>Leave Summary</h2>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={Array.isArray(leaveChartData) && leaveChartData.length > 0 ? leaveChartData : []}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={70}
                        innerRadius={0}
                        paddingAngle={2}
                        label={({ name, value }) => value > 0 ? `${value}` : ''}
                        labelLine={false}
                      >
                        {leaveChartData.map((entry, index) => {
                          const colors = ['#22c55e', '#facc15', '#ef4444'];
                          return <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />;
                        })}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#fff', 
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px',
                          fontSize: '12px'
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>

                  <div className="leave-legend">
                    <span className="approved">● Approved</span>
                    <span className="pending">● Pending</span>
                    <span className="rejected">● Rejected</span>
                  </div>
                </div>

              </div>
            </div>

            {/* RIGHT PANEL */}
            <div className="panel right-panel">
              <div className="check-card">
              <div className="check-header">
    <FaMapMarkerAlt className="gps-icon" />
    <span>{location}</span>
  </div>

  <div className="attendance-info">
    <div>
      <strong>Status:</strong>{" "}
      {homeData?.todayAttendance?.status || 
       (homeData?.todayAttendance?.checkIn || homeData?.todayAttendance?.checkInTime ? "Checked In" : "Not Checked In")}
    </div>

    <div>
      <strong>Check-In:</strong>{" "}
      {formatTime(homeData?.todayAttendance?.checkIn || 
       homeData?.todayAttendance?.checkInTime) || 
       "--"}
    </div>

    <div>
      <strong>Check-Out:</strong>{" "}
      {formatTime(homeData?.todayAttendance?.checkOut || 
       homeData?.todayAttendance?.checkOutTime) || 
       "--"}
    </div>

    <div>
      <strong>Total Hours:</strong>{" "}
      {(() => {
        const checkIn = homeData?.todayAttendance?.checkIn || homeData?.todayAttendance?.checkInTime;
        const checkOut = homeData?.todayAttendance?.checkOut || homeData?.todayAttendance?.checkOutTime;
        if (!checkIn || checkIn === "-") return "--";
        const parseTime = (timeStr) => {
          const now = new Date();
          return new Date(`${now.toDateString()} ${timeStr}`);
        };
        const start = parseTime(checkIn);
        const end = checkOut && checkOut !== "-" ? parseTime(checkOut) : new Date();
        const diff = end - start;
        if (diff < 0) return "--";
        const hrs = Math.floor(diff / (1000 * 60 * 60));
        const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const secs = Math.floor((diff % (1000 * 60)) / 1000);
        return `${hrs}h ${mins}m ${secs}s`;
      })()}
    </div>
  </div>

                <div className="check-buttons">
                  <div>
                    <p>Check-In</p>
                    <h2>{homeData?.todayAttendance?.checkIn ? 
                        formatTime(homeData?.todayAttendance?.checkIn) : 
                        "Not checked in"}
                    </h2>
                  <button
    className="check-btn"
  onClick={async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/attendance/checkin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
        userId: String(
  user?.id ||
  user?._id ||
  user?.employeeId ||
  user?.empId ||
  ""
).trim(),

  empId:
    (user?.role === "admin" || user?.role === "ADMIN")
      ? "ADMIN001"
      : user?.employeeId ||
        user?.empId ||
        user?.employeeCode ||
        "",
          name:
    (user?.role === "admin" || user?.role === "ADMIN")
      ? (user?.name || user?.fullName || "Admin")
      : user?.name ||
        user?.fullName ||
        user?.email ||
        "N/A",
          department: user?.department,
          message: `${user?.name} checked in`,
      type: "success",
      link: "/attendance",
      attendanceType: "Office",
      tos: user?.tos || "-"
        }),
      });

  if (res.ok) {
      const currentTime = new Date().toLocaleTimeString("en-GB", {
    hour12: false,
  });
    setHomeData(prev => ({
    ...prev,
    todayAttendance: {
      ...prev?.todayAttendance,
      checkIn: currentTime,
      checkInTime: currentTime,
      status: "Pending Approval"
    }
  }));

    alert("Check-in successful");
    await refreshAttendanceStatus(); // 🔄 LIVE UPDATE
  } else {
    alert("Check-in failed");
  }
    } catch (err) {
      console.error(err);
      alert("Error during check-in");
    }
  }}
  >
    Check In
  </button>
                  </div>
          
                  <div>
                    <p>Check-Out</p>
                    <h2>{homeData?.todayAttendance?.checkOut ? 
                        formatTime(homeData?.todayAttendance?.checkOut) : 
                        "Not checked out"}
                    </h2>
                  <button
    className="check-btn red-btn"
  onClick={async () => {
    try {
    const currentTime = new Date().toLocaleTimeString("en-GB", {
  hour12: false,
});
      
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/attendance/checkout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      body: JSON.stringify({
  userId: String(
    user?.id ||
    user?._id ||
    user?.employeeId ||
    user?.empId ||
    ""
  ).trim(),
  message: `${user?.name} checked out`,
  type: "info",
  link: "/attendance"
})
      });

      if (res.ok) {
        // ✅ Immediately update UI with current checkout time
        setHomeData(prev => ({
          ...prev,
          todayAttendance: {
            ...prev?.todayAttendance,
            checkOut: currentTime,
            checkOutTime: currentTime,
            status: "Checked Out"
          }
        }));
        
        alert("Check-out successful");
        
        // 🔄 Then fetch fresh data from server
        await refreshAttendanceStatus();
      } else {
        alert("Check-out failed");
      }
    } catch (err) {
      console.error(err);
      alert("Error during check-out");
    }
  }}
  >
    Check Out
  </button>
                  </div>
                </div>
              </div>

              <Calendar 
                className="styled-calendar" 
                value={selectedDate}
                onChange={setSelectedDate}
                tileContent={({ date, view }) => {
                  if (view === 'month') {
                    const events = getEventsForDate(date);
                    if (events.length > 0) {
                      return <div className="calendar-event-indicator">•</div>;
                    }
                  }
                  return null;
                }}
                tileClassName={({ date, view }) => {
                  if (view !== 'month') return null;
                  const dayName = date.toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase();
                  const dateStr = date.toISOString().split('T')[0];
                  const isWeeklyOff = weeklyOffDays.includes(dayName);
                  const isHoliday = (homeData?.events || []).some(
                    e => e.type === 'Holiday' && e.date === dateStr
                  );
                  if (isHoliday) return 'calendar-holiday';
                  if (isWeeklyOff) return 'calendar-weekly-off';
                  return null;
                }}
              />

              {/* ── Holiday & Weekly Off Info Panel (below calendar) ── */}
              <div style={{
                marginTop: 10,
                background: "#f8fafc",
                borderRadius: 10,
                border: "1px solid #e2e8f0",
                overflow: "hidden"
              }}>
                {/* Weekly Off Row */}
                <div style={{
                  padding: "8px 12px",
                  borderBottom: "1px solid #e2e8f0",
                  display: "flex", alignItems: "center", gap: 8
                }}>
                  <span style={{ fontSize: 14 }}>📅</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: "#374151" }}>Weekly Off:</span>
                  <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                    {weeklyOffDays.length > 0 ? weeklyOffDays.map(day => (
                      <span key={day} style={{
                        padding: "2px 8px", borderRadius: 10,
                        background: "#dbeafe", color: "#1e40af",
                        fontSize: 11, fontWeight: 600
                      }}>
                        {day.charAt(0) + day.slice(1).toLowerCase()}
                      </span>
                    )) : (
                      <span style={{ fontSize: 11, color: "#6b7280" }}>None configured</span>
                    )}
                  </div>
                </div>

                {/* Upcoming Holidays List */}
                <div style={{ padding: "8px 12px" }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#374151", marginBottom: 6 }}>
                    🎉 Upcoming Holidays
                  </div>
                  {upcomingHolidays.length === 0 ? (
                    <div style={{ fontSize: 11, color: "#6b7280" }}>No upcoming holidays</div>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                      {upcomingHolidays.slice(0, 4).map((h, i) => {
                        const d = new Date(h.date + 'T00:00:00');
                        return (
                          <div key={i} style={{
                            display: "flex", alignItems: "center", gap: 8,
                            padding: "4px 8px",
                            background: "linear-gradient(135deg, #fef9c3, #fef08a)",
                            borderRadius: 6, border: "1px solid #fde047"
                          }}>
                            <div style={{
                              minWidth: 28, height: 28,
                              background: "#fff", borderRadius: 4,
                              border: "1.5px solid #f59e0b",
                              display: "flex", flexDirection: "column",
                              alignItems: "center", justifyContent: "center",
                              flexShrink: 0
                            }}>
                              <div style={{ fontSize: 11, fontWeight: 700, color: "#b45309", lineHeight: 1 }}>
                                {d.getDate()}
                              </div>
                              <div style={{ fontSize: 8, color: "#92400e", textTransform: "uppercase" }}>
                                {d.toLocaleDateString('en-US', { month: 'short' })}
                              </div>
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{
                                fontSize: 11, fontWeight: 600, color: "#78350f",
                                whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis"
                              }}>{h.title}</div>
                              <div style={{ fontSize: 10, color: "#92400e" }}>
                                {d.toLocaleDateString('en-US', { weekday: 'short' })}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
              <div className="calendar-event-box">
                <h4>Events for {selectedDate.toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</h4>
                
                {(() => {
                  const events = getEventsForDate(selectedDate);
                  if (events.length > 0) {
                    return (
                      <div className="events-list">
                        {events.map((event, index) => (
                          <div key={index} className="event-item">
                            🎉 {event}
                          </div>
                        ))}
                      </div>
                    );
                  } else {
                    return <p>No events for this date</p>;
                  }
                })()}
              </div>
            </div>
            <ViewPayslipModal
    open={showPayslipModal}
    onClose={() => setShowPayslipModal(false)}
    data={{
      empName: selectedPayroll?.employee,
      month: selectedPayroll?.month,
      grossPay: selectedPayroll?.gross,
      deductions: selectedPayroll?.deductions,
      netPay: selectedPayroll?.net,
    }}
  />
          </div>

          {/* BOTTOM */}
          <div className="bottom-grid">
            <div className="panel small-panel">
              <h3>Last 3 Months Payroll</h3>
              <div className="scrollable-box payroll-scroll">
                <table className="emp-table">
                <thead>


   <tr>
  <th>Employee Name</th>
  <th>Month</th>
  <th>Gross</th>
  <th>Deductions</th>
  <th>Net Pay</th>
  <th>Action</th>
</tr>
  </thead>
                  <tbody>
                  {last3MonthsPayroll
    .filter((payroll) => {
      return Object.keys(payrollFilters).every((key) => {
        if (
          !payrollFilters[key] ||
          payrollFilters[key].length === 0
        )
          return true;

        return payrollFilters[key].includes(String(payroll[key]));
      });
    })
    .map((payroll, index) => (
                      <tr key={index}>
                        <td>{payroll.employee}</td>
                        <td>{payroll.month}</td>
                        <td>${payroll.gross}</td>
                        <td>${payroll.deductions}</td>
                        <td>${payroll.net}</td>
                        <td>
    <button
      className="btn-primary"
      onClick={() => {
        setSelectedPayroll(payroll);
        setShowPayslipModal(true);
      }}
    >
      View
    </button>
  </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="panel small-panel">
              <div className="panel-header">
                <h3>Notifications</h3>
                <FaEllipsisH />
              </div>
              <div className="scrollable-box notif-scroll">
              {systemNotifications
    .filter(
      (notification) =>
        !readNotifications.includes(notification.id)
    )
    .map((notification, index) => (
  <div
    key={notification.id}
    className={`notify ${notification.type}`}
    onClick={() => {
      // ✅ Mark as read so it disappears after clicking
      setReadNotifications((prev) => [
        ...prev,
        notification.id,
      ]);
      
      if (notification.link) {
        // ✅ Pass employee name in state so Attendance page can auto-filter
        const navigationState = notification.employeeName
          ? { filterEmployee: notification.employeeName, employeeName: notification.employeeName }
          : null;
        
        navigate(notification.link, navigationState ? { state: navigationState } : {});
      }
    }}
    style={{ cursor: "pointer", position: "relative" }}
  >
    <span className="notification-text">
      {notification.message}
    </span>

    {notification.badge > 0 && (
        <span className="notification-badge">
          {notification.badge}
        </span>
    )}
  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      );
    }