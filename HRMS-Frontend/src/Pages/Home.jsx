  import React, { useMemo, useState, useEffect, useContext } from "react";
  import Calendar from "react-calendar";
  import axios from "axios";
  import { useNavigate } from "react-router-dom";
  import "react-calendar/dist/Calendar.css";
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
  } from "react-icons/fa";
  import { AuthContext } from "../Context/Authcontext";
  import { fetchHomeData } from "../api/homeApi";
  import "./Home.css";

  /* ================= DUMMY USERS ================= */

 




  export default function Home() {
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    const [search, setSearch] = useState("");
    const [dept, setDept] = useState("All");
    const [location, setLocation] = useState("Fetching...");
    const [employees, setEmployees] = useState([]);
    const [attendanceChartData, setAttendanceChartData] = useState([]);
    const [leaveChartData, setLeaveChartData] = useState([]);
    const [homeData, setHomeData] = useState(null);
    const [showEventsPopup, setShowEventsPopup] = useState(false);
    const [events, setEvents] = useState(0);
    const [upcomingHolidays, setUpcomingHolidays] = useState([]);
    const eventDates = useMemo(() => {
  return employees
    .filter(emp => emp.dob)
    .map(emp => {
      const d = new Date(emp.dob);
      return new Date(new Date().getFullYear(), d.getMonth(), d.getDate());
    });
}, [employees]);
    const [notifications, setNotifications] = useState([]);
    const [payrollData, setPayrollData] = useState([]);

    

    // Fetch employees
    useEffect(() => {
      const fetchEmployees = async () => {
        try {
          const res = await axios.get(
            `${import.meta.env.VITE_API_BASE_URL}/api/employee/all`
          );

          if (Array.isArray(res.data)) {
            setEmployees(res.data);
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
          setHomeData(data);

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
          if (data.events && Array.isArray(data.events)) {
            const todayStr = new Date().toISOString().split('T')[0];
            const holidays = data.events
              .filter(event => event.type === "Holiday" && event.date >= todayStr)
              .sort((a, b) => a.date.localeCompare(b.date))
              .slice(0, 5);
            setUpcomingHolidays(holidays);
          }

          // Fallback: if no holidays found in homeData, fetch directly from /api/events
          // This ensures employees and managers also see holidays
          if (!data.events || data.events.filter(e => e.type === "Holiday").length === 0) {
            try {
              const eventsRes = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/events`);
              if (Array.isArray(eventsRes.data)) {
                const todayStr = new Date().toISOString().split('T')[0];
                const holidays = eventsRes.data
                  .filter(event => event.type === "Holiday" && event.date >= todayStr)
                  .sort((a, b) => a.date.localeCompare(b.date))
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
          const res = await axios.get(
            `${import.meta.env.VITE_API_BASE_URL}/api/employee/all`
          );
          const currentMonth = new Date().getMonth();

          const filtered = res.data.filter((emp) => {
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

    // Fetch notifications
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
                link: n.link || null, // Link to navigate when clicked
              }))
            : [];
          
          setNotifications(notifs);
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

    const totalEmployees = employees.filter(
      (e) => (e.status || "").toUpperCase() === "ACTIVE"
    ).length;

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

    return (
      <div className="dashboard">

        {/* KPI ROW - ROLE BASED */}
        <div className="kpi-row">
          {user?.role === "employee" && (
            <>
              <KpiCard title="My Attendance" value="92%" icon={<FaUsers />} color="blue" />
              <KpiCard title="My Notifications" value="4" icon={<FaBell onClick={() => navigate("/notifications")} style={{ cursor: "pointer" }} />} color="red" />
              <KpiCard title="My Payroll" value="$4,500" icon={<FaMoneyBillWave />} color="green" />
              <KpiCard title="Events" value="2" icon={<FaBirthdayCake />} color="blue" />
            </>
          )}

          {user?.role === "manager" && (
            <>
              <KpiCard title="Team Attendance" value="89%" icon={<FaUsers />} color="blue" />
              <KpiCard title="Team Alerts" value="7" icon={<FaBell />} color="red" />
              <KpiCard title="Team Payroll" value="$18,500" icon={<FaMoneyBillWave />} color="green" />
              <KpiCard title="Events" value="3" icon={<FaBirthdayCake />} color="blue" />
            </>
          )}

          {(user?.role === "hr" || user?.role === "admin") && (
            <>
             <KpiCard
  title="Total Employees"
  value={totalEmployees}
  icon={<FaUsers />}
  color="blue"
  onClick={() => navigate("/employees")}
/>
<KpiCard 
  title="Pending Leaves" 
  value={pendingLeaves} 
  icon={<FaBell />}
  color="red" 
/>

<KpiCard 
  title="Org Payroll" 
  value={`$${(payrollTotal || 0).toLocaleString()}`}
  icon={<FaMoneyBillWave />}
  color="orange" 
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
      <h3>Upcoming Holidays</h3>
      {homeData?.events?.length > 0 ? (
        homeData.events.map((event, i) => (
          <div key={i} className="popup-item">
            <strong>{event.title}</strong> - {event.date}
          </div>
        ))
      ) : (
        <p>No holidays</p>
      )}

      {/* 🎂 BIRTHDAYS */}
      <h3 style={{marginTop:"15px"}}>Birthdays</h3>
      {employees.filter(emp => emp.dob).length > 0 ? (
        employees.map((emp, i) => {
          if (!emp.dob) return null;
          const d = new Date(emp.dob);
          return (
            <div key={i} className="popup-item">
              🎂 {emp.fullName || emp.name} - {d.toLocaleDateString()}
            </div>
          );
        })
      ) : (
        <p>No birthdays</p>
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
            <div style={{display:'flex', gap:'12px', marginBottom:'12px', flexWrap:'wrap'}}>
              
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
                  <div style={{display:'flex', flexWrap:'wrap', gap:'8px'}}>
                    {todayLeaves.slice(0, 6).map((leave, i) => (
                      <div key={i} style={{display:'flex', alignItems:'center', gap:'8px', padding:'6px 10px', background:'#f8fafc', borderRadius:'8px', border:'1px solid #e2e8f0'}}>
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
              </div>

              <div className="scrollable-box emp-scroll">
                <table className="emp-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Department</th>
                      <th>Role</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                   {employees.length === 0 ? (
  <tr>
    <td colSpan="4">No employees</td>
  </tr>
) : (
 employees
  .filter(emp => (emp.status || "").toUpperCase() === "ACTIVE")
  .slice(0, 5)
  .map((emp, index) => (
    <tr key={index}>
      <td className="emp-cell">
        <img
         src={`https://ui-avatars.com/api/?name=${emp.fullName || emp.name || "User"}`}
          alt=""
        />
        {emp.fullName || emp.name || emp.employeeName || "N/A"}
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
                    data={Array.isArray(attendanceChartData) && attendanceChartData.length > 0 ? attendanceChartData : []}
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                  >
                    <XAxis 
                      dataKey="month" 
                      tick={{ fontSize: 12 }}
                      stroke="#6b7280"
                    />
                    <YAxis 
                      tick={{ fontSize: 12 }}
                      stroke="#6b7280"
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#fff', 
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        fontSize: '12px'
                      }}
                    />
                    <Bar dataKey="present" fill="#22c55e" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="leave" fill="#facc15" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="absent" fill="#ef4444" radius={[4, 4, 0, 0]} />
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

              <div className="check-buttons">
                <div>
                  <p>Check-In</p>
                  <h2>Not checked in</h2>
                 <button
  className="check-btn"
 onClick={async () => {
  try {
    const res = await fetch("/api/attendance/checkin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: user?.id || user?.empId,   // ✅ REQUIRED
        name: user?.name,
        department: user?.department,
         message: `${user?.name} checked in`,
    type: "success",
    link: "/attendance"
      }),
    });

    if (res.ok) {
      alert("Check-in successful");
      window.location.reload();
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
                  <h2>Not checked out</h2>
                 <button
  className="check-btn red-btn"
onClick={async () => {
  try {
    const res = await fetch("/api/attendance/checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: user?.id || user?.empId,
         message: `${user?.name} checked out`,
    type: "info",
    link: "/attendance"
      }),
    });

    if (res.ok) {
      alert("Check-out successful");
      window.location.reload();
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

            <Calendar className="styled-calendar" />
            <div className="calendar-event-box">
  <h4>Upcoming Event</h4>

  {homeData?.events?.length > 0 ? (
    homeData.events
      .filter(e => e.date === "2026-04-30")
      .map((event, i) => (
        <div key={i} className="event-card">
          <p><strong>Date:</strong> {event.date}</p>
          <p><strong>Event:</strong> {event.title}</p>
        </div>
      ))
  ) : (
    <p>No events</p>
  )}
</div>
          </div>
        </div>

        {/* BOTTOM */}
        <div className="bottom-grid">
          <div className="panel small-panel">
            <h3>Payroll</h3>
            <div className="scrollable-box payroll-scroll">
              <table className="emp-table">
                <tbody>
                  <tr><td>John</td><td>Jan 2026</td><td>$5000</td><td>$500</td><td><button className="btn-primary">View</button></td></tr>
                  <tr><td>Rahul</td><td>Jan 2026</td><td>$4800</td><td>$450</td><td><button className="btn-primary">View</button></td></tr>
                  <tr><td>Priya</td><td>Jan 2026</td><td>$5200</td><td>$550</td><td><button className="btn-primary">View</button></td></tr>
                  <tr><td>Amit</td><td>Jan 2026</td><td>$5100</td><td>$500</td><td><button className="btn-primary">View</button></td></tr>
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
           {Array.isArray(notifications) && notifications.map((n, i) => (
  <div
    key={i}
    className={`notify ${n.type}`}
   onClick={async () => {
      if (n.link) navigate(n.link);
    }}
    style={{ cursor: "pointer" }}
  >
    {n.message}
  </div>
))}
              
            </div>
          </div>
        </div>

      </div>
    );
  }