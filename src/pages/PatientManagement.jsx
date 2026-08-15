import React, { useState, useEffect } from 'react';
import { usePatient } from '../context/PatientContext';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Search, 
  UserPlus, 
  Edit3, 
  Trash2, 
  CheckCircle, 
  AlertCircle, 
  Calendar, 
  Activity, 
  History, 
  Plus, 
  FileText,
  FileCheck,
  X
} from 'lucide-react';

const PatientManagement = () => {
  const { 
    patients, 
    visits, 
    addPatient, 
    updatePatient, 
    deletePatient,
    addVisit,
    updateVisit,
    deleteVisit
  } = usePatient();
  
  const location = useLocation();
  const navigate = useNavigate();

  // Search filter
  const [searchId, setSearchId] = useState('');
  
  // Selection
  const [selectedPatient, setSelectedPatient] = useState(null);
  
  // Toggles / Modes
  const [patientFormMode, setPatientFormMode] = useState('add'); // 'add' or 'edit'
  const [showVisitForm, setShowVisitForm] = useState(false);
  const [selectedVisit, setSelectedVisit] = useState(null); // Null for adding new visit, otherwise editing

  // Demographic Form States
  const [patientId, setPatientId] = useState('');
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('Male');
  const [bloodGroup, setBloodGroup] = useState('A+');
  const [doctor, setDoctor] = useState('');

  // Visit Form States
  const [visitId, setVisitId] = useState('');
  const [visitDate, setVisitDate] = useState('');
  const [visitSymptoms, setVisitSymptoms] = useState('');
  const [visitHistory, setVisitHistory] = useState('');
  const [visitMedications, setVisitMedications] = useState('');
  const [visitAllergies, setVisitAllergies] = useState('');

  // Feedback Notification
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  // Generate next Patient ID
  const generateNextPatientId = () => {
    if (patients.length === 0) return 'P001';
    const ids = patients.map(p => {
      const match = p.id.match(/\d+/);
      return match ? parseInt(match[0], 10) : 0;
    });
    const maxNum = Math.max(...ids);
    return `P${String(maxNum + 1).padStart(3, '0')}`;
  };

  // Generate next Visit ID for selected patient
  const generateNextVisitId = (pId) => {
    const patientVisits = visits.filter(v => v.patientId === pId);
    if (patientVisits.length === 0) return 'V001';
    const ids = patientVisits.map(v => {
      const match = v.visitId.match(/\d+/);
      return match ? parseInt(match[0], 10) : 0;
    });
    const maxNum = Math.max(...ids);
    return `V${String(maxNum + 1).padStart(3, '0')}`;
  };

  // Get current date string (e.g. "15 Aug")
  const getFormattedDate = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const d = new Date();
    return `${d.getDate()} ${months[d.getMonth()]}`;
  };

  // Initialize profile registration
  const resetForAddPatient = () => {
    setPatientFormMode('add');
    setSelectedPatient(null);
    setShowVisitForm(false);
    setSelectedVisit(null);
    setPatientId(generateNextPatientId());
    setName('');
    setAge('');
    setGender('Male');
    setBloodGroup('A+');
    setDoctor('');
    setFeedback({ type: '', message: '' });
  };

  // Load patient list parameters
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('action') === 'add') {
      resetForAddPatient();
    } else if (patients.length > 0 && !selectedPatient) {
      handleSelectPatient(patients[0]);
    }
  }, [location.search, patients]);

  // Adjust Patient ID when database updates
  useEffect(() => {
    if (patientFormMode === 'add') {
      setPatientId(generateNextPatientId());
    }
  }, [patients, patientFormMode]);

  const handleSelectPatient = (patient) => {
    setSelectedPatient(patient);
    setPatientFormMode('edit');
    setShowVisitForm(false);
    setSelectedVisit(null);
    
    // Set demographics
    setPatientId(patient.id);
    setName(patient.name);
    setAge(patient.age);
    setGender(patient.gender);
    setBloodGroup(patient.bloodGroup);
    setDoctor(patient.doctor || '');
    setFeedback({ type: '', message: '' });
  };

  // Save Demographic changes
  const handlePatientSubmit = (e) => {
    e.preventDefault();
    if (!patientId || !name || !age) {
      setFeedback({ type: 'error', message: 'Name, Age and ID are required.' });
      return;
    }

    const patientData = {
      id: patientId,
      name,
      age: parseInt(age, 10),
      gender,
      bloodGroup,
      doctor
    };

    if (patientFormMode === 'add') {
      // Check duplicate Patient ID
      const exists = patients.some(p => p.id.toUpperCase() === patientId.toUpperCase());
      if (exists) {
        setFeedback({ type: 'error', message: `ID ${patientId} is already in use.` });
        return;
      }

      addPatient(patientData);
      
      // Seed first visit automatically for standard setup
      const defaultVisit = {
        visitId: 'V001',
        patientId: patientId,
        date: getFormattedDate(),
        symptoms: 'Initial general assessment',
        medicalHistory: 'None recorded',
        medications: 'None',
        allergies: 'None'
      };
      addVisit(defaultVisit);

      setFeedback({ type: 'success', message: `Registered profile for ${name} (seeded Visit V001).` });
      resetForAddPatient();
    } else {
      updatePatient(patientId, patientData);
      setSelectedPatient(patientData);
      setFeedback({ type: 'success', message: `Updated demographics for ${name}.` });
    }

    setTimeout(() => setFeedback({ type: '', message: '' }), 4000);
  };

  const handleDeletePatient = (id) => {
    if (window.confirm(`Delete Patient Profile ${id}? This deletes all visit histories and reports!`)) {
      deletePatient(id);
      setFeedback({ type: 'success', message: `Purged profile and visit records for patient ${id}` });
      resetForAddPatient();
      setTimeout(() => setFeedback({ type: '', message: '' }), 4000);
    }
  };

  // Open form for a new visit entry
  const handleOpenAddVisit = () => {
    setSelectedVisit(null);
    setShowVisitForm(true);
    setVisitId(generateNextVisitId(selectedPatient.id));
    setVisitDate(getFormattedDate());
    setVisitSymptoms('');
    setVisitHistory('');
    setVisitMedications('');
    setVisitAllergies('');
  };

  // Open form to edit a visit log
  const handleOpenEditVisit = (v) => {
    setSelectedVisit(v);
    setShowVisitForm(true);
    setVisitId(v.visitId);
    setVisitDate(v.date);
    setVisitSymptoms(v.symptoms);
    setVisitHistory(v.medicalHistory || '');
    setVisitMedications(v.medications || '');
    setVisitAllergies(v.allergies || '');
  };

  // Submit Visit Entry
  const handleVisitSubmit = (e) => {
    e.preventDefault();
    if (!visitSymptoms) {
      setFeedback({ type: 'error', message: 'Active symptoms are required to save a visit log.' });
      return;
    }

    const visitData = {
      visitId,
      patientId: selectedPatient.id,
      date: visitDate || getFormattedDate(),
      symptoms: visitSymptoms,
      medicalHistory: visitHistory,
      medications: visitMedications,
      allergies: visitAllergies
    };

    if (!selectedVisit) {
      // Create new visit log
      addVisit(visitData);
      setFeedback({ type: 'success', message: `Recorded visit ${visitId} for ${selectedPatient.name}` });
    } else {
      // Save changes
      updateVisit(visitId, selectedPatient.id, visitData);
      setFeedback({ type: 'success', message: `Updated visit log ${visitId} details.` });
    }

    setShowVisitForm(false);
    setSelectedVisit(null);
    setTimeout(() => setFeedback({ type: '', message: '' }), 4000);
  };

  const handleDeleteVisit = (vId) => {
    if (window.confirm(`Delete Patient Visit log ${vId}? This will remove reports linked to this visit.`)) {
      deleteVisit(vId, selectedPatient.id);
      setFeedback({ type: 'success', message: `Deleted visit record ${vId}` });
      setShowVisitForm(false);
      setSelectedVisit(null);
      setTimeout(() => setFeedback({ type: '', message: '' }), 4000);
    }
  };

  // Filter registry
  const filteredPatients = patients.filter(p => {
    return p.id.toLowerCase().includes(searchId.toLowerCase()) ||
           p.name.toLowerCase().includes(searchId.toLowerCase());
  });

  // Get visits of selected patient
  const selectedPatientVisits = selectedPatient 
    ? visits.filter(v => v.patientId === selectedPatient.id) 
    : [];

  return (
    <div className="patient-management-page container animate-fade-in" style={{ padding: '2rem 0' }}>
      
      {/* Title */}
      <div style={{ marginBottom: '2.5rem', textAlign: 'center' }}>
        <span className="badge badge-primary" style={{ marginBottom: '0.75rem' }}>Step 2: Patient Logs</span>
        <h2 style={{ fontSize: '2.2rem', marginBottom: '0.5rem' }}>Clinical Registry & Patient History</h2>
        <p style={{ color: 'var(--text-muted)' }}>Manage biographies, trace individual patient visit dates, and review clinical history records</p>
      </div>

      {/* Notifications */}
      {feedback.message && (
        <div style={{ display: 'flex', gap: '0.75rem', backgroundColor: feedback.type === 'success' ? '#f0fdf4' : 'var(--danger-light)', border: feedback.type === 'success' ? '1px solid #bbf7d0' : '1px solid #fee2e2', color: feedback.type === 'success' ? 'var(--primary-color)' : 'var(--danger-color)', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '2rem', alignItems: 'center', fontWeight: '600' }}>
          {feedback.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
          <span>{feedback.message}</span>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }} className="grid-responsive-dash">
        
        {/* Left Column: Registry Search & List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="card" style={{ padding: '1.5rem' }}>
            <div className="flex-between" style={{ marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.15rem' }}>Patient Registry</h3>
              <button 
                onClick={resetForAddPatient} 
                className="btn btn-secondary" 
                style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
              >
                <UserPlus size={14} /> Add Profile
              </button>
            </div>

            <div style={{ position: 'relative', marginBottom: '1rem' }}>
              <Search size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
              <input 
                type="text" 
                className="form-input" 
                style={{ paddingLeft: '34px', fontSize: '0.875rem', padding: '0.6rem 1rem 0.6rem 34px' }}
                placeholder="Search ID or name..."
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
              />
            </div>

            {/* List */}
            {filteredPatients.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                No registered patient profiles found.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '450px', overflowY: 'auto' }}>
                {filteredPatients.map((p) => {
                  const isActive = selectedPatient?.id === p.id;
                  const vCount = visits.filter(v => v.patientId === p.id).length;
                  return (
                    <div 
                      key={p.id}
                      onClick={() => handleSelectPatient(p)}
                      style={{
                        padding: '1rem',
                        border: '1px solid var(--border-color)',
                        borderRadius: 'var(--radius-md)',
                        cursor: 'pointer',
                        transition: 'var(--transition)',
                        backgroundColor: isActive ? 'var(--primary-light)' : 'var(--bg-secondary)',
                        borderColor: isActive ? 'var(--primary-color)' : 'var(--border-color)'
                      }}
                    >
                      <div className="flex-between" style={{ marginBottom: '0.25rem' }}>
                        <span style={{ fontWeight: 'bold', color: isActive ? 'var(--primary-dark)' : 'var(--text-main)' }}>{p.name}</span>
                        <span className="badge badge-primary" style={{ fontSize: '0.7rem', backgroundColor: isActive ? '#ffffff' : 'var(--primary-light)' }}>
                          {p.id}
                        </span>
                      </div>
                      <div className="flex-between" style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        <span>{p.gender}, {p.age} yrs</span>
                        <span style={{ fontWeight: '500', color: 'var(--primary-color)' }}>{vCount} visit{vCount !== 1 ? 's' : ''}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Dynamic Form / Detail Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Demographic Card / Add Profile Form */}
          <div className="card" style={{ padding: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Activity size={20} style={{ color: 'var(--primary-color)' }} />
              <span>{patientFormMode === 'add' ? 'Register Demographic Profile' : 'Edit Demographics'}</span>
            </h3>

            <form onSubmit={handlePatientSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 1fr', gap: '1rem' }} className="grid-responsive-dash">
                <div className="form-group">
                  <label className="form-label">Patient ID *</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={patientId}
                    onChange={(e) => setPatientId(e.target.value.toUpperCase())}
                    disabled={patientFormMode === 'edit'}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Full Name *</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="Alice Smith"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Age *</label>
                  <input 
                    type="number" 
                    className="form-input" 
                    placeholder="28"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    min="0"
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1.5fr', gap: '1rem' }} className="grid-responsive-dash">
                <div className="form-group">
                  <label className="form-label">Gender</label>
                  <select className="form-select" value={gender} onChange={(e) => setGender(e.target.value)}>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Blood Group</label>
                  <select className="form-select" value={bloodGroup} onChange={(e) => setBloodGroup(e.target.value)}>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Attending Doctor</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="Dr. Smith"
                    value={doctor}
                    onChange={(e) => setDoctor(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex-between" style={{ marginTop: '1rem' }}>
                <div>
                  {patientFormMode === 'edit' && (
                    <button 
                      type="button" 
                      onClick={() => handleDeletePatient(patientId)} 
                      className="btn btn-danger"
                    >
                      <Trash2 size={16} /> Delete Profile
                    </button>
                  )}
                </div>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  {patientFormMode === 'edit' && (
                    <button type="button" onClick={resetForAddPatient} className="btn btn-outline">
                      Cancel
                    </button>
                  )}
                  <button type="submit" className="btn btn-primary">
                    {patientFormMode === 'add' ? 'Register Profile' : 'Save Details'}
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Visits Registry & Patient History (Only visible on Edit mode / selection) */}
          {selectedPatient && (
            <div className="card" style={{ padding: '2rem' }}>
              
              {/* Add Visit Overlay Form */}
              {showVisitForm ? (
                <div className="visit-editor-subpanel">
                  <div className="flex-between" style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
                    <h4 style={{ fontSize: '1.1rem', color: 'var(--primary-dark)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Calendar size={18} />
                      <span>{selectedVisit ? `Edit Visit log ${visitId}` : `Record Visit for ${selectedPatient.name}`}</span>
                    </h4>
                    <button onClick={() => setShowVisitForm(false)} className="btn-icon" style={{ padding: '0.25rem' }}>
                      <X size={18} />
                    </button>
                  </div>

                  <form onSubmit={handleVisitSubmit}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }} className="grid-responsive-dash">
                      <div className="form-group">
                        <label className="form-label">Visit ID *</label>
                        <input 
                          type="text" 
                          className="form-input" 
                          value={visitId}
                          onChange={(e) => setVisitId(e.target.value.toUpperCase())}
                          disabled={selectedVisit !== null}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Date (e.g. 15 Aug) *</label>
                        <input 
                          type="text" 
                          className="form-input" 
                          placeholder="e.g. 15 Aug"
                          value={visitDate}
                          onChange={(e) => setVisitDate(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Active Symptoms *</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        placeholder="e.g. Fever, Headache (comma separated)"
                        value={visitSymptoms}
                        onChange={(e) => setVisitSymptoms(e.target.value)}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Medical History specific to this visit</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        placeholder="e.g. Hypertension flare-up"
                        value={visitHistory}
                        onChange={(e) => setVisitHistory(e.target.value)}
                      />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }} className="grid-responsive-dash">
                      <div className="form-group">
                        <label className="form-label">Medications Administered</label>
                        <input 
                          type="text" 
                          className="form-input" 
                          placeholder="Lisinopril 10mg"
                          value={visitMedications}
                          onChange={(e) => setVisitMedications(e.target.value)}
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Reported Allergies</label>
                        <input 
                          type="text" 
                          className="form-input" 
                          placeholder="Penicillin"
                          value={visitAllergies}
                          onChange={(e) => setVisitAllergies(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="flex-between" style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.25rem', marginTop: '1.5rem' }}>
                      <div>
                        {selectedVisit && (
                          <button 
                            type="button" 
                            onClick={() => handleDeleteVisit(visitId)} 
                            className="btn btn-danger"
                          >
                            <Trash2 size={16} /> Delete Visit
                          </button>
                        )}
                      </div>
                      <div style={{ display: 'flex', gap: '0.75rem' }}>
                        <button type="button" onClick={() => setShowVisitForm(false)} className="btn btn-outline">
                          Dismiss
                        </button>
                        <button type="submit" className="btn btn-primary">
                          Save Visit Log
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              ) : (
                /* Visit History List */
                <div>
                  <div className="flex-between" style={{ marginBottom: '1.5rem' }}>
                    <h3 style={{ fontSize: '1.15rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <History size={20} style={{ color: 'var(--primary-color)' }} />
                      <span>Visits Registry (Patient History)</span>
                    </h3>
                    <button 
                      onClick={handleOpenAddVisit} 
                      className="btn btn-secondary" 
                      style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', gap: '0.25rem' }}
                    >
                      <Plus size={14} /> Record Visit
                    </button>
                  </div>

                  {selectedPatientVisits.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                      No visit history logged. Click "Record Visit" to add one.
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      {selectedPatientVisits.map((v) => (
                        <div 
                          key={v.visitId}
                          style={{
                            padding: '1rem',
                            border: '1px solid var(--border-color)',
                            borderRadius: 'var(--radius-md)',
                            backgroundColor: 'var(--bg-primary)'
                          }}
                        >
                          <div className="flex-between" style={{ marginBottom: '0.5rem' }}>
                            <span style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>
                              Visit ID: {v.visitId} &bull; <span style={{ color: 'var(--text-muted)' }}>{v.date}</span>
                            </span>
                            
                            <div style={{ display: 'flex', gap: '0.4rem' }}>
                              <button 
                                onClick={() => handleOpenEditVisit(v)} 
                                className="btn-icon" 
                                style={{ padding: '0.3rem' }} 
                                title="Edit visit logs"
                              >
                                <Edit3 size={14} />
                              </button>
                              <button 
                                onClick={() => navigate(`/generate?patient=${selectedPatient.id}&visit=${v.visitId}`)}
                                className="btn btn-secondary"
                                style={{ padding: '0.25rem 0.6rem', fontSize: '0.75rem', gap: '0.25rem' }}
                                title="Generate report for this visit"
                              >
                                <FileText size={12} /> Report
                              </button>
                            </div>
                          </div>

                          <div style={{ fontSize: '0.85rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginTop: '0.5rem' }} className="grid-2">
                            <div><strong>Symptoms:</strong> {v.symptoms}</div>
                            <div><strong>Med History:</strong> {v.medicalHistory || 'None'}</div>
                            <div><strong>Meds:</strong> {v.medications || 'None'}</div>
                            <div><strong>Allergies:</strong> {v.allergies || 'None'}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

            </div>
          )}

        </div>

      </div>
    </div>
  );
};

export default PatientManagement;
