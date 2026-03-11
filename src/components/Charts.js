import React from 'react';
import {
  PieChart, Pie, Cell, Tooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer
} from 'recharts';

const COLORS = ['#e94560', '#0f3460', '#533483', '#05c46b', '#ffd32a', '#ff5e57'];

function Charts({ stats }) {
  if (!stats) return null;

  const deptData = Object.entries(stats.departmentCount || {}).map(([name, value]) => ({
    name, value
  }));

  const salaryData = Object.entries(stats.avgSalaryByDepartment || {}).map(([name, value]) => ({
    name, salary: Math.round(value)
  }));

  const cardStyle = {
    backgroundColor: '#fff',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
    flex: 1,
    minWidth: '300px',
  };

  const titleStyle = {
    fontSize: '16px',
    fontWeight: '700',
    color: '#1a1a2e',
    marginBottom: '20px',
  };

  return (
    <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', marginTop: '24px' }}>

      {/* Pie Chart */}
      <div style={cardStyle}>
        <div style={titleStyle}>👥 Employees by Department</div>
        <ResponsiveContainer width="100%" height={260}>
          <PieChart>
            <Pie data={deptData} cx="50%" cy="50%" outerRadius={90}
              dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
              {deptData.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Bar Chart */}
      <div style={cardStyle}>
        <div style={titleStyle}>💰 Avg Salary by Department</div>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={salaryData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="name" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Avg Salary']} />
            <Bar dataKey="salary" fill="#e94560" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
}

export default Charts;