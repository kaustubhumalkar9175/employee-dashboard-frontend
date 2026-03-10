import React from 'react';

function StatCard({ title, value, icon, color }) {
  return (
    <div style={{
      backgroundColor: '#fff',
      borderRadius: '12px',
      padding: '24px',
      flex: '1',
      minWidth: '200px',
      boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
      borderLeft: `5px solid ${color}`,
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
    }}>
      <div style={{
        fontSize: '36px',
        backgroundColor: `${color}20`,
        borderRadius: '50%',
        width: '60px',
        height: '60px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        {icon}
      </div>
      <div>
        <div style={{ fontSize: '13px', color: '#888', fontWeight: '600', textTransform: 'uppercase' }}>
          {title}
        </div>
        <div style={{ fontSize: '32px', fontWeight: '800', color: '#1a1a2e' }}>
          {value}
        </div>
      </div>
    </div>
  );
}

export default StatCard;