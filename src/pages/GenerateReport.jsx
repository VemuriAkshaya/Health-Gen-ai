import React, { useState, useEffect } from 'react';
import { usePatient } from '../context/PatientContext';
import { useHospital } from '../context/HospitalContext';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { 
  Building, 
  User, 
  FileText, 
  Sparkles, 
  Save, 
  Download, 
  Share2, 
  Check, 
  AlertCircle,
  Clock,
  Printer,
  Calendar
} from 'lucide-react';

const GenerateReport = () => {
  const { patients, visits, saveReport } = usePatient();
  const { selectedHospital } = useHospital();
  const navigate = useNavigate();
  const location = useLocation();

  const [selectedPatientId, setSelectedPatientId] = useState('');
  const [selectedVisitId, setSelectedVisitId] = useState('');
  
  const [patient, setPatient] = useState(null);
  const [visit, setVisit] = useState(null);
  
  // Generation state
  const [isGenerating, setIsGenerating] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [generatedReport, setGeneratedReport] = useState(null);
  
  // Actions states
  const [isSaved, setIsSaved] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const loadingSteps = [
    'Accessing patient registry database...',
    'Synthesizing biometric parameters...',
    'Reviewing medical history and allergy contraindications...',
    'Cross-referencing symptoms with diagnostic database...',
    'Generating clinical observations & recommendations...',
    'Finalizing clinical transcript file...'
  ];

  // Parse query parameters (?patient=P001&visit=V002)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const pId = params.get('patient');
    const vId = params.get('visit');

    if (pId) {
      setSelectedPatientId(pId);
      if (vId) {
        setSelectedVisitId(vId);
      }
    }
  }, [location.search]);

  // Sync selected patient
  useEffect(() => {
    if (selectedPatientId) {
      const p = patients.find(pat => pat.id === selectedPatientId);
      setPatient(p || null);
      
      // If we don't have a matching query param, default to empty visit or first visit
      const patientVisits = visits.filter(v => v.patientId === selectedPatientId);
      const params = new URLSearchParams(location.search);
      const queryVisitId = params.get('visit');
      
      if (queryVisitId && patientVisits.some(v => v.visitId === queryVisitId)) {
        setSelectedVisitId(queryVisitId);
      } else if (patientVisits.length > 0 && !selectedVisitId) {
        setSelectedVisitId(patientVisits[0].visitId);
      }
    } else {
      setPatient(null);
      setVisit(null);
      setSelectedVisitId('');
    }
    setGeneratedReport(null);
    setIsSaved(false);
  }, [selectedPatientId, patients]);

  // Sync selected visit
  useEffect(() => {
    if (selectedPatientId && selectedVisitId) {
      const v = visits.find(vis => vis.patientId === selectedPatientId && vis.visitId === selectedVisitId);
      setVisit(v || null);
    } else {
      setVisit(null);
    }
    setGeneratedReport(null);
    setIsSaved(false);
  }, [selectedVisitId, selectedPatientId, visits]);

  // Loading animation controller
  useEffect(() => {
    let interval;
    if (isGenerating) {
      interval = setInterval(() => {
        setLoadingStep((prev) => {
          if (prev >= loadingSteps.length - 1) {
            clearInterval(interval);
            finalizeReportGeneration();
            return prev;
          }
          return prev + 1;
        });
      }, 600);
    }
    return () => clearInterval(interval);
  }, [isGenerating]);

  // Generate dynamic, realistic AI observations and recommendations
  const generateClinicalInsights = (v) => {
    const sym = (v.symptoms || '').toLowerCase();
    
    let analysis = '';
    let observations = '';
    let recommendations = [];

    // Diagnostic logic based on symptoms in this visit
    if (sym.includes('fever') || sym.includes('headache') || sym.includes('fatigue')) {
      analysis = 'Clinical presentation suggests a systemic inflammatory response, consistent with viral influenza, acute viral nasopharyngitis, or early bacterial infection. Concomitant headache and fatigue indicate high metabolic strain and potential mild dehydration.';
      observations = 'Elevated body temperature (estimated 38.6°C). Normal breathing, heart rate slightly tachycardic due to pyrexia. Pupils equal, round, reactive to light.';
      recommendations = [
        'Initiate absolute bed rest for 48 hours to allow physiological immune response.',
        'Hydration therapy: Maintain oral intake of 2.5-3L of electrolyte fluids daily.',
        'Pharmacological: Administer Acetaminophen (Paracetamol) 500mg every 6 hours PRN for fever/headache. Verify no contraindications.',
        'Monitor temperature every 4 hours. If pyrexia exceeds 39.5°C or persists past 4 days, refer for full blood work (CBC, CRP).'
      ];
    } else if (sym.includes('cough') || sym.includes('chest') || sym.includes('breath') || sym.includes('shortness')) {
      analysis = 'Presentation indicates acute respiratory tract irritation. Differential diagnoses include Bronchial Asthma exacerbation, acute bronchitis, or atypical pneumonitis. Priority is evaluating airway patency and gas exchange efficiency.';
      observations = 'Mild expiratory wheezing noted upon chest auscultation. Respiration rate elevated (22/min). Oxygen saturation (estimated 95% on room air).';
      recommendations = [
        'Use short-acting beta-agonist inhaler (e.g. Albuterol, 2 puffs every 4-6 hours PRN) as per asthma safety action plan.',
        'Implement cool mist humidification in the room to soothe bronchial passages.',
        'Avoid environmental triggers: absolute avoidance of smoke, dust, and cold ambient air.',
        'CRITICAL: If oxygen saturation drops below 92%, or chest tightness becomes severe, report to emergency triage immediately.'
      ];
    } else if (sym.includes('stomach') || sym.includes('nausea') || sym.includes('abdominal') || sym.includes('pain')) {
      analysis = 'Symptom matrix points to acute gastropathy, gastroenteritis, or localized gastroesophageal reflux irritation (GERD flare-up). Appendicitis or gallbladder involvement should be ruled out if pain localizes to the right abdominal quadrants.';
      observations = 'Abdomen is soft, with mild epigastric tenderness upon deep palpation. No guarding, rebound tenderness, or rigidity observed. Normal bowel sounds present.';
      recommendations = [
        'Maintain a strict bland diet (BRAT diet: bananas, rice, applesauce, toast) for the next 24-48 hours.',
        'Pharmacological: Continue Omeprazole 20mg daily before breakfast. Antacids or antiemetics may be added PRN.',
        'Avoid gastric mucosal irritants: caffeine, spicy foods, carbonated beverages, and NSAIDs.',
        'Seek immediate diagnostic ultrasound if pain localizes to the Right Lower Quadrant or is accompanied by high fever.'
      ];
    } else if (sym.includes('back') || sym.includes('weakness') || sym.includes('pain')) {
      analysis = 'Presentation correlates with mechanical lumbar spine strain or lumbar radiculopathy, potentially secondary to disc herniation. Pain indicates nerve root irritation or severe muscle spasms.';
      observations = 'Reduced lumbar range of motion on flexion. Straight leg raise test positive at 45 degrees bilaterally. Paraspinal muscle guarding present. Lower extremity reflexes intact.';
      recommendations = [
        'Practice brief periods of rest (avoid prolonged bed rest which worsens stiffness) alternating with light walking.',
        'Pharmacological: NSAID therapy (e.g. Ibuprofen 400mg with meals) to manage local inflammation, matching allergy profiles.',
        'Apply heat packs to the lumbar region for 15-minute intervals to relieve muscle spasms and improve micro-circulation.',
        'Referral: Schedule assessment with a physical therapist for core strengthening and spine posture ergonomics.'
      ];
    } else {
      analysis = `Clinical profile reports: "${v.symptoms}". Synthesizing symptoms with a history of ${v.medicalHistory || 'no chronic illnesses'} suggests a localized pathoreactive condition. Differential diagnosis is open pending diagnostic lab work.`;
      observations = 'Biometric metrics are within general margins. Local physical examination matches primary symptom description. No emergency red flags present.';
      recommendations = [
        'Maintain standard hydration and monitor symptom severity over the next 48 hours.',
        'Avoid heavy physical labor or lifestyle triggers that aggravate presentation.',
        'Schedule a follow-up assessment with primary physician if symptoms persist beyond 3 days.',
        'Acquire basic clinical laboratory panels (Complete Blood Count, metabolic profile).'
      ];
    }

    return { analysis, observations, recommendations };
  };

  const handleGenerate = () => {
    if (!patient || !visit) return;
    setIsGenerating(true);
    setLoadingStep(0);
  };

  const finalizeReportGeneration = () => {
    const { analysis, observations, recommendations } = generateClinicalInsights(visit);
    const reportId = `REP-${Math.floor(100000 + Math.random() * 900000)}`;
    const date = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const report = {
      id: reportId,
      patientId: patient.id,
      patientName: patient.name,
      patientAge: patient.age,
      patientGender: patient.gender,
      patientBloodGroup: patient.bloodGroup,
      visitId: visit.visitId,
      visitDate: visit.date,
      symptoms: visit.symptoms,
      medicalHistory: visit.medicalHistory || 'None recorded',
      medications: visit.medications || 'None',
      allergies: visit.allergies || 'None',
      doctor: patient.doctor || 'Dr. Sarah Connor',
      hospitalName: selectedHospital.name,
      hospitalLocation: selectedHospital.location,
      date: date,
      analysis,
      observations,
      recommendations
    };

    setGeneratedReport(report);
    setIsGenerating(false);
  };

  const handleSave = () => {
    if (!generatedReport) return;
    saveReport(generatedReport);
    setIsSaved(true);
  };

  const handleDownload = () => {
    if (!generatedReport) return;
    
    // Create text transcript of report
    const text = `
=========================================
HEALTHGEN AI - CLINICAL DIAGNOSTIC REPORT
=========================================
Report ID   : ${generatedReport.id}
Date        : ${generatedReport.date}
Hospital    : ${generatedReport.hospitalName}
Location    : ${generatedReport.hospitalLocation}
Physician   : ${generatedReport.doctor}

PATIENT INFORMATION
-------------------
Patient ID  : ${generatedReport.patientId}
Name        : ${generatedReport.patientName}
Age / Sex   : ${generatedReport.patientAge} / ${generatedReport.patientGender}
Blood Group : ${generatedReport.patientBloodGroup}

VISIT DETAILS
-------------
Visit ID    : ${generatedReport.visitId}
Visit Date  : ${generatedReport.visitDate}
Symptoms    : ${generatedReport.symptoms}
Medical Hist: ${generatedReport.medicalHistory}
Medications : ${generatedReport.medications}
Allergies   : ${generatedReport.allergies}

AI CLINICAL ANALYSIS
--------------------
${generatedReport.analysis}

GENERAL OBSERVATIONS
--------------------
${generatedReport.observations}

RECOMMENDED ACTION PLAN
-----------------------
${generatedReport.recommendations.map((r, i) => `${i + 1}. ${r}`).join('\n')}

=========================================
Disclaimer: This is an educational prototype and is not a medical diagnostic tool. 
Please consult a qualified healthcare professional for medical advice.
=========================================
`;
    
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `HealthGen-Report-${generatedReport.patientId}-${generatedReport.visitId}-${generatedReport.id}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const printReport = () => {
    window.print();
  };

  // Get visits of selected patient
  const patientVisits = selectedPatientId 
    ? visits.filter(v => v.patientId === selectedPatientId) 
    : [];

  return (
    <div className="generate-report-page container animate-fade-in" style={{ padding: '2rem 0' }}>
      
      {/* Active Hospital Warning Banner */}
      {!selectedHospital ? (
        <div className="card text-center" style={{ padding: '4rem 2rem', borderLeft: '4px solid var(--warning-color)' }}>
          <AlertCircle size={48} style={{ color: 'var(--warning-color)', margin: '0 auto 1.5rem auto' }} />
          <h2 style={{ fontSize: '1.5rem', marginBottom: '0.75rem' }}>Hospital Selection Required</h2>
          <p style={{ color: 'var(--text-muted)', maxWidth: '500px', margin: '0 auto 2rem auto' }}>
            In order to generate medical reports, you must first register or affiliate with an active medical clinic.
          </p>
          <Link to="/hospitals" className="btn btn-primary">
            Choose Affiliated Clinic
          </Link>
        </div>
      ) : (
        <div>
          <div style={{ marginBottom: '2.5rem', textAlign: 'center' }}>
            <span className="badge badge-primary" style={{ marginBottom: '0.75rem' }}>Step 3: AI Clinical Analysis</span>
            <h2 style={{ fontSize: '2.2rem', marginBottom: '0.5rem' }}>AI Report Synthesizer</h2>
            <p style={{ color: 'var(--text-muted)' }}>Generate mock clinical assessments and transcripts for specific patient visits</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.8fr', gap: '2rem' }} className="grid-responsive-dash">
            
            {/* Left Column: Select Patient & Visit Dropdowns */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div className="card" style={{ padding: '1.5rem' }}>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '1.25rem' }}>Select Case Parameters</h3>
                
                {/* Patient Dropdown */}
                <div className="form-group">
                  <label className="form-label">Registry Patient ID</label>
                  <select 
                    className="form-select"
                    value={selectedPatientId}
                    onChange={(e) => { setSelectedPatientId(e.target.value); setSelectedVisitId(''); }}
                  >
                    <option value="">-- Select Patient --</option>
                    {patients.map(p => (
                      <option key={p.id} value={p.id}>{p.id} - {p.name}</option>
                    ))}
                  </select>
                </div>

                {/* Visit Dropdown */}
                {selectedPatientId && (
                  <div className="form-group animate-fade-in">
                    <label className="form-label">Select Visit Date / ID</label>
                    {patientVisits.length === 0 ? (
                      <div style={{ fontSize: '0.85rem', color: 'var(--danger-color)', padding: '0.5rem 0' }}>
                        No visits recorded for this patient profile. Please add one in Patient registry first.
                      </div>
                    ) : (
                      <select 
                        className="form-select"
                        value={selectedVisitId}
                        onChange={(e) => setSelectedVisitId(e.target.value)}
                      >
                        <option value="">-- Select Visit --</option>
                        {patientVisits.map(v => (
                          <option key={v.visitId} value={v.visitId}>{v.visitId} - {v.date} ({v.symptoms.substring(0, 20)}...)</option>
                        ))}
                      </select>
                    )}
                  </div>
                )}

                {patient && visit && (
                  <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.25rem', marginTop: '1.25rem' }}>
                    <h4 style={{ fontSize: '0.95rem', marginBottom: '0.75rem', color: 'var(--text-main)' }}>Patient Case Information</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.875rem' }}>
                      <div className="flex-between">
                        <span style={{ color: 'var(--text-muted)' }}>Full Name:</span>
                        <span style={{ fontWeight: '600' }}>{patient.name}</span>
                      </div>
                      <div className="flex-between">
                        <span style={{ color: 'var(--text-muted)' }}>Age / Gender:</span>
                        <span>{patient.age} / {patient.gender}</span>
                      </div>
                      <div className="flex-between">
                        <span style={{ color: 'var(--text-muted)' }}>Blood Group:</span>
                        <span>{patient.bloodGroup}</span>
                      </div>
                      <div className="flex-between">
                        <span style={{ color: 'var(--text-muted)' }}>Attending Doctor:</span>
                        <span>{patient.doctor || 'Unassigned'}</span>
                      </div>
                      
                      <div style={{ borderTop: '1px dotted var(--border-color)', margin: '0.25rem 0' }}></div>
                      
                      <div className="flex-between" style={{ backgroundColor: 'var(--bg-primary)', padding: '0.4rem', borderRadius: '4px' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: 'bold', color: 'var(--primary-dark)', fontSize: '0.8rem' }}>
                          <Calendar size={14} /> Visit ID: {visit.visitId}
                        </span>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '500' }}>Date: {visit.date}</span>
                      </div>

                      <div>
                        <div style={{ color: 'var(--text-muted)', marginBottom: '0.2rem' }}>Symptoms for this visit:</div>
                        <p style={{ fontWeight: '500', fontSize: '0.8rem', backgroundColor: 'var(--bg-primary)', padding: '0.4rem', borderRadius: '4px' }}>
                          {visit.symptoms}
                        </p>
                      </div>
                      
                      <div>
                        <div style={{ color: 'var(--text-muted)', marginBottom: '0.2rem' }}>Medical History:</div>
                        <p style={{ fontSize: '0.8rem' }}>{visit.medicalHistory || 'None recorded'}</p>
                      </div>
                    </div>

                    <button 
                      onClick={handleGenerate} 
                      className="btn btn-primary" 
                      style={{ width: '100%', marginTop: '1.5rem', gap: '0.5rem' }}
                      disabled={isGenerating}
                    >
                      <Sparkles size={18} /> Compile AI Report
                    </button>
                  </div>
                )}
              </div>

              {/* Informational Guidelines Card */}
              <div className="card" style={{ padding: '1.5rem', backgroundColor: '#f0fdf4', borderColor: '#bbf7d0' }}>
                <h4 style={{ fontSize: '0.95rem', color: 'var(--primary-dark)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Building size={16} /> Admission Center
                </h4>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Report will be automatically stamped for:
                  <div style={{ fontWeight: 'bold', color: 'var(--primary-dark)', marginTop: '0.25rem' }}>{selectedHospital.name}</div>
                  <div style={{ fontSize: '0.8rem' }}>{selectedHospital.location}</div>
                </div>
              </div>
            </div>

            {/* Right Column: Loading Animation or Generated Report Display */}
            <div className="flex-grow-1" style={{ minWidth: '300px' }}>
              {isGenerating && (
                <div className="card flex-center" style={{ minHeight: '360px', flexDirection: 'column', textAlign: 'center', padding: '3rem' }}>
                  <div style={{ position: 'relative', width: '80px', height: '80px', marginBottom: '1.5rem' }}>
                    <div style={{ position: 'absolute', width: '100%', height: '100%', border: '4px solid var(--primary-light)', borderRadius: '50%' }}></div>
                    <div style={{ position: 'absolute', width: '100%', height: '100%', border: '4px solid transparent', borderTopColor: 'var(--primary-color)', borderRadius: '50%' }} className="animate-spin"></div>
                    <Sparkles size={32} style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translateY(-50%) translateX(-50%)', color: 'var(--primary-color)' }} className="animate-pulse-slow" />
                  </div>
                  <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>Analyzing Medical Vitals</h3>
                  <div style={{ width: '100%', maxWidth: '280px', height: '6px', backgroundColor: 'var(--border-color)', borderRadius: '3px', overflow: 'hidden', marginBottom: '1rem' }}>
                    <div style={{ width: `${((loadingStep + 1) / loadingSteps.length) * 100}%`, height: '100%', backgroundColor: 'var(--primary-color)', transition: 'width 0.6s ease' }}></div>
                  </div>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', minHeight: '1.5rem', fontWeight: '500' }}>
                    {loadingSteps[loadingStep]}
                  </p>
                </div>
              )}

              {!isGenerating && !generatedReport && (
                <div className="card flex-center" style={{ minHeight: '360px', flexDirection: 'column', color: 'var(--text-light)', borderStyle: 'dashed', textAlign: 'center', padding: '3rem' }}>
                  <FileText size={48} style={{ marginBottom: '1rem', opacity: '0.5' }} />
                  <h3 style={{ fontSize: '1.15rem', color: 'var(--text-muted)' }}>Ready for Generation</h3>
                  <p style={{ fontSize: '0.85rem', maxWidth: '280px', marginTop: '0.25rem' }}>
                    Select a registered patient and visit log on the left, then click "Compile AI Report" to run the diagnostics.
                  </p>
                </div>
              )}

              {!isGenerating && generatedReport && (
                <div className="card animate-fade-in print-area" style={{ padding: '2.5rem', position: 'relative' }}>
                  
                  {/* Report Stamp Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid var(--primary-color)', paddingBottom: '1.5rem', marginBottom: '1.5rem' }}>
                    <div>
                      <span className="badge badge-primary" style={{ marginBottom: '0.5rem', fontSize: '0.75rem' }}>HealthGen Clinical AI</span>
                      <h3 style={{ fontSize: '1.5rem', color: 'var(--primary-dark)' }}>{generatedReport.hospitalName}</h3>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{generatedReport.hospitalLocation}</div>
                    </div>
                    
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: 'bold', color: 'var(--primary-color)' }}>{generatedReport.id}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Date Generated: {generatedReport.date}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Physician: {generatedReport.doctor}</div>
                    </div>
                  </div>

                  {/* Patient Info Grid */}
                  <div style={{ backgroundColor: 'var(--bg-primary)', padding: '1rem', borderRadius: 'var(--radius-md)', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1.5rem', fontSize: '0.85rem' }} className="grid-4">
                    <div>
                      <div style={{ color: 'var(--text-muted)' }}>Patient ID</div>
                      <div style={{ fontWeight: 'bold' }}>{generatedReport.patientId}</div>
                    </div>
                    <div>
                      <div style={{ color: 'var(--text-muted)' }}>Name</div>
                      <div style={{ fontWeight: 'bold' }}>{generatedReport.patientName}</div>
                    </div>
                    <div>
                      <div style={{ color: 'var(--text-muted)' }}>Age / Gender</div>
                      <div style={{ fontWeight: 'bold' }}>{generatedReport.patientAge} / {generatedReport.patientGender}</div>
                    </div>
                    <div>
                      <div style={{ color: 'var(--text-muted)' }}>Blood Group</div>
                      <div style={{ fontWeight: 'bold' }}>{generatedReport.patientBloodGroup}</div>
                    </div>
                  </div>

                  {/* Visit details line */}
                  <div style={{ border: '1px solid var(--border-color)', borderLeft: '4px solid var(--primary-color)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', fontSize: '0.85rem', backgroundColor: 'var(--bg-primary)' }}>
                    <span><strong>Visit ID:</strong> {generatedReport.visitId}</span>
                    <span><strong>Visit Date Logged:</strong> {generatedReport.visitDate}</span>
                  </div>

                  {/* Symptoms & History Details */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem', fontSize: '0.85rem' }} className="grid-2">
                    <div>
                      <h4 style={{ fontSize: '0.9rem', marginBottom: '0.4rem', color: 'var(--primary-dark)' }}>Active Symptoms</h4>
                      <p style={{ color: 'var(--text-main)', fontWeight: '500' }}>{generatedReport.symptoms}</p>
                    </div>
                    <div>
                      <h4 style={{ fontSize: '0.9rem', marginBottom: '0.4rem', color: 'var(--primary-dark)' }}>Medical History</h4>
                      <p style={{ color: 'var(--text-muted)' }}>{generatedReport.medicalHistory}</p>
                    </div>
                  </div>

                  {/* Medical Details */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem', fontSize: '0.85rem' }} className="grid-2">
                    <div>
                      <h4 style={{ fontSize: '0.9rem', marginBottom: '0.4rem', color: 'var(--primary-dark)' }}>Current Medications</h4>
                      <p style={{ color: 'var(--text-muted)' }}>{generatedReport.medications}</p>
                    </div>
                    <div>
                      <h4 style={{ fontSize: '0.9rem', marginBottom: '0.4rem', color: 'var(--primary-dark)' }}>Contraindicated Allergies</h4>
                      <p style={{ color: 'var(--text-muted)' }}>{generatedReport.allergies}</p>
                    </div>
                  </div>

                  {/* AI Diagnosis Area */}
                  <div style={{ marginBottom: '1.5rem', borderLeft: '3px solid var(--primary-color)', paddingLeft: '1rem' }}>
                    <h4 style={{ fontSize: '1rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Sparkles size={16} style={{ color: 'var(--primary-color)' }} /> Clinical AI Synthesis
                    </h4>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-main)', lineHeight: '1.6' }}>
                      {generatedReport.analysis}
                    </p>
                  </div>

                  {/* Observations */}
                  <div style={{ marginBottom: '1.5rem' }}>
                    <h4 style={{ fontSize: '0.95rem', marginBottom: '0.4rem', color: 'var(--primary-dark)' }}>Biometrical Observations</h4>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                      {generatedReport.observations}
                    </p>
                  </div>

                  {/* Action Plan / Recommendations */}
                  <div style={{ marginBottom: '2rem' }}>
                    <h4 style={{ fontSize: '0.95rem', marginBottom: '0.5rem', color: 'var(--primary-dark)' }}>AI-Suggested Clinical Action Plan</h4>
                    <ol style={{ paddingLeft: '1.25rem', fontSize: '0.875rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                      {generatedReport.recommendations.map((rec, index) => (
                        <li key={index}>{rec}</li>
                      ))}
                    </ol>
                  </div>

                  {/* Actions Drawer */}
                  <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', gap: '0.75rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
                    <div>
                      <button 
                        onClick={printReport}
                        className="btn btn-outline"
                        style={{ gap: '0.4rem' }}
                      >
                        <Printer size={16} /> Print
                      </button>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button 
                        onClick={handleSave} 
                        className={`btn ${isSaved ? 'btn-secondary' : 'btn-primary'}`}
                        style={{ gap: '0.4rem' }}
                        disabled={isSaved}
                      >
                        {isSaved ? (
                          <><Check size={16} /> Saved to Local</>
                        ) : (
                          <><Save size={16} /> Save Report</>
                        )}
                      </button>
                      
                      <button 
                        onClick={handleDownload} 
                        className="btn btn-outline"
                        style={{ gap: '0.4rem' }}
                      >
                        <Download size={16} /> Download
                      </button>
                    </div>
                  </div>

                </div>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default GenerateReport;
