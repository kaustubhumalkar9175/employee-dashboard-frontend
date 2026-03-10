import React, { useState } from 'react';
import { getPhotoUrl } from './PhotoUpload';

function EmployeeTable({ employees, onEdit, onDelete }) {
    const [sortKey, setSortKey] = useState(null);
    const [sortOrder, setSortOrder] = useState('asc'); // 'asc' or 'desc'

    // ── Sort logic ──
    const handleSort = (key) => {
        if (sortKey === key) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortKey(key);
            setSortOrder('asc');
        }
    };

    const sorted = [...employees].sort((a, b) => {
        if (!sortKey) return 0;

        let valA = a[sortKey] ?? '';
        let valB = b[sortKey] ?? '';

        // Numeric sort for salary
        if (sortKey === 'salary') {
            return sortOrder === 'asc'
                ? Number(valA) - Number(valB)
                : Number(valB) - Number(valA);
        }

        // String sort for everything else
        valA = String(valA).toLowerCase();
        valB = String(valB).toLowerCase();
        if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
        if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
        return 0;
    });

    // ── Column definitions ──
    const columns = [
        { label: 'Name', key: 'firstName' },
        { label: 'Email', key: 'email' },
        { label: 'Department', key: 'department' },
        { label: 'Role', key: 'role' },
        { label: 'Salary', key: 'salary' },
        { label: 'Status', key: 'status' },
        { label: 'Actions', key: null }, // not sortable
    ];

    const thStyle = (key) => ({
        padding: '12px 16px',
        textAlign: 'left',
        fontSize: '12px',
        fontWeight: '700',
        color: sortKey === key ? '#e94560' : '#888',
        textTransform: 'uppercase',
        borderBottom: '2px solid #f0f2f5',
        cursor: key ? 'pointer' : 'default',
        userSelect: 'none',
        whiteSpace: 'nowrap',
        transition: 'color 0.15s',
        backgroundColor: sortKey === key ? '#fff5f7' : 'transparent',
    });

    const tdStyle = {
        padding: '14px 16px',
        fontSize: '14px',
        borderBottom: '1px solid #f0f2f5',
        color: '#333',
    };

    // Sort icon
    const SortIcon = ({ colKey }) => {
        if (sortKey !== colKey) return <span style={{ color: '#ccc', marginLeft: '6px' }}>↕</span>;
        return (
            <span style={{ color: '#e94560', marginLeft: '6px', fontWeight: '900' }}>
                {sortOrder === 'asc' ? '↑' : '↓'}
            </span>
        );
    };

    const badgeStyle = (status) => ({
        padding: '4px 12px', borderRadius: '20px',
        fontSize: '12px', fontWeight: '700',
        backgroundColor: status === 'ACTIVE' ? '#e8f8f0' : '#fde8ec',
        color: status === 'ACTIVE' ? '#05c46b' : '#e94560',
    });

    if (employees.length === 0) {
        return (
            <div style={{ textAlign: 'center', padding: '48px', color: '#aaa', fontSize: '16px' }}>
                No employees found.
            </div>
        );
    }

    return (
        <div style={{
            backgroundColor: '#fff', borderRadius: '12px',
            boxShadow: '0 2px 12px rgba(0,0,0,0.08)', overflow: 'hidden'
        }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>

                {/* ── Header ── */}
                <thead style={{ backgroundColor: '#fafafa' }}>
                    <tr>
                        {columns.map(col => (
                            <th
                                key={col.label}
                                style={thStyle(col.key)}
                                onClick={() => col.key && handleSort(col.key)}
                                onMouseEnter={e => { if (col.key) e.currentTarget.style.backgroundColor = '#fff0f3'; }}
                                onMouseLeave={e => { e.currentTarget.style.backgroundColor = sortKey === col.key ? '#fff5f7' : 'transparent'; }}
                            >
                                {col.label}
                                {col.key && <SortIcon colKey={col.key} />}
                            </th>
                        ))}
                    </tr>
                </thead>

                {/* ── Body ── */}
                <tbody>
                    {sorted.map(emp => (
                        <tr
                            key={emp.id}
                            style={{ transition: 'background 0.15s' }}
                            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#fafafa'}
                            onMouseLeave={e => e.currentTarget.style.backgroundColor = '#fff'}
                        >
                            {/* Name + Avatar */}
                            <td style={tdStyle}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div style={{
                                        width: '40px', height: '40px', borderRadius: '50%',
                                        overflow: 'hidden', flexShrink: 0,
                                        backgroundColor: '#f0f2f5',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        border: '2px solid #eee'
                                    }}>
                                        {emp.photo ? (
                                            <img
                                                src={getPhotoUrl(emp.photo)}
                                                alt="avatar"
                                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                            />
                                        ) : (
                                            <span style={{ fontSize: '18px' }}>👤</span>
                                        )}
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: '600' }}>{emp.firstName} {emp.lastName}</div>
                                        <div style={{ fontSize: '12px', color: '#aaa' }}>{emp.email}</div>
                                    </div>
                                </div>
                            </td>

                            {/* Email */}
                            <td style={tdStyle}>{emp.email}</td>

                            {/* Department */}
                            <td style={tdStyle}>{emp.department}</td>

                            {/* Role */}
                            <td style={tdStyle}>{emp.role}</td>

                            {/* Salary */}
                            <td style={tdStyle}>${Number(emp.salary).toLocaleString()}</td>

                            {/* Status */}
                            <td style={tdStyle}>
                                <span style={badgeStyle(emp.status)}>{emp.status}</span>
                            </td>

                            {/* Actions */}
                            <td style={tdStyle}>
                                <button onClick={() => onEdit(emp)} style={{
                                    backgroundColor: '#0f3460', color: '#fff', border: 'none',
                                    padding: '6px 14px', borderRadius: '6px', fontSize: '12px',
                                    fontWeight: '600', cursor: 'pointer', marginRight: '8px'
                                }}>Edit</button>
                                <button onClick={() => onDelete(emp.id)} style={{
                                    backgroundColor: '#e94560', color: '#fff', border: 'none',
                                    padding: '6px 14px', borderRadius: '6px', fontSize: '12px',
                                    fontWeight: '600', cursor: 'pointer'
                                }}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default EmployeeTable;