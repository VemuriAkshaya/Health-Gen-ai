import React, { createContext, useContext, useState, useEffect } from 'react';

const PatientContext = createContext();

export const usePatient = () => useContext(PatientContext);

// Initial patient profiles (biographical info only)
const INITIAL_PATIENTS = [
  {
    id: 'P001',
    name: 'Alice Smith',
    age: 28,
    gender: 'Female',
    bloodGroup: 'A+',
    doctor: 'Dr. Smith'
  },
  {
    id: 'P002',
    name: 'Bob Jones',
    age: 45,
    gender: 'Male',
    bloodGroup: 'O+',
    doctor: 'Dr. Adams'
  },
  {
    id: 'P003',
    name: 'Charlie Brown',
    age: 36,
    gender: 'Male',
    bloodGroup: 'B-',
    doctor: 'Dr. Patel'
  },
  {
    id: 'P004',
    name: 'Diana Prince',
    age: 31,
    gender: 'Female',
    bloodGroup: 'AB+',
    doctor: 'Dr. Lee'
  }
];

// Initial visits seed data (matching the P001 visits requirements)
const INITIAL_VISITS = [
  {
    visitId: 'V001',
    patientId: 'P001',
    date: '15 Aug',
    symptoms: 'Fever, Headache',
    medicalHistory: 'Hypertension',
    medications: 'Lisinopril',
    allergies: 'Penicillin'
  },
  {
    visitId: 'V002',
    patientId: 'P001',
    date: '25 Aug',
    symptoms: 'Cough, Fatigue',
    medicalHistory: 'Hypertension',
    medications: 'Lisinopril',
    allergies: 'Penicillin'
  },
  {
    visitId: 'V003',
    patientId: 'P001',
    date: '10 Sep',
    symptoms: 'Stomach Pain',
    medicalHistory: 'GERD',
    medications: 'Omeprazole',
    allergies: 'Penicillin'
  },
  {
    visitId: 'V001',
    patientId: 'P002',
    date: '15 Aug',
    symptoms: 'Cough, chest discomfort, shortness of breath',
    medicalHistory: 'Asthma',
    medications: 'Albuterol',
    allergies: 'None'
  },
  {
    visitId: 'V001',
    patientId: 'P003',
    date: '15 Aug',
    symptoms: 'Stomach pain, nausea',
    medicalHistory: 'GERD',
    medications: 'Omeprazole',
    allergies: 'Sulfa drugs'
  },
  {
    visitId: 'V001',
    patientId: 'P004',
    date: '15 Aug',
    symptoms: 'Back pain, muscle weakness',
    medicalHistory: 'Herniated disc',
    medications: 'Ibuprofen',
    allergies: 'Aspirin'
  }
];

export const PatientProvider = ({ children }) => {
  const [patients, setPatients] = useState([]);
  const [visits, setVisits] = useState([]);
  const [reports, setReports] = useState([]);

  // Load from localStorage or seed initial data on mount
  useEffect(() => {
    // 1. Load Patients
    const savedPatients = localStorage.getItem('hg_patients');
    if (savedPatients) {
      try {
        setPatients(JSON.parse(savedPatients));
      } catch (e) {
        console.error('Failed to parse saved patients', e);
        setPatients(INITIAL_PATIENTS);
      }
    } else {
      setPatients(INITIAL_PATIENTS);
      localStorage.setItem('hg_patients', JSON.stringify(INITIAL_PATIENTS));
    }

    // 2. Load Visits
    const savedVisits = localStorage.getItem('hg_visits');
    if (savedVisits) {
      try {
        setVisits(JSON.parse(savedVisits));
      } catch (e) {
        console.error('Failed to parse saved visits', e);
        setVisits(INITIAL_VISITS);
      }
    } else {
      setVisits(INITIAL_VISITS);
      localStorage.setItem('hg_visits', JSON.stringify(INITIAL_VISITS));
    }

    // 3. Load Reports
    const savedReports = localStorage.getItem('hg_reports');
    if (savedReports) {
      try {
        setReports(JSON.parse(savedReports));
      } catch (e) {
        console.error('Failed to parse saved reports', e);
        setReports([]);
      }
    }
  }, []);

  // Sync state helpers with localStorage
  const savePatientsToStorage = (newPatients) => {
    setPatients(newPatients);
    localStorage.setItem('hg_patients', JSON.stringify(newPatients));
  };

  const saveVisitsToStorage = (newVisits) => {
    setVisits(newVisits);
    localStorage.setItem('hg_visits', JSON.stringify(newVisits));
  };

  const saveReportsToStorage = (newReports) => {
    setReports(newReports);
    localStorage.setItem('hg_reports', JSON.stringify(newReports));
  };

  // CRUD Patient Profile
  const addPatient = (patient) => {
    const newPatients = [...patients, patient];
    savePatientsToStorage(newPatients);
    return { success: true };
  };

  const updatePatient = (id, updatedPatient) => {
    const newPatients = patients.map((p) => (p.id === id ? { ...p, ...updatedPatient } : p));
    savePatientsToStorage(newPatients);
    return { success: true };
  };

  const deletePatient = (id) => {
    // Remove patient profile
    const newPatients = patients.filter((p) => p.id !== id);
    savePatientsToStorage(newPatients);

    // Cascade delete visits for this patient
    const newVisits = visits.filter((v) => v.patientId !== id);
    saveVisitsToStorage(newVisits);

    // Cascade delete reports for this patient
    const newReports = reports.filter((r) => r.patientId !== id);
    saveReportsToStorage(newReports);

    return { success: true };
  };

  // CRUD Visits
  const addVisit = (visit) => {
    const newVisits = [...visits, visit];
    saveVisitsToStorage(newVisits);
    return { success: true };
  };

  const updateVisit = (visitId, patientId, updatedVisitData) => {
    const newVisits = visits.map((v) => 
      (v.visitId === visitId && v.patientId === patientId) ? { ...v, ...updatedVisitData } : v
    );
    saveVisitsToStorage(newVisits);
    return { success: true };
  };

  const deleteVisit = (visitId, patientId) => {
    // Filter out this visit
    const newVisits = visits.filter((v) => !(v.visitId === visitId && v.patientId === patientId));
    saveVisitsToStorage(newVisits);

    // Cascade delete any report associated with this specific patient visit
    const newReports = reports.filter((r) => !(r.patientId === patientId && r.visitId === visitId));
    saveReportsToStorage(newReports);

    return { success: true };
  };

  // CRUD Reports
  const saveReport = (report) => {
    const exists = reports.some(r => r.id === report.id);
    let newReports;
    if (exists) {
      newReports = reports.map(r => r.id === report.id ? report : r);
    } else {
      newReports = [report, ...reports];
    }
    saveReportsToStorage(newReports);
    return { success: true };
  };

  const deleteReport = (id) => {
    const newReports = reports.filter((r) => r.id !== id);
    saveReportsToStorage(newReports);
    return { success: true };
  };

  return (
    <PatientContext.Provider
      value={{
        patients,
        visits,
        reports,
        addPatient,
        updatePatient,
        deletePatient,
        addVisit,
        updateVisit,
        deleteVisit,
        saveReport,
        deleteReport
      }}
    >
      {children}
    </PatientContext.Provider>
  );
};
