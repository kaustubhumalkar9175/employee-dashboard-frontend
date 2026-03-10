import React, { useState, useEffect } from 'react';

function EmployeeForm({ onSubmit, editData, onCancel }) {
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '',
    department: '', role: '', salary: '', joinDate: '', status: 'ACTIVE'
  });

  useEffect(() => {
    if (editData) setForm(editData);
  }, [editData]);

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const inputStyle = {
    width: '100%', padding: '10px 14px', borderRadius: '8px',
    border: '1px solid #ddd', fontSize: '14px', outline: 'none',
  };

  const labelStyle = { fontSize: '13px', fontWeight: '600', color: '#555', marginBottom: '6px', display: 'block' };

  const fieldGroup = (label, name, type = 'text', options = null) => (
    <div style={{ marginBottom: '16px' }}>
      <label style={labelStyle}>{label}</label>
      {options ? (
        <select name={name} value={form[name]} onChange={handle} style={inputStyle}>
          {options.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
      ) : (
        <input type={type} name={name} value={form[name]} onChange={handle} style={inputStyle} />
      )}
    </div>
  );

  return (
    <div style={{
      backgroundColor: '#fff', borderRadius: '12px',
      padding: '28px', boxShadow: '0 2px 12px rgba(0,0,0,0.08)', marginBottom: '24px'
    }}>
      <h3 style={{ marginBottom: '20px', color: '#1a1a2e' }}>
        {editData ? '✏️ Edit Employee' : '➕ Add New Employee'}
      </h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 24px' }}>
        {fieldGroup('First Name', 'firstName')}
        {fieldGroup('Last Name', 'lastName')}
        {fieldGroup('Email', 'email', 'email')}
        {fieldGroup('Department', 'department', 'text',
          ['Engineering', 'Marketing', 'HR', 'Finance', 'Operations'])}
        {fieldGroup('Role', 'role')}
        {fieldGroup('Salary', 'salary', 'number')}
        {fieldGroup('Join Date', 'joinDate', 'date')}
        {fieldGroup('Status', 'status', 'text', ['ACTIVE', 'INACTIVE'])}
      </div>
      <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
        <button onClick={() => onSubmit(form)} style={{
          backgroundColor: '#e94560', color: '#fff', border: 'none',
          padding: '10px 28px', borderRadius: '8px', fontSize: '14px',
          fontWeight: '700', cursor: 'pointer'
        }}>
          {editData ? 'Update' : 'Add Employee'}
        </button>
        <button onClick={onCancel} style={{
          backgroundColor: '#f0f2f5', color: '#333', border: 'none',
          padding: '10px 28px', borderRadius: '8px', fontSize: '14px',
          fontWeight: '700', cursor: 'pointer'
        }}>
          Cancel
        </button>
      </div>
    </div>
  );
}

export default EmployeeForm;