import React, { useState, useEffect } from 'react';
import { usePatient } from '../context/PatientContext';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  FolderHeart, 
  Search, 
  Trash2, 
  Download, 
  Share2, 
  Eye, 
  AlertCircle, 
  Printer, 
  FileText,
  Sparkles,
  ArrowLeft,
  Calendar
} from 'lucide-react';

const Reports = () => {
  const { reports, deleteReport } = usePatient();
  const location = useLocation();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedReport, setSelectedReport] = useState(null);
  
  // Share modal states
  const [showShareModal, setShowShareModal] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Deep-linking (?view=REP-ID)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const viewId = params.get('view');
    if (viewId && reports.length > 0) {
      const report = reports.find(r => r.id === viewId);
      if (report) {
        setSelectedReport(report);
      }
    } else if (reports.length > 0 && !selectedReport) {
      setSelectedReport(reports[0]);
    }
  }, [location.search, reports]);

  const handleSelectReport = (report) => {
    setSelectedReport(report);
    navigate(`/reports?view=${report.id}`, { replace: true });
  };

  const handleDelete = (id) => {
    if (window.confirm(`Are you sure you want to permanently delete report ${id}?`)) {
      deleteReport(id);
      if (selectedReport?.id === id) {
        setSelectedReport(null);
        navigate('/reports', { replace: true });
      }
    }
  };

  const handleDownload = (report) => {
    if (!report) return;

    const text = `
=========================================
HEALTHGEN AI - CLINICAL DIAGNOSTIC REPORT
=========================================
Report ID   : ${report.id}
Date        : ${report.date}
Hospital    : ${report.hospitalName}
Location    : ${report.hospitalLocation}
Physician   : ${report.doctor}

PATIENT INFORMATION
-------------------
Patient ID  : ${report.patientId}
Name        : ${report.patientName}
Age / Sex   : ${report.patientAge} / ${report.patientGender}
Blood Group : ${report.patientBloodGroup}

VISIT DETAILS
-------------
Visit ID    : ${report.visitId || 'V001'}
Visit Date  : ${report.visitDate || report.date}
Symptoms    : ${report.symptoms}
Medical Hist: ${report.medicalHistory || 'None'}
Medications : ${report.medications || 'None'}
Allergies   : ${report.allergies || 'None'}

AI CLINICAL ANALYSIS
--------------------
${report.analysis}

GENERAL OBSERVATIONS
--------------------
${report.observations}

RECOMMENDED ACTION PLAN
-----------------------
${report.recommendations.map((r, i) => `${i + 1}. ${r}`).join('\n')}

=========================================
Disclaimer: This is an educational prototype and is not a medical diagnostic tool. 
Please consult a qualified healthcare professional for medical advice.
=========================================
`;

    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `HealthGen-Report-${report.id}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Filter reports
  const filteredReports = reports.filter(r => {
    return r.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
           r.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
           r.hospitalName.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="reports-page container animate-fade-in" style={{ padding: '2rem 0' }}>
      
      <div style={{ marginBottom: '2.5rem', textAlign: 'center' }} className="no-print">
        <span className="badge badge-primary" style={{ marginBottom: '0.75rem' }}>Medical Vault</span>
        <h2 style={{ fontSize: '2.2rem', marginBottom: '0.5rem' }}>Report Management Vault</h2>
        <p style={{ color: 'var(--text-muted)' }}>Search and review compiled diagnostics transcripts, printable reports, and patient visit logs</p>
      </div>

      {reports.length === 0 ? (
        <div className="card text-center no-print" style={{ padding: '5rem 2rem' }}>
          <FolderHeart size={64} style={{ color: 'var(--text-light)', margin: '0 auto 1.5rem auto' }} />
          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Vault is Empty</h3>
          <p style={{ color: 'var(--text-muted)', maxWidth: '350px', margin: '0 auto 1.5rem auto' }}>
            No clinical diagnostic reports have been saved yet.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
            <button onClick={() => navigate('/generate')} className="btn btn-primary">
              Generate AI Report
            </button>
            <button onClick={() => navigate('/patients')} className="btn btn-outline">
              Review Patient logs
            </button>
          </div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.8fr', gap: '2rem' }} className="grid-responsive-dash">
          
          {/* Left Column: List & Search */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }} className="no-print">
            <div className="card" style={{ padding: '1.5rem' }}>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '1.25rem' }}>Saved Reports</h3>
              
              <div style={{ position: 'relative', marginBottom: '1rem' }}>
                <Search size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
                <input 
                  type="text" 
                  className="form-input" 
                  style={{ paddingLeft: '34px', fontSize: '0.875rem', padding: '0.6rem 1rem' }}
                  placeholder="Search by ID, patient, clinic..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Reports List */}
              {filteredReports.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  No matching records in vault.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '480px', overflowY: 'auto' }}>
                  {filteredReports.map((r) => {
                    const isActive = selectedReport?.id === r.id;
                    return (
                      <div
                        key={r.id}
                        onClick={() => handleSelectReport(r)}
                        style={{
                          padding: '1rem',
                          border: '1px solid var(--border-color)',
                          borderRadius: 'var(--radius-md)',
                          cursor: 'pointer',
                          backgroundColor: isActive ? 'var(--primary-light)' : 'var(--bg-secondary)',
                          borderColor: isActive ? 'var(--primary-color)' : 'var(--border-color)',
                          transition: 'var(--transition)'
                        }}
                      >
                        <div className="flex-between" style={{ marginBottom: '0.25rem' }}>
                          <span style={{ fontWeight: 'bold', fontSize: '0.9rem', color: isActive ? 'var(--primary-dark)' : 'var(--text-main)' }}>
                            {r.id}
                          </span>
                          <span className="badge badge-primary" style={{ fontSize: '0.7rem', backgroundColor: isActive ? '#ffffff' : 'var(--primary-light)' }}>
                            Visit: {r.visitId || 'V001'}
                          </span>
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                          Patient: <strong>{r.patientName} ({r.patientId})</strong>
                        </div>
                        <div className="flex-between" style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>
                          <span>{r.hospitalName}</span>
                          <span>{r.date}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Report Details View */}
          <div className="flex-grow-1">
            {selectedReport ? (
              <div className="card print-area" style={{ padding: '2.5rem' }}>
                
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid var(--primary-color)', paddingBottom: '1.5rem', marginBottom: '1.5rem' }}>
                    <div>
                      <span className="badge badge-primary" style={{ marginBottom: '0.5rem', fontSize: '0.75rem' }}>HealthGen Clinical AI</span>
                      <h3 style={{ fontSize: '1.5rem', color: 'var(--primary-dark)' }}>{selectedReport.hospitalName}</h3>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{selectedReport.hospitalLocation}</div>
                    </div>
                    
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: 'bold', color: 'var(--primary-color)' }}>{selectedReport.id}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Date: {selectedReport.date}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Physician: {selectedReport.doctor}</div>
                    </div>
                  </div>

                  {/* Patient Info Grid */}
                  <div style={{ backgroundColor: 'var(--bg-primary)', padding: '1rem', borderRadius: 'var(--radius-md)', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1.5rem', fontSize: '0.85rem' }} className="grid-4">
                    <div>
                      <div style={{ color: 'var(--text-muted)' }}>Patient ID</div>
                      <div style={{ fontWeight: 'bold' }}>{selectedReport.patientId}</div>
                    </div>
                    <div>
                      <div style={{ color: 'var(--text-muted)' }}>Name</div>
                      <div style={{ fontWeight: 'bold' }}>{selectedReport.patientName}</div>
                    </div>
                    <div>
                      <div style={{ color: 'var(--text-muted)' }}>Age / Gender</div>
                      <div style={{ fontWeight: 'bold' }}>{selectedReport.patientAge} / {selectedReport.patientGender}</div>
                    </div>
                    <div>
                      <div style={{ color: 'var(--text-muted)' }}>Blood Group</div>
                      <div style={{ fontWeight: 'bold' }}>{selectedReport.patientBloodGroup}</div>
                    </div>
                  </div>

                  {/* Visit details line */}
                  <div style={{ border: '1px solid var(--border-color)', borderLeft: '4px solid var(--primary-color)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', fontSize: '0.85rem', backgroundColor: 'var(--bg-primary)' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><strong>Visit ID:</strong> {selectedReport.visitId || 'V001'}</span>
                    <span><strong>Visit Date Logged:</strong> {selectedReport.visitDate || selectedReport.date}</span>
                  </div>

                  {/* Symptoms & medical details */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem', fontSize: '0.85rem' }} className="grid-2">
                    <div>
                      <h4 style={{ fontSize: '0.9rem', marginBottom: '0.4rem', color: 'var(--primary-dark)' }}>Active Symptoms</h4>
                      <p style={{ color: 'var(--text-main)', fontWeight: '500' }}>{selectedReport.symptoms}</p>
                    </div>
                    <div>
                      <h4 style={{ fontSize: '0.9rem', marginBottom: '0.4rem', color: 'var(--primary-dark)' }}>Medical History</h4>
                      <p style={{ color: 'var(--text-muted)' }}>{selectedReport.medicalHistory || 'None recorded'}</p>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem', fontSize: '0.85rem' }} className="grid-2">
                    <div>
                      <h4 style={{ fontSize: '0.9rem', marginBottom: '0.4rem', color: 'var(--primary-dark)' }}>Current Medications</h4>
                      <p style={{ color: 'var(--text-muted)' }}>{selectedReport.medications || 'None'}</p>
                    </div>
                    <div>
                      <h4 style={{ fontSize: '0.9rem', marginBottom: '0.4rem', color: 'var(--primary-dark)' }}>Contraindicated Allergies</h4>
                      <p style={{ color: 'var(--text-muted)' }}>{selectedReport.allergies || 'None'}</p>
                    </div>
                  </div>

                  {/* AI Assessment */}
                  <div style={{ marginBottom: '1.5rem', borderLeft: '3px solid var(--primary-color)', paddingLeft: '1rem' }}>
                    <h4 style={{ fontSize: '1rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Sparkles size={16} style={{ color: 'var(--primary-color)' }} /> Clinical AI Synthesis
                    </h4>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-main)', lineHeight: '1.6' }}>
                      {selectedReport.analysis}
                    </p>
                  </div>

                  <div style={{ marginBottom: '1.5rem' }}>
                    <h4 style={{ fontSize: '0.95rem', marginBottom: '0.4rem', color: 'var(--primary-dark)' }}>Biometrical Observations</h4>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                      {selectedReport.observations}
                    </p>
                  </div>

                  <div style={{ marginBottom: '2rem' }}>
                    <h4 style={{ fontSize: '0.95rem', marginBottom: '0.5rem', color: 'var(--primary-dark)' }}>AI-Suggested Clinical Action Plan</h4>
                    <ol style={{ paddingLeft: '1.25rem', fontSize: '0.875rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                      {selectedReport.recommendations.map((rec, index) => (
                        <li key={index}>{rec}</li>
                      ))}
                    </ol>
                  </div>
                </div>

                {/* Actions Panel */}
                <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', gap: '0.75rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
                  <div>
                    <button 
                      onClick={() => handleDelete(selectedReport.id)} 
                      className="btn btn-danger"
                      style={{ gap: '0.4rem' }}
                    >
                      <Trash2 size={16} /> Delete Report
                    </button>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button 
                      onClick={() => window.print()}
                      className="btn btn-outline"
                      style={{ gap: '0.4rem' }}
                    >
                      <Printer size={16} /> Print
                    </button>
                    
                    <button 
                      onClick={() => handleDownload(selectedReport)} 
                      className="btn btn-outline"
                      style={{ gap: '0.4rem' }}
                    >
                      <Download size={16} /> Download
                    </button>

                    <button 
                      onClick={() => setShowShareModal(true)} 
                      className="btn btn-outline"
                      style={{ gap: '0.4rem' }}
                    >
                      <Share2 size={16} /> Share
                    </button>
                  </div>
                </div>

              </div>
            ) : (
              <div className="card flex-center" style={{ minHeight: '400px', borderStyle: 'dashed', textAlign: 'center', color: 'var(--text-light)', padding: '3rem' }}>
                <FolderHeart size={48} style={{ opacity: '0.5', marginBottom: '1rem' }} />
                <h3 style={{ fontSize: '1.1rem', color: 'var(--text-muted)' }}>No Record Selected</h3>
                <p style={{ fontSize: '0.85rem', maxWidth: '280px', marginTop: '0.25rem' }}>
                  Select a clinical record from the left side panel to review its diagnostic history.
                </p>
              </div>
            )}
          </div>

        </div>
      )}

      {/* Share Modal Backdrop */}
      {showShareModal && (
        <div className="flex-center" style={{ position: 'fixed', top: '0', left: '0', right: '0', bottom: '0', backgroundColor: 'rgba(0, 0, 0, 0.4)', zIndex: '999', padding: '1rem' }}>
          <div className="card" style={{ width: '100%', maxWidth: '480px', padding: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Share Clinical Transcript</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              Copy the unique encrypted link below to share this clinical report.
            </p>
            
            <div className="form-group" style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
              <input 
                type="text" 
                className="form-input" 
                value={`${window.location.origin}/reports?view=${selectedReport?.id}`}
                readOnly
              />
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(`${window.location.origin}/reports?view=${selectedReport?.id}`);
                  setCopiedLink(true);
                  setTimeout(() => setCopiedLink(false), 2000);
                }}
                className="btn btn-primary"
                style={{ padding: '0 1.25rem', flexShrink: 0 }}
              >
                {copiedLink ? 'Copied' : 'Copy'}
              </button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button 
                onClick={() => setShowShareModal(false)}
                className="btn btn-outline"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Reports;
