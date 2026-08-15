import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { usePatient } from '../context/PatientContext';
import { useHospital } from '../context/HospitalContext';
import { useAuth } from '../context/AuthContext';
import { 
  Users, 
  FileText, 
  Bookmark, 
  Hospital as HospIcon,
  PlusCircle, 
  ArrowRight, 
  FolderHeart, 
  MessageSquare, 
  Eye, 
  Trash2,
  AlertCircle
} from 'lucide-react';

const Dashboard = () => {
  const { patients, reports, deleteReport } = usePatient();
  const { selectedHospital } = useHospital();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Metrics
  const totalPatients = patients.length;
  const savedReportsCount = reports.length;
  // Generated Reports counter can be savedReportsCount + a static mock value to make it look like a busy clinic
  const generatedReportsCount = savedReportsCount > 0 ? savedReportsCount + 5 : 12;

  const handleQuickAction = (route) => {
    navigate(route);
  };

  const getRecentReports = () => {
    return reports.slice(0, 5); // get top 5
  };

  return (
    <div className="dashboard-page container animate-fade-in" style={{ padding: '2rem 0' }}>
      
      {/* Top Banner with Active Hospital Notification */}
      <div className="card accented" style={{ padding: '1.5rem', marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>Welcome back, {user?.name || 'Doctor'}</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Current Role: <span className="badge badge-primary">{user?.role || 'Clinician'}</span></p>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', backgroundColor: selectedHospital ? '#f0fdf4' : '#fffbeb', border: selectedHospital ? '1px solid #bbf7d0' : '1px solid #fef3c7' }}>
          <HospIcon size={24} style={{ color: selectedHospital ? 'var(--primary-color)' : 'var(--warning-color)' }} />
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '600' }}>ACTIVE ADMISSION FACILITY</div>
            <div style={{ fontSize: '0.95rem', fontWeight: 'bold', color: selectedHospital ? 'var(--primary-dark)' : '#b45309' }}>
              {selectedHospital ? selectedHospital.name : 'No active hospital selected'}
            </div>
          </div>
          {!selectedHospital && (
            <Link to="/hospitals" className="btn btn-primary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', marginLeft: '0.5rem' }}>
              Choose Clinic
            </Link>
          )}
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid-3" style={{ marginBottom: '2.5rem' }}>
        <div className="card flex-between" style={{ padding: '1.5rem 2rem' }}>
          <div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: '600' }}>TOTAL PATIENTS</div>
            <h3 style={{ fontSize: '2.25rem', margin: '0.25rem 0', color: 'var(--primary-dark)' }}>{totalPatients}</h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--primary-color)', fontWeight: '600' }}>Active Registry</span>
          </div>
          <div style={{ padding: '1rem', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--primary-light)', color: 'var(--primary-color)' }}>
            <Users size={32} />
          </div>
        </div>

        <div className="card flex-between" style={{ padding: '1.5rem 2rem' }}>
          <div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: '600' }}>GENERATED REPORTS</div>
            <h3 style={{ fontSize: '2.25rem', margin: '0.25rem 0', color: 'var(--primary-dark)' }}>{generatedReportsCount}</h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--info-color)', fontWeight: '600' }}>AI Diagnostics Processed</span>
          </div>
          <div style={{ padding: '1rem', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--info-light)', color: 'var(--info-color)' }}>
            <FileText size={32} />
          </div>
        </div>

        <div className="card flex-between" style={{ padding: '1.5rem 2rem' }}>
          <div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: '600' }}>SAVED REPORTS</div>
            <h3 style={{ fontSize: '2.25rem', margin: '0.25rem 0', color: 'var(--primary-dark)' }}>{savedReportsCount}</h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--primary-color)', fontWeight: '600' }}>Stored in Database</span>
          </div>
          <div style={{ padding: '1rem', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--primary-light)', color: 'var(--primary-color)' }}>
            <Bookmark size={32} />
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem', flexWrap: 'wrap' }} className="grid-responsive-dash">
        {/* Left Side: Recent Reports */}
        <div className="card" style={{ padding: '2rem' }}>
          <div className="flex-between" style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.25rem' }}>Recent Activity Logs</h3>
            <Link to="/reports" className="btn btn-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>
              View All Logs <ArrowRight size={14} />
            </Link>
          </div>

          {reports.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
              <AlertCircle size={40} style={{ margin: '0 auto 1rem auto', opacity: '0.6', color: 'var(--text-light)' }} />
              <p style={{ fontWeight: '500' }}>No clinical reports generated yet.</p>
              <p style={{ fontSize: '0.85rem', marginTop: '0.25rem' }}>Reports you save will appear in this history log.</p>
              <Link to="/generate" className="btn btn-primary" style={{ marginTop: '1.25rem', padding: '0.5rem 1rem', fontSize: '0.875rem' }}>
                Run AI Diagnosis
              </Link>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    <th style={{ padding: '0.75rem 0.5rem' }}>Report ID</th>
                    <th style={{ padding: '0.75rem 0.5rem' }}>Patient ID</th>
                    <th style={{ padding: '0.75rem 0.5rem' }}>Hospital</th>
                    <th style={{ padding: '0.75rem 0.5rem' }}>Date</th>
                    <th style={{ padding: '0.75rem 0.5rem', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {getRecentReports().map((report) => (
                    <tr key={report.id} style={{ borderBottom: '1px solid var(--border-color)', fontSize: '0.9rem' }}>
                      <td style={{ padding: '0.75rem 0.5rem', fontWeight: '600', color: 'var(--primary-dark)' }}>{report.id}</td>
                      <td style={{ padding: '0.75rem 0.5rem' }}>{report.patientId}</td>
                      <td style={{ padding: '0.75rem 0.5rem' }}>{report.hospitalName}</td>
                      <td style={{ padding: '0.75rem 0.5rem' }}>{report.date}</td>
                      <td style={{ padding: '0.75rem 0.5rem', textAlign: 'right' }}>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                          <button 
                            onClick={() => navigate(`/reports?view=${report.id}`)} 
                            className="btn-icon" 
                            title="Open Transcript"
                          >
                            <Eye size={16} />
                          </button>
                          <button 
                            onClick={() => deleteReport(report.id)} 
                            className="btn-icon" 
                            style={{ color: 'var(--danger-color)' }}
                            title="Purge Record"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Right Side: Quick Action Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="card accented" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.15rem', marginBottom: '1.25rem' }}>Clinical Actions</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <button 
                onClick={() => handleQuickAction('/patients?action=add')} 
                className="btn btn-secondary" 
                style={{ justifyContent: 'flex-start', width: '100%' }}
              >
                <PlusCircle size={18} /> Register Patient
              </button>
              
              <button 
                onClick={() => handleQuickAction('/hospitals')} 
                className="btn btn-outline" 
                style={{ justifyContent: 'flex-start', width: '100%' }}
              >
                <HospIcon size={18} /> Switch Active Clinic
              </button>
              
              <button 
                onClick={() => handleQuickAction('/generate')} 
                className="btn btn-outline" 
                style={{ justifyContent: 'flex-start', width: '100%' }}
              >
                <FileText size={18} /> Compile AI Report
              </button>

              <button 
                onClick={() => handleQuickAction('/ai-assistant')} 
                className="btn btn-outline" 
                style={{ justifyContent: 'flex-start', width: '100%' }}
              >
                <MessageSquare size={18} /> AI Assistant Chat
              </button>
            </div>
          </div>

          {/* Guidelines box */}
          <div className="card" style={{ padding: '1.5rem', backgroundColor: 'var(--bg-tertiary)' }}>
            <h4 style={{ fontSize: '0.95rem', marginBottom: '0.5rem', color: 'var(--text-main)' }}>Prototype Instructions</h4>
            <ul style={{ paddingLeft: '1.25rem', fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <li>Always select an active hospital before compiling reports.</li>
              <li>Preloaded patients P001-P004 are seeded automatically in the registry.</li>
              <li>You can download report logs as formatted text transcripts.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
