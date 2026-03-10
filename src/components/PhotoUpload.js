import React, { useState, useRef } from 'react';
import { uploadPhoto } from '../api/employeeApi';

const PHOTO_URL = 'http://localhost:8080/api/employees/photo/';

export const getPhotoUrl = (photo) =>
  photo ? `${PHOTO_URL}${photo}` : null;

function PhotoUpload({ employee, onPhotoUpdated }) {
  const [uploading, setUploading] = useState(false);
  const [hover, setHover]         = useState(false);
  const inputRef                  = useRef();

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file.');
      return;
    }

    // Validate size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File too large. Max size is 5MB.');
      return;
    }

    setUploading(true);
    try {
      const res = await uploadPhoto(employee.id, file);
      onPhotoUpdated(res.data);
    } catch (err) {
      alert('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const photoUrl = getPhotoUrl(employee.photo);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
      {/* Photo circle */}
      <div
        onClick={() => !uploading && inputRef.current.click()}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{
          width: '90px', height: '90px', borderRadius: '50%',
          overflow: 'hidden', cursor: 'pointer', position: 'relative',
          border: '3px solid #e94560',
          backgroundColor: '#f0f2f5',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        {photoUrl ? (
          <img
            src={photoUrl}
            alt="profile"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <span style={{ fontSize: '32px' }}>👤</span>
        )}

        {/* Hover overlay */}
        {hover && !uploading && (
          <div style={{
            position: 'absolute', inset: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex', alignItems: 'center',
            justifyContent: 'center', flexDirection: 'column',
            gap: '4px'
          }}>
            <span style={{ fontSize: '20px' }}>📷</span>
            <span style={{ color: '#fff', fontSize: '10px', fontWeight: '700' }}>
              {photoUrl ? 'Change' : 'Upload'}
            </span>
          </div>
        )}

        {/* Uploading spinner */}
        {uploading && (
          <div style={{
            position: 'absolute', inset: 0,
            backgroundColor: 'rgba(255,255,255,0.8)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <div style={{
              width: '24px', height: '24px', borderRadius: '50%',
              border: '3px solid #e94560',
              borderTopColor: 'transparent',
              animation: 'spin 0.8s linear infinite'
            }} />
          </div>
        )}
      </div>

      <span style={{ fontSize: '11px', color: '#aaa' }}>Click to upload photo</span>

      {/* Hidden file input */}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />

      {/* Spinner keyframe */}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

export default PhotoUpload;