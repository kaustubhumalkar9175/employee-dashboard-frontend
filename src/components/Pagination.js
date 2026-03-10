import React from 'react';

function Pagination({ currentPage, totalPages, onPageChange, totalItems, itemsPerPage, onItemsPerPageChange }) {

  const pages = [];
  for (let i = 1; i <= totalPages; i++) pages.push(i);

  // Show max 5 page buttons at a time
  const getVisiblePages = () => {
    if (totalPages <= 5) return pages;
    if (currentPage <= 3) return pages.slice(0, 5);
    if (currentPage >= totalPages - 2) return pages.slice(totalPages - 5);
    return pages.slice(currentPage - 3, currentPage + 2);
  };

  const visiblePages = getVisiblePages();

  const btnBase = {
    border: 'none', borderRadius: '8px', width: '38px', height: '38px',
    fontSize: '14px', cursor: 'pointer', fontWeight: '600',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    transition: 'all 0.15s',
  };

  const activeBtn = { ...btnBase, backgroundColor: '#e94560', color: '#fff' };
  const inactiveBtn = { ...btnBase, backgroundColor: '#fff', color: '#333', border: '1px solid #ddd' };
  const disabledBtn = { ...btnBase, backgroundColor: '#f5f5f5', color: '#ccc', cursor: 'not-allowed' };

  const start = (currentPage - 1) * itemsPerPage + 1;
  const end   = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      marginTop: '20px', flexWrap: 'wrap', gap: '12px'
    }}>

      {/* Left: showing info + rows per page */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <span style={{ fontSize: '14px', color: '#888' }}>
          Showing <strong>{totalItems === 0 ? 0 : start}</strong> – <strong>{end}</strong> of <strong>{totalItems}</strong> employees
        </span>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '13px', color: '#888' }}>Rows per page:</span>
          <select
            value={itemsPerPage}
            onChange={e => onItemsPerPageChange(Number(e.target.value))}
            style={{
              padding: '6px 10px', borderRadius: '8px', border: '1px solid #ddd',
              fontSize: '13px', outline: 'none', cursor: 'pointer'
            }}
          >
            {[5, 10, 20, 50].map(n => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Right: page buttons */}
      <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>

        {/* First */}
        <button
          style={currentPage === 1 ? disabledBtn : inactiveBtn}
          onClick={() => currentPage > 1 && onPageChange(1)}
          title="First page"
        >«</button>

        {/* Prev */}
        <button
          style={currentPage === 1 ? disabledBtn : inactiveBtn}
          onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
          title="Previous page"
        >‹</button>

        {/* First page + ellipsis */}
        {visiblePages[0] > 1 && (
          <>
            <button style={inactiveBtn} onClick={() => onPageChange(1)}>1</button>
            {visiblePages[0] > 2 && (
              <span style={{ padding: '0 4px', color: '#aaa' }}>…</span>
            )}
          </>
        )}

        {/* Page numbers */}
        {visiblePages.map(p => (
          <button
            key={p}
            style={p === currentPage ? activeBtn : inactiveBtn}
            onClick={() => onPageChange(p)}
          >{p}</button>
        ))}

        {/* Last page + ellipsis */}
        {visiblePages[visiblePages.length - 1] < totalPages && (
          <>
            {visiblePages[visiblePages.length - 1] < totalPages - 1 && (
              <span style={{ padding: '0 4px', color: '#aaa' }}>…</span>
            )}
            <button style={inactiveBtn} onClick={() => onPageChange(totalPages)}>
              {totalPages}
            </button>
          </>
        )}

        {/* Next */}
        <button
          style={currentPage === totalPages ? disabledBtn : inactiveBtn}
          onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
          title="Next page"
        >›</button>

        {/* Last */}
        <button
          style={currentPage === totalPages ? disabledBtn : inactiveBtn}
          onClick={() => currentPage < totalPages && onPageChange(totalPages)}
          title="Last page"
        >»</button>

      </div>
    </div>
  );
}

export default Pagination;