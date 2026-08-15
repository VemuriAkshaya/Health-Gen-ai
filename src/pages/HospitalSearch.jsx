import React, { useState, useMemo } from 'react';
import { useHospital } from '../context/HospitalContext';
import { Search, MapPin, Building, Star, Phone, CheckCircle, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HospitalSearch = () => {
  const { hospitals, selectedHospital, selectHospital } = useHospital();
  const [searchQuery, setSearchQuery] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [deptFilter, setDeptFilter] = useState('');
  const navigate = useNavigate();

  // Extract unique locations and departments for filtering
  const locations = useMemo(() => {
    return [...new Set(hospitals.map(h => h.location.split(' ')[1] || h.location))];
  }, [hospitals]);

  const departments = useMemo(() => {
    const depts = new Set();
    hospitals.forEach(h => h.departments.forEach(d => depts.add(d)));
    return [...depts];
  }, [hospitals]);

  // Filter hospitals based on user input
  const filteredHospitals = useMemo(() => {
    // 1. Get standard matching hospitals
    const results = hospitals.filter((h) => {
      const matchesSearch = h.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesLocation = locationFilter === '' || h.location.includes(locationFilter);
      const matchesDept = deptFilter === '' || h.departments.includes(deptFilter);
      return matchesSearch && matchesLocation && matchesDept;
    });

    // 2. If searchQuery is active and doesn't exactly match any existing hospital name,
    // dynamically add a searched hospital matching the query name!
    const queryClean = searchQuery.trim();
    if (queryClean.length > 0) {
      const exactMatchExists = hospitals.some(
        (h) => h.name.toLowerCase() === queryClean.toLowerCase()
      );
      if (!exactMatchExists) {
        const dynamicHospital = {
          id: `H-DYN-${queryClean.replace(/\s+/g, '-').toUpperCase()}`,
          name: queryClean,
          location: locationFilter ? `${locationFilter} Region` : 'Local District',
          departments: deptFilter ? [deptFilter, 'General Medicine'] : ['General Medicine', 'Emergency', 'Outpatient Care'],
          contact: '+1 (555) 099-0000 (Mock Search)',
          rating: '4.7',
          image: '🏥',
          isDynamic: true
        };
        results.push(dynamicHospital);
      }
    }

    return results;
  }, [hospitals, searchQuery, locationFilter, deptFilter]);

  const handleSelect = (hospital) => {
    selectHospital(hospital);
  };

  return (
    <div className="hospital-search-page container animate-fade-in" style={{ padding: '2rem 0' }}>
      <div style={{ marginBottom: '2.5rem', textAlign: 'center' }}>
        <span className="badge badge-primary" style={{ marginBottom: '0.75rem' }}>Step 1: Hospital Affiliation</span>
        <h2 style={{ fontSize: '2.2rem', marginBottom: '0.5rem' }}>Affiliated Clinic Network</h2>
        <p style={{ color: 'var(--text-muted)' }}>Choose an admission facility to begin recording patient case history and generating reports</p>
      </div>

      {/* Filters Panel */}
      <div className="card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '1rem' }} className="grid-responsive-dash">
          
          {/* Search Box */}
          <div style={{ position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
            <input 
              type="text" 
              className="form-input" 
              style={{ paddingLeft: '40px' }}
              placeholder="Search hospitals by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Location Dropdown */}
          <div>
            <select 
              className="form-select"
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
            >
              <option value="">All Regions</option>
              {locations.map(loc => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
          </div>

          {/* Department Dropdown */}
          <div>
            <select 
              className="form-select"
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
            >
              <option value="">All Specialty Departments</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>

        </div>
      </div>

      {/* Hospital Grid */}
      {filteredHospitals.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '4rem 1rem' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>No hospitals found matching your filters.</p>
          <button 
            className="btn btn-outline" 
            style={{ marginTop: '1rem' }}
            onClick={() => { setSearchQuery(''); setLocationFilter(''); setDeptFilter(''); }}
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid-3">
          {filteredHospitals.map((hospital) => {
            const isSelected = selectedHospital?.id === hospital.id;
            return (
              <div 
                key={hospital.id} 
                className={`card ${isSelected ? 'accented' : ''}`}
                style={{ 
                  borderColor: isSelected ? 'var(--primary-color)' : 'var(--border-color)',
                  boxShadow: isSelected ? 'var(--shadow-lg)' : 'var(--shadow-md)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div className="flex-between" style={{ marginBottom: '1rem' }}>
                    <div style={{ fontSize: '2.5rem' }}>{hospital.image}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#eab308', fontWeight: '600' }}>
                      <Star size={16} fill="#eab308" /> {hospital.rating}
                    </div>
                  </div>

                  <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: 'var(--primary-dark)' }}>{hospital.name}</h3>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                    <MapPin size={14} /> {hospital.location}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1rem' }}>
                    <Phone size={14} /> {hospital.contact}
                  </div>

                  {/* Specialty Badges */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1.5rem' }}>
                    {hospital.departments.map(dept => (
                      <span key={dept} className="badge badge-primary" style={{ fontSize: '0.7rem' }}>
                        {dept}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  {isSelected ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', color: 'var(--primary-color)', fontWeight: 'bold', fontSize: '0.95rem', padding: '0.75rem', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--primary-light)' }}>
                        <CheckCircle size={18} /> Selected Affiliation
                      </div>
                      <button 
                        onClick={() => navigate('/patients')} 
                        className="btn btn-outline" 
                        style={{ width: '100%' }}
                      >
                        Register Patients <ArrowRight size={16} />
                      </button>
                    </div>
                  ) : (
                    <button 
                      onClick={() => handleSelect(hospital)} 
                      className="btn btn-primary" 
                      style={{ width: '100%' }}
                    >
                      Select Hospital
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default HospitalSearch;
