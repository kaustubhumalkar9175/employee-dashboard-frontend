import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StatCard from '../components/StatCard';
import Charts from '../components/Charts';
import EmployeeForm from '../components/EmployeeForm';
import { getDashboardStats, getAllEmployees, createEmployee, deleteEmployee } from '../api/employeeApi';

function Dashboard() {
  const [stats, setStats]         = useState(null);
  const [employees, setEmployees] = useState([]);
  const [showForm, setShowForm]   = useState(false);
  const navigate                  = useNavigate();

  const loadAll = () => {
    getDashboardStats().then(r => setStats(r.data));
    getAllEmployees().then(r => setEmployees(r.data));
  };

  useEffect(() => { loadAll(); }, []);

  const handleAdd = async (form) => {
    await createEmployee(form);
    setShowForm(false);
    loadAll(); // refresh stats + table
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this employee?')) {
      await deleteEmployee(id);
      loadAll();
    }
  };

  return (
    <div className="page">

      {/* ── Header row ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div className="page-title" style={{ margin: 0 }}>📊 Dashboard Overview</div>
        <button
          onClick={() => setShowForm(!showForm)}
          style={{
            backgroundColor: '#e94560', color: '#fff', border: 'none',
            padding: '10px 24px', borderRadius: '8px', fontSize: '14px',
            fontWeight: '700', cursor: 'pointer'
          }}>
          {showForm ? '✕ Cancel' : '+ Add Employee'}
        </button>
      </div>

      {/* ── Add Form ── */}
      {showForm && (
        <EmployeeForm
          onSubmit={handleAdd}
          editData={null}
          onCancel={() => setShowForm(false)}
        />
      )}

      {stats ? (
        <>
          {/* ── Stat Cards ── */}
          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
            <StatCard title="Total Employees" value={stats.totalEmployees}    icon="👥" color="#0f3460" />
            <StatCard title="Active"           value={stats.activeEmployees}  icon="✅" color="#05c46b" />
            <StatCard title="Inactive"         value={stats.inactiveEmployees}icon="⛔" color="#e94560" />
            <StatCard title="Departments"
              value={Object.keys(stats.departmentCount || {}).length} icon="🏢" color="#533483" />
          </div>

          {/* ── Charts ── */}
          <Charts stats={stats} />

          {/* ── Recent Employees Table ── */}
          <div style={{
            backgroundColor: '#fff', borderRadius: '12px',
            padding: '24px', marginTop: '24px',
            boxShadow: '0 2px 12px rgba(0,0,0,0.08)'
          }}>
            {/* Table header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ fontSize: '16px', fontWeight: '700', color: '#1a1a2e' }}>
                🕐 Recent Employees
              </div>
              <button
                onClick={() => navigate('/employees')}
                style={{
                  backgroundColor: 'transparent', border: '1px solid #e94560',
                  color: '#e94560', padding: '6px 16px', borderRadius: '8px',
                  fontSize: '13px', fontWeight: '700', cursor: 'pointer'
                }}>
                View All →
              </button>
            </div>

            {/* Table */}
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#fafafa' }}>
                  {['Name', 'Department', 'Role', 'Salary', 'Status', 'Action'].map(h => (
                    <th key={h} style={{
                      padding: '12px 16px', textAlign: 'left', fontSize: '12px',
                      fontWeight: '700', color: '#888', textTransform: 'uppercase',
                      borderBottom: '2px solid #f0f2f5'
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {employees.slice(0, 5).map(emp => (
                  <tr key={emp.id}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = '#fafafa'}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = '#fff'}
                    style={{ transition: 'background 0.15s' }}
                  >
                    <td style={{ padding: '14px 16px', borderBottom: '1px solid #f0f2f5' }}>
                      <div style={{ fontWeight: '600', fontSize: '14px' }}>
                        {emp.firstName} {emp.lastName}
                      </div>
                      <div style={{ fontSize: '12px', color: '#aaa' }}>{emp.email}</div>
                    </td>
                    <td style={{ padding: '14px 16px', borderBottom: '1px solid #f0f2f5', fontSize: '14px' }}>
                      {emp.department}
                    </td>
                    <td style={{ padding: '14px 16px', borderBottom: '1px solid #f0f2f5', fontSize: '14px' }}>
                      {emp.role}
                    </td>
                    <td style={{ padding: '14px 16px', borderBottom: '1px solid #f0f2f5', fontSize: '14px' }}>
                      ${Number(emp.salary).toLocaleString()}
                    </td>
                    <td style={{ padding: '14px 16px', borderBottom: '1px solid #f0f2f5' }}>
                      <span style={{
                        padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '700',
                        backgroundColor: emp.status === 'ACTIVE' ? '#e8f8f0' : '#fde8ec',
                        color: emp.status === 'ACTIVE' ? '#05c46b' : '#e94560',
                      }}>{emp.status}</span>
                    </td>
                    <td style={{ padding: '14px 16px', borderBottom: '1px solid #f0f2f5' }}>
                      <button
                        onClick={() => handleDelete(emp.id)}
                        style={{
                          backgroundColor: '#fde8ec', color: '#e94560', border: 'none',
                          padding: '6px 14px', borderRadius: '6px', fontSize: '12px',
                          fontWeight: '700', cursor: 'pointer'
                        }}>
                        🗑 Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {employees.length > 5 && (
              <div style={{ textAlign: 'center', marginTop: '16px', color: '#aaa', fontSize: '13px' }}>
                Showing 5 of {employees.length} employees —
                <span
                  onClick={() => navigate('/employees')}
                  style={{ color: '#e94560', cursor: 'pointer', fontWeight: '700', marginLeft: '4px' }}>
                  View All
                </span>
              </div>
            )}
          </div>
        </>
      ) : (
        <div style={{ textAlign: 'center', padding: '60px', color: '#aaa', fontSize: '18px' }}>
          Loading dashboard...
        </div>
      )}
    </div>
  );
}

export default Dashboard;