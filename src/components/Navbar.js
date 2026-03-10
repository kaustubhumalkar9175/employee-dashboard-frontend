import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const location   = useLocation();
  const navigate   = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navStyle = {
    backgroundColor: '#1a1a2e', padding: '0 32px',
    display: 'flex', alignItems: 'center',
    justifyContent: 'space-between', height: '64px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
  };

  const logoStyle = {
    color: '#e94560', fontSize: '22px',
    fontWeight: '800', textDecoration: 'none', letterSpacing: '1px',
  };

  const linkStyle = (path) => ({
    color: location.pathname === path ? '#e94560' : '#ccc',
    textDecoration: 'none', fontSize: '15px', fontWeight: '600',
    marginLeft: '28px', paddingBottom: '4px',
    borderBottom: location.pathname === path ? '2px solid #e94560' : '2px solid transparent',
  });

  return (
    <nav style={navStyle}>
      <span style={logoStyle}>👥 EmpDash</span>

      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Link style={linkStyle('/')} to="/">Dashboard</Link>
        <Link style={linkStyle('/employees')} to="/employees">Employees</Link>

        {/* User info + logout */}
        {user && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginLeft: '32px' }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              backgroundColor: '#0f3460', padding: '6px 14px',
              borderRadius: '20px'
            }}>
              <span style={{ fontSize: '16px' }}>👤</span>
              <span style={{ color: '#fff', fontSize: '13px', fontWeight: '600' }}>
                {user.username}
              </span>
              <span style={{
                backgroundColor: '#e94560', color: '#fff',
                fontSize: '10px', fontWeight: '700',
                padding: '2px 8px', borderRadius: '10px'
              }}>
                {user.role}
              </span>
            </div>

            <button
              onClick={handleLogout}
              style={{
                backgroundColor: 'transparent', border: '1px solid #555',
                color: '#ccc', padding: '6px 16px', borderRadius: '8px',
                fontSize: '13px', fontWeight: '600', cursor: 'pointer'
              }}
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;