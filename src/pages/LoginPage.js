import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../api/employeeApi';
import { useAuth } from '../context/AuthContext';

function LoginPage() {
  const [form, setForm]     = useState({ username: '', password: '' });
  const [error, setError]   = useState('');
  const [loading, setLoading] = useState(false);
  const { login }           = useAuth();
  const navigate            = useNavigate();

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    if (!form.username || !form.password) {
      setError('Please enter username and password.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await loginUser(form);
      login({ username: res.data.username, role: res.data.role }, res.data.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSubmit();
  };

  return (
    <div style={{
      minHeight: '100vh', backgroundColor: '#f0f2f5',
      display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}>
      <div style={{
        backgroundColor: '#fff', borderRadius: '16px',
        padding: '48px 40px', width: '100%', maxWidth: '420px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.10)'
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ fontSize: '48px', marginBottom: '8px' }}>👥</div>
          <div style={{ fontSize: '26px', fontWeight: '800', color: '#1a1a2e' }}>EmpDash</div>
          <div style={{ fontSize: '14px', color: '#aaa', marginTop: '4px' }}>
            Sign in to your account
          </div>
        </div>

        {/* Error */}
        {error && (
          <div style={{
            backgroundColor: '#fde8ec', color: '#e94560',
            padding: '12px 16px', borderRadius: '8px',
            fontSize: '14px', marginBottom: '20px',
            fontWeight: '600', textAlign: 'center'
          }}>
            ⚠️ {error}
          </div>
        )}

        {/* Username */}
        <div style={{ marginBottom: '16px' }}>
          <label style={{ fontSize: '13px', fontWeight: '600', color: '#555', display: 'block', marginBottom: '6px' }}>
            Username
          </label>
          <input
            name="username"
            value={form.username}
            onChange={handle}
            onKeyDown={handleKeyDown}
            placeholder="Enter username"
            style={{
              width: '100%', padding: '12px 16px', borderRadius: '8px',
              border: '1px solid #ddd', fontSize: '14px', outline: 'none',
              boxSizing: 'border-box'
            }}
          />
        </div>

        {/* Password */}
        <div style={{ marginBottom: '24px' }}>
          <label style={{ fontSize: '13px', fontWeight: '600', color: '#555', display: 'block', marginBottom: '6px' }}>
            Password
          </label>
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handle}
            onKeyDown={handleKeyDown}
            placeholder="Enter password"
            style={{
              width: '100%', padding: '12px 16px', borderRadius: '8px',
              border: '1px solid #ddd', fontSize: '14px', outline: 'none',
              boxSizing: 'border-box'
            }}
          />
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            width: '100%', padding: '13px', borderRadius: '8px',
            backgroundColor: loading ? '#ccc' : '#e94560',
            color: '#fff', border: 'none', fontSize: '15px',
            fontWeight: '700', cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'background 0.2s'
          }}
        >
          {loading ? 'Signing in...' : 'Sign In →'}
        </button>

        {/* Hint */}
        <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '13px', color: '#bbb' }}>
          Default: <strong>admin</strong> / <strong>admin123</strong>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;