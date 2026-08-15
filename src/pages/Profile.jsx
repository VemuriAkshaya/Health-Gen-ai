import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Shield, CheckCircle, LogOut, Edit3, X } from 'lucide-react';

const Profile = () => {
  const { user, updateProfile, logout } = useAuth();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [role, setRole] = useState(user?.role || '');
  
  const [feedback, setFeedback] = useState('');

  const handleSave = (e) => {
    e.preventDefault();
    const res = updateProfile({ name, email, role });
    if (res.success) {
      setFeedback('Successfully saved profile updates.');
      setIsEditing(false);
      
      setTimeout(() => {
        setFeedback('');
      }, 3000);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="profile-page container animate-fade-in" style={{ padding: '3rem 0', maxWidth: '600px' }}>
      
      <div style={{ marginBottom: '2.5rem', textAlign: 'center' }}>
        <span className="badge badge-primary" style={{ marginBottom: '0.75rem' }}>Account Settings</span>
        <h2 style={{ fontSize: '2.2rem', marginBottom: '0.5rem' }}>Clinician Profile</h2>
        <p style={{ color: 'var(--text-muted)' }}>Manage account details, edit clinical parameters, or end session</p>
      </div>

      {feedback && (
        <div style={{ display: 'flex', gap: '0.5rem', backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', color: 'var(--primary-color)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', fontSize: '0.9rem', fontWeight: '600', alignItems: 'center' }}>
          <CheckCircle size={18} />
          <span>{feedback}</span>
        </div>
      )}

      <div className="card">
        {/* Header Avatar card */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1.5rem' }}>
          <div style={{ fontSize: '3rem', width: '80px', height: '80px', borderRadius: '50%', backgroundColor: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {user?.avatar || '🩺'}
          </div>
          <div>
            <h3 style={{ fontSize: '1.5rem', color: 'var(--primary-dark)', marginBottom: '0.25rem' }}>{user?.name}</h3>
            <span className="badge badge-primary" style={{ fontSize: '0.8rem' }}>{user?.role}</span>
          </div>
        </div>

        {!isEditing ? (
          /* Profile Details Read-Only */
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.5rem 0' }}>
              <User size={20} style={{ color: 'var(--text-light)' }} />
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '600' }}>FULL NAME</div>
                <div style={{ fontSize: '1rem', fontWeight: 'bold' }}>{user?.name}</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.5rem 0' }}>
              <Mail size={20} style={{ color: 'var(--text-light)' }} />
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '600' }}>EMAIL ADDRESS</div>
                <div style={{ fontSize: '1rem', fontWeight: 'bold' }}>{user?.email}</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.5rem 0' }}>
              <Shield size={20} style={{ color: 'var(--text-light)' }} />
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '600' }}>CLINICAL ACCESS LEVEL</div>
                <div style={{ fontSize: '1rem', fontWeight: 'bold' }}>{user?.role}</div>
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '0.75rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem', marginTop: '1.5rem' }}>
              <button 
                onClick={() => setIsEditing(true)} 
                className="btn btn-primary"
                style={{ gap: '0.4rem', flex: '1' }}
              >
                <Edit3 size={16} /> Edit Profile
              </button>
              <button 
                onClick={handleLogout} 
                className="btn btn-outline"
                style={{ gap: '0.4rem', color: 'var(--danger-color)', borderColor: 'var(--danger-color)' }}
              >
                <LogOut size={16} /> Logout
              </button>
            </div>
          </div>
        ) : (
          /* Profile Details Editor */
          <form onSubmit={handleSave}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input 
                type="text" 
                className="form-input" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                required 
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input 
                type="email" 
                className="form-input" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
              />
            </div>

            <div className="form-group">
              <label className="form-label">Clinical Role</label>
              <select 
                className="form-select" 
                value={role} 
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="Chief Medical Officer">Chief Medical Officer</option>
                <option value="Senior Diagnostician">Senior Diagnostician</option>
                <option value="Attending Physician">Attending Physician</option>
                <option value="Clinical Resident">Clinical Resident</option>
              </select>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '0.75rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem', marginTop: '1.5rem' }}>
              <button 
                type="button" 
                onClick={() => { setIsEditing(false); setName(user?.name); setEmail(user?.email); setRole(user?.role); }} 
                className="btn btn-outline"
                style={{ gap: '0.4rem' }}
              >
                <X size={16} /> Cancel
              </button>
              <button 
                type="submit" 
                className="btn btn-primary"
                style={{ gap: '0.4rem', flex: '1' }}
              >
                Save Updates
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};

export default Profile;
