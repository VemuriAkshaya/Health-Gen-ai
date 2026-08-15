import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  ShieldAlert, 
  BrainCircuit, 
  Hospital, 
  Users, 
  FileCheck, 
  ArrowRight,
  TrendingUp,
  Fingerprint,
  Zap
} from 'lucide-react';

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleGetStarted = () => {
    if (user) {
      navigate('/hospitals');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="home-page container animate-fade-in">
      {/* Hero Section */}
      <section className="hero-section card accented flex-between" style={{ padding: '3rem', margin: '2rem 0' }}>
        <div className="hero-text" style={{ flex: '1', minWidth: '300px' }}>
          <span className="badge badge-primary" style={{ marginBottom: '1rem', gap: '0.4rem' }}>
            <Zap size={14} /> AI-Powered Clinical Diagnostics
          </span>
          <h1 style={{ fontSize: '2.8rem', marginBottom: '1rem', color: 'var(--primary-dark)' }}>
            Elevating Healthcare with <span style={{ color: 'var(--primary-color)' }}>AI Diagnostics</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: '2rem', maxWidth: '500px' }}>
            HealthGen AI assists clinicians with instant symptom synthesis, automated patient report generation, 
            and side-by-side medical history comparisons to optimize patient care and clinical workflows.
          </p>
          <button onClick={handleGetStarted} className="btn btn-primary btn-lg" style={{ fontSize: '1.1rem', padding: '1rem 2rem' }}>
            Get Started <ArrowRight size={20} />
          </button>
        </div>
        
        {/* Healthcare AI Visual SVG */}
        <div className="hero-visual desktop-only" style={{ flex: '1', display: 'flex', justifyContent: 'center' }}>
          <svg width="340" height="340" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="greenGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#064e3b" />
              </linearGradient>
              <linearGradient id="lightGreenGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#d1fae5" />
                <stop offset="100%" stopColor="#6ee7b7" />
              </linearGradient>
            </defs>
            {/* Background glowing circle */}
            <circle cx="100" cy="100" r="70" fill="url(#lightGreenGrad)" opacity="0.25" className="animate-pulse-slow" />
            <circle cx="100" cy="100" r="50" fill="url(#lightGreenGrad)" opacity="0.3" />
            
            {/* Cross/Medical Symbol Grid */}
            <rect x="90" y="70" width="20" height="60" rx="4" fill="url(#greenGrad)" />
            <rect x="70" y="90" width="60" height="20" rx="4" fill="url(#greenGrad)" />
            
            {/* AI Neural Connection lines overlay */}
            <circle cx="100" cy="40" r="6" fill="#047857" />
            <circle cx="40" cy="100" r="6" fill="#047857" />
            <circle cx="160" cy="100" r="6" fill="#047857" />
            <circle cx="100" cy="160" r="6" fill="#047857" />
            
            <path d="M 100 40 L 100 70 M 100 130 L 100 160 M 40 100 L 70 100 M 130 100 L 160 100" stroke="#059669" strokeWidth="2" strokeDasharray="4 2" />
            <path d="M 100 40 L 70 90 M 100 40 L 130 90 M 100 160 L 70 110 M 100 160 L 130 110" stroke="#10b981" strokeWidth="1" strokeDasharray="3 3" />
            
            {/* Inner pulsing diagnostic target */}
            <circle cx="100" cy="100" r="10" fill="#ffffff" stroke="#059669" strokeWidth="3" />
            <circle cx="100" cy="100" r="4" fill="#059669" />
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section" style={{ margin: '4rem 0' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '2.2rem', marginBottom: '0.5rem' }}>Clinical Solutions Suite</h2>
          <p style={{ color: 'var(--text-muted)' }}>Tailored interfaces designed for medical professionals to coordinate clinical intelligence</p>
        </div>
        
        <div className="grid-3">
          <div className="card">
            <div className="feature-icon-wrapper" style={{ display: 'inline-flex', padding: '0.75rem', borderRadius: 'var(--radius-md)', backgroundColor: '#e0f2fe', color: '#0284c7', marginBottom: '1.25rem' }}>
              <Hospital size={28} />
            </div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>Hospital Networks</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
              Search across municipal and specialized facilities. Filter clinics by department expertise, available beds, and emergency contact details.
            </p>
          </div>

          <div className="card">
            <div className="feature-icon-wrapper" style={{ display: 'inline-flex', padding: '0.75rem', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--primary-light)', color: 'var(--primary-color)', marginBottom: '1.25rem' }}>
              <Users size={28} />
            </div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>Patient Management</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
              Store critical details including patient vitals, medications, drug allergies, active symptoms, and historical health complications safely in localStorage.
            </p>
          </div>

          <div className="card">
            <div className="feature-icon-wrapper" style={{ display: 'inline-flex', padding: '0.75rem', borderRadius: 'var(--radius-md)', backgroundColor: '#fef3c7', color: '#d97706', marginBottom: '1.25rem' }}>
              <BrainCircuit size={28} />
            </div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>AI Report Generation</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
              Instantly compile clinical observation logs and customized AI insights based on active histories. Download reports directly or share them dynamically.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works card" style={{ margin: '4rem 0', padding: '3rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '2rem' }}>Workflow Path</h2>
          <p style={{ color: 'var(--text-muted)' }}>Follow this sequence to register cases and compile intelligence reports</p>
        </div>

        <div className="workflow-timeline" style={{ display: 'flex', justifyContent: 'space-between', gap: '2rem', flexWrap: 'wrap' }}>
          <div className="workflow-step" style={{ flex: '1', minWidth: '220px', textAlign: 'center', position: 'relative' }}>
            <div style={{ width: '50px', height: '50px', borderRadius: '50%', backgroundColor: 'var(--primary-light)', color: 'var(--primary-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem auto', fontSize: '1.25rem', fontWeight: 'bold' }}>1</div>
            <h4 style={{ marginBottom: '0.5rem' }}>Search & Select Clinic</h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Navigate the network and authorize clinical access at a specific hospital department.</p>
          </div>
          
          <div className="workflow-step" style={{ flex: '1', minWidth: '220px', textAlign: 'center', position: 'relative' }}>
            <div style={{ width: '50px', height: '50px', borderRadius: '50%', backgroundColor: 'var(--primary-light)', color: 'var(--primary-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem auto', fontSize: '1.25rem', fontWeight: 'bold' }}>2</div>
            <h4 style={{ marginBottom: '0.5rem' }}>Register Patient Vitals</h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Input or select standard biographical data, active symptoms, and patient histories.</p>
          </div>

          <div className="workflow-step" style={{ flex: '1', minWidth: '220px', textAlign: 'center', position: 'relative' }}>
            <div style={{ width: '50px', height: '50px', borderRadius: '50%', backgroundColor: 'var(--primary-light)', color: 'var(--primary-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem auto', fontSize: '1.25rem', fontWeight: 'bold' }}>3</div>
            <h4 style={{ marginBottom: '0.5rem' }}>Generate Diagnostics</h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Execute AI analysis protocols. Wait for clinical processing, and output detailed observations.</p>
          </div>

          <div className="workflow-step" style={{ flex: '1', minWidth: '220px', textAlign: 'center', position: 'relative' }}>
            <div style={{ width: '50px', height: '50px', borderRadius: '50%', backgroundColor: 'var(--primary-light)', color: 'var(--primary-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem auto', fontSize: '1.25rem', fontWeight: 'bold' }}>4</div>
            <h4 style={{ marginBottom: '0.5rem' }}>Track Visit History</h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Log multiple patient consultations, trace symptom developments over time, and view historical report files.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
