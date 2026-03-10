
import PhotoUpload from '../components/PhotoUpload';
import React, { useEffect, useState, useRef } from 'react';
import EmployeeTable from '../components/EmployeeTable';
import EmployeeForm from '../components/EmployeeForm';
import Pagination from '../components/Pagination';
import { exportToCSV, exportToExcel } from '../utils/exportUtils';
import {
    getAllEmployees, createEmployee, updateEmployee, deleteEmployee
} from '../api/employeeApi';

const DEPARTMENTS = ['Engineering', 'Marketing', 'HR', 'Finance', 'Operations'];

function EmployeesPage() {
    const [employees, setEmployees] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editData, setEditData] = useState(null);
    const [search, setSearch] = useState('');
    const [selectedDepts, setSelectedDepts] = useState([]);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    // ✅ Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);

    const load = () =>
        getAllEmployees().then(r => {
            setEmployees(r.data);
            setFiltered(r.data);
        });

    useEffect(() => { load(); }, []);

    useEffect(() => {
        const handler = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target))
                setDropdownOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    // Reset to page 1 whenever filters change
    const applyFilters = (allEmps, searchVal, depts) => {
        let result = allEmps;
        if (depts.length > 0)
            result = result.filter(e => depts.includes(e.department));
        if (searchVal.trim() !== '')
            result = result.filter(e =>
                e.firstName.toLowerCase().includes(searchVal.toLowerCase()) ||
                e.lastName.toLowerCase().includes(searchVal.toLowerCase())
            );
        setFiltered(result);
        setCurrentPage(1); // ✅ always reset to page 1 on filter
    };

    const handleSearch = (e) => {
        const val = e.target.value;
        setSearch(val);
        applyFilters(employees, val, selectedDepts);
    };

    const toggleDept = (dept) => {
        const updated = selectedDepts.includes(dept)
            ? selectedDepts.filter(d => d !== dept)
            : [...selectedDepts, dept];
        setSelectedDepts(updated);
        applyFilters(employees, search, updated);
    };

    const clearDepts = () => {
        setSelectedDepts([]);
        applyFilters(employees, search, []);
    };

    // ✅ Pagination slice
    const totalPages = Math.ceil(filtered.length / itemsPerPage);
    const paginated = filtered.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handleSubmit = async (form) => {
        if (editData) await updateEmployee(editData.id, form);
        else await createEmployee(form);
        setShowForm(false);
        setEditData(null);
        load();
    };

    const handleEdit = (emp) => {
        setEditData(emp);
        setShowForm(true);
        window.scrollTo(0, 0);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this employee?')) {
            await deleteEmployee(id);
            load();
        }
    };

    const handleItemsPerPageChange = (n) => {
        setItemsPerPage(n);
        setCurrentPage(1);
    };

    return (
        <div className="page">
            <div className="page-title">👥 Employee Management</div>

            {/* ── Toolbar ── */}
            <div style={{
                display: 'flex', justifyContent: 'space-between',
                marginBottom: '16px', flexWrap: 'wrap', gap: '12px'
            }}>

                {/* Left: Search + Dropdown */}
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
                    <input
                        type="text"
                        placeholder="🔍 Search by name..."
                        value={search}
                        onChange={handleSearch}
                        style={{
                            padding: '10px 16px', borderRadius: '8px',
                            border: '1px solid #ddd', fontSize: '14px',
                            width: '220px', outline: 'none'
                        }}
                    />

                    {/* Multi-select Dropdown */}
                    <div ref={dropdownRef} style={{ position: 'relative' }}>
                        <button
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                            style={{
                                padding: '10px 16px', borderRadius: '8px',
                                border: '1px solid #ddd', fontSize: '14px',
                                backgroundColor: '#fff', cursor: 'pointer',
                                minWidth: '200px', textAlign: 'left',
                                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                color: selectedDepts.length > 0 ? '#1a1a2e' : '#888'
                            }}
                        >
                            <span>🏢 {selectedDepts.length === 0 ? 'All Departments' : `${selectedDepts.length} selected`}</span>
                            <span>{dropdownOpen ? '▲' : '▼'}</span>
                        </button>

                        {dropdownOpen && (
                            <div style={{
                                position: 'absolute', top: '46px', left: 0,
                                backgroundColor: '#fff', borderRadius: '10px',
                                boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                                zIndex: 100, minWidth: '220px',
                                border: '1px solid #eee', overflow: 'hidden'
                            }}>
                                <div style={{
                                    padding: '10px 16px', borderBottom: '1px solid #f0f0f0',
                                    display: 'flex', justifyContent: 'space-between'
                                }}>
                                    <span onClick={() => { setSelectedDepts([...DEPARTMENTS]); applyFilters(employees, search, [...DEPARTMENTS]); }}
                                        style={{ fontSize: '13px', color: '#0f3460', cursor: 'pointer', fontWeight: '700' }}>
                                        Select All
                                    </span>
                                    <span onClick={clearDepts}
                                        style={{ fontSize: '13px', color: '#e94560', cursor: 'pointer', fontWeight: '700' }}>
                                        Clear
                                    </span>
                                </div>

                                {DEPARTMENTS.map(dept => {
                                    const isSelected = selectedDepts.includes(dept);
                                    return (
                                        <div key={dept} onClick={() => toggleDept(dept)}
                                            style={{
                                                padding: '11px 16px', cursor: 'pointer', fontSize: '14px',
                                                display: 'flex', alignItems: 'center', gap: '10px',
                                                backgroundColor: isSelected ? '#fff5f7' : '#fff',
                                                color: isSelected ? '#e94560' : '#333',
                                            }}
                                            onMouseEnter={e => e.currentTarget.style.backgroundColor = isSelected ? '#fff0f3' : '#f9f9f9'}
                                            onMouseLeave={e => e.currentTarget.style.backgroundColor = isSelected ? '#fff5f7' : '#fff'}
                                        >
                                            <div style={{
                                                width: '18px', height: '18px', borderRadius: '4px',
                                                border: `2px solid ${isSelected ? '#e94560' : '#ccc'}`,
                                                backgroundColor: isSelected ? '#e94560' : '#fff',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                                            }}>
                                                {isSelected && <span style={{ color: '#fff', fontSize: '11px', fontWeight: '900' }}>✓</span>}
                                            </div>
                                            {dept}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right: count + export + add */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '14px', color: '#888' }}>
                        Showing <strong>{filtered.length}</strong> of <strong>{employees.length}</strong>
                    </span>
                    <button onClick={() => exportToCSV(filtered, 'employees')}
                        style={{
                            backgroundColor: '#05c46b', color: '#fff', border: 'none',
                            padding: '10px 18px', borderRadius: '8px', fontSize: '14px',
                            fontWeight: '700', cursor: 'pointer'
                        }}>📄 CSV</button>
                    <button onClick={() => exportToExcel(filtered, 'employees')}
                        style={{
                            backgroundColor: '#0f3460', color: '#fff', border: 'none',
                            padding: '10px 18px', borderRadius: '8px', fontSize: '14px',
                            fontWeight: '700', cursor: 'pointer'
                        }}>📊 Excel</button>
                    <button onClick={() => { setShowForm(!showForm); setEditData(null); }}
                        style={{
                            backgroundColor: '#e94560', color: '#fff', border: 'none',
                            padding: '10px 24px', borderRadius: '8px', fontSize: '14px',
                            fontWeight: '700', cursor: 'pointer'
                        }}>
                        {showForm ? '✕ Close Form' : '+ Add Employee'}
                    </button>
                </div>
            </div>

            {/* Active filter badges */}
            {selectedDepts.length > 0 && (
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
                    {selectedDepts.map(dept => (
                        <div key={dept} style={{
                            display: 'flex', alignItems: 'center', gap: '6px',
                            backgroundColor: '#e94560', color: '#fff',
                            padding: '5px 12px', borderRadius: '20px', fontSize: '13px', fontWeight: '600'
                        }}>
                            {dept}
                            <span onClick={() => toggleDept(dept)}
                                style={{ cursor: 'pointer', fontWeight: '900', fontSize: '14px' }}>✕</span>
                        </div>
                    ))}
                    <div onClick={clearDepts} style={{
                        display: 'flex', alignItems: 'center', padding: '5px 12px',
                        borderRadius: '20px', fontSize: '13px', fontWeight: '600',
                        border: '1px solid #ccc', cursor: 'pointer', color: '#666'
                    }}>Clear all</div>
                </div>
            )}

            {/* Photo upload - only shows when editing */}
            {showForm && editData && (
                <div style={{
                    backgroundColor: '#fff', borderRadius: '12px',
                    padding: '20px 28px', marginBottom: '16px',
                    boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
                    display: 'flex', alignItems: 'center', gap: '24px'
                }}>
                    <PhotoUpload
                        employee={editData}
                        onPhotoUpdated={(updated) => {
                            setEditData(updated);
                            load();
                        }}
                    />
                    <div>
                        <div style={{ fontWeight: '700', fontSize: '16px', color: '#1a1a2e' }}>
                            {editData.firstName} {editData.lastName}
                        </div>
                        <div style={{ fontSize: '13px', color: '#aaa', marginTop: '4px' }}>
                            Click the photo to upload or change profile picture
                        </div>
                        <div style={{ fontSize: '12px', color: '#bbb', marginTop: '4px' }}>
                            Supported: JPG, PNG, GIF · Max 5MB
                        </div>
                    </div>
                </div>
            )}

            {/* Form */}
            {showForm && (
                <EmployeeForm
                    onSubmit={handleSubmit}
                    editData={editData}
                    onCancel={() => { setShowForm(false); setEditData(null); }}
                />
            )}

            {/* Table */}
            <EmployeeTable
                employees={paginated}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />

            {/* ✅ Pagination */}
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={filtered.length}
                itemsPerPage={itemsPerPage}
                onPageChange={setCurrentPage}
                onItemsPerPageChange={handleItemsPerPageChange}
            />
        </div>
    );
}

export default EmployeesPage;