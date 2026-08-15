import React, { createContext, useContext, useState, useEffect } from 'react';

const HospitalContext = createContext();

export const useHospital = () => useContext(HospitalContext);

const MOCK_HOSPITALS = [
  {
    id: 'H001',
    name: 'Metro General Hospital',
    location: 'Downtown City',
    departments: ['Cardiology', 'Emergency', 'Pediatrics', 'Internal Medicine', 'Neurology', 'Orthopedics'],
    contact: '+1 (555) 019-2831',
    rating: '4.8',
    image: '🏥'
  },
  {
    id: 'H002',
    name: 'Green Valley Medical Clinic',
    location: 'North Suburbs',
    departments: ['Family Medicine', 'Pediatrics', 'Orthopedics', 'Dermatology'],
    contact: '+1 (555) 014-9988',
    rating: '4.5',
    image: '🩺'
  },
  {
    id: 'H003',
    name: 'St. Jude Specialty Hospital',
    location: 'West District',
    departments: ['Cardiology', 'Emergency', 'Radiology', 'Neurology', 'Oncology'],
    contact: '+1 (555) 017-4422',
    rating: '4.9',
    image: '🏢'
  },
  {
    id: 'H004',
    name: 'Pine Crest Rehabilitation Center',
    location: 'East Valley',
    departments: ['Neurology', 'Orthopedics', 'Psychiatry', 'Rehabilitation'],
    contact: '+1 (555) 012-7711',
    rating: '4.6',
    image: '🏠'
  },
  {
    id: 'H005',
    name: 'City Children Health Center',
    location: 'Medical District',
    departments: ['Pediatrics', 'Allergy & Immunology', 'Pediatric Neurology', 'Emergency'],
    contact: '+1 (555) 018-3355',
    rating: '4.7',
    image: '👶'
  }
];

export const HospitalProvider = ({ children }) => {
  const [hospitals] = useState(MOCK_HOSPITALS);
  const [selectedHospital, setSelectedHospital] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem('hg_selected_hospital');
    if (saved) {
      try {
        setSelectedHospital(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse active hospital', e);
        localStorage.removeItem('hg_selected_hospital');
      }
    }
  }, []);

  const selectHospital = (hospital) => {
    setSelectedHospital(hospital);
    if (hospital) {
      localStorage.setItem('hg_selected_hospital', JSON.stringify(hospital));
    } else {
      localStorage.removeItem('hg_selected_hospital');
    }
  };

  return (
    <HospitalContext.Provider value={{ hospitals, selectedHospital, selectHospital }}>
      {children}
    </HospitalContext.Provider>
  );
};
