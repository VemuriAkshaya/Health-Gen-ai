import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Activity, Mail, Lock, User, ShieldAlert, CheckCircle } from 'lucide-react';

const Login = () => {
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  
  // Login fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Register fields
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Feedback
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const res = login(email, password);
    if (res.success) {
      navigate('/home');
    } else {
      setError(res.message);
    }
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (password !== confirmPassword) {
      setError('Passwords do not match. Please verify.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    const res = register(name, email, password);
    if (res.success) {
      setSuccess('Account created successfully! Redirecting...');
      setTimeout(() => {
        navigate('/home');
      }, 1500);
    } else {
      setError(res.message);
    }
  };

  const fillDemoCredentials = () => {
    setEmail('doctor@healthgen.ai');
    setPassword('password123');
  };

  const toggleMode = () => {
    setIsRegisterMode(!isRegisterMode);
    setError('');
    setSuccess('');
    // Clear fields
    setEmail('');
    setPassword('');
    setName('');
    setConfirmPassword('');
  };

  return (
    <div className="login-page flex-center" style={{ minHeight: '80vh', padding: '2rem 1rem' }}>
      <div className="card animate-fade-in" style={{ width: '100%', maxWidth: '460px', padding: '2.5rem' }}>
        
        {/* Header Title */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ display: 'inline-flex', padding: '0.75rem', borderRadius: '50%', backgroundColor: 'var(--primary-light)', color: 'var(--primary-color)', marginBottom: '1rem' }}>
            <Activity size={32} />
          </div>
          <h2 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>
            {isRegisterMode ? 'Register Account' : 'Authorized Portal'}
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            {isRegisterMode ? 'Create your HealthGen clinician account' : 'Sign in to access AI clinical tools'}
          </p>
        </div>

        {/* Error notification */}
        {error && (
          <div style={{ display: 'flex', gap: '0.5rem', backgroundColor: 'var(--danger-light)', border: '1px solid #fee2e2', color: 'var(--danger-color)', padding: '0.75rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', fontSize: '0.875rem', alignItems: 'center' }}>
            <ShieldAlert size={18} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        {/* Success notification */}
        {success && (
          <div style={{ display: 'flex', gap: '0.5rem', backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', color: 'var(--primary-color)', padding: '0.75rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', fontSize: '0.875rem', alignItems: 'center' }}>
            <CheckCircle size={18} style={{ flexShrink: 0 }} />
            <span>{success}</span>
          </div>
        )}

        {/* Form Selector */}
        {!isRegisterMode ? (
          /* Login Form */
          <form onSubmit={handleLoginSubmit}>
            <div className="form-group">
              <label className="form-label">Clinical Email</label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
                <input 
                  type="email" 
                  className="form-input" 
                  style={{ paddingLeft: '40px' }}
                  placeholder="doctor@healthgen.ai" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
                <input 
                  type="password" 
                  className="form-input" 
                  style={{ paddingLeft: '40px' }}
                  placeholder="••••••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.85rem', fontSize: '1rem', marginTop: '0.5rem' }}>
              Sign In
            </button>
          </form>
        ) : (
          /* Create Account Form */
          <form onSubmit={handleRegisterSubmit}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <div style={{ position: 'relative' }}>
                <User size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
                <input 
                  type="text" 
                  className="form-input" 
                  style={{ paddingLeft: '40px' }}
                  placeholder="Dr. John Watson" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Clinical Email</label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
                <input 
                  type="email" 
                  className="form-input" 
                  style={{ paddingLeft: '40px' }}
                  placeholder="doctor@healthgen.ai" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group font-semibold">
              <label className="form-label">Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
                <input 
                  type="password" 
                  className="form-input" 
                  style={{ paddingLeft: '40px' }}
                  placeholder="At least 6 characters" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
                <input 
                  type="password" 
                  className="form-input" 
                  style={{ paddingLeft: '40px' }}
                  placeholder="Re-enter password" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.85rem', fontSize: '1rem', marginTop: '0.5rem' }}>
              Create Account
            </button>
          </form>
        )}

        {/* Toggle Mode Text */}
        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem' }}>
          {isRegisterMode ? (
            <p>
              Already have an account?{' '}
              <button onClick={toggleMode} className="btn-link" style={{ background: 'none', border: 'none', color: 'var(--primary-color)', fontWeight: 'bold', cursor: 'pointer', textDecoration: 'underline' }}>
                Login here
              </button>
            </p>
          ) : (
            <p>
              Don't have an account?{' '}
              <button onClick={toggleMode} className="btn-link" style={{ background: 'none', border: 'none', color: 'var(--primary-color)', fontWeight: 'bold', cursor: 'pointer', textDecoration: 'underline' }}>
                Create Account
              </button>
            </p>
          )}
        </div>

        {/* Demo Credentials Auto-Fill Panel (Only in Login Mode) */}
        {!isRegisterMode && (
          <div style={{ marginTop: '2rem', padding: '1rem', border: '1px dashed var(--primary-color)', borderRadius: 'var(--radius-md)', backgroundColor: '#f0fdf4', textAlign: 'center' }}>
            <p style={{ fontSize: '0.85rem', color: 'var(--primary-dark)', fontWeight: '600', marginBottom: '0.5rem' }}>
              Seed Clinician Account (Available by default)
            </p>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
              <div>Email: <code style={{ backgroundColor: '#e2e8f0', padding: '0.1rem 0.3rem', borderRadius: '4px' }}>doctor@healthgen.ai</code></div>
              <div style={{ marginTop: '0.2rem' }}>Password: <code style={{ backgroundColor: '#e2e8f0', padding: '0.1rem 0.3rem', borderRadius: '4px' }}>password123</code></div>
            </div>
            <button 
              type="button" 
              onClick={fillDemoCredentials} 
              className="btn btn-outline" 
              style={{ width: '100%', fontSize: '0.8rem', padding: '0.5rem' }}
            >
              Auto-fill Credentials
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
