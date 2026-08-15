import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Context Providers
import { AuthProvider } from './context/AuthContext';
import { HospitalProvider } from './context/HospitalContext';
import { PatientProvider } from './context/PatientContext';

// Layout Components
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Page Components
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import HospitalSearch from './pages/HospitalSearch';
import PatientManagement from './pages/PatientManagement';
import GenerateReport from './pages/GenerateReport';
import Reports from './pages/Reports';
import AIAssistant from './pages/AIAssistant';
import Feedback from './pages/Feedback';
import Profile from './pages/Profile';

function App() {
  return (
    <AuthProvider>
      <HospitalProvider>
        <PatientProvider>
          <Router>
            {/* Top Navigation */}
            <Navigation />
            
            {/* Main Application Routes */}
            <main className="main-content">
              <Routes>
                {/* Public Route */}
                <Route path="/login" element={<Login />} />
                
                {/* Protected Routes */}
                <Route path="/home" element={
                  <ProtectedRoute>
                    <Home />
                  </ProtectedRoute>
                } />
                
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } />
                
                <Route path="/hospitals" element={
                  <ProtectedRoute>
                    <HospitalSearch />
                  </ProtectedRoute>
                } />
                
                <Route path="/patients" element={
                  <ProtectedRoute>
                    <PatientManagement />
                  </ProtectedRoute>
                } />
                
                <Route path="/generate" element={
                  <ProtectedRoute>
                    <GenerateReport />
                  </ProtectedRoute>
                } />
                
                <Route path="/reports" element={
                  <ProtectedRoute>
                    <Reports />
                  </ProtectedRoute>
                } />

                <Route path="/ai-assistant" element={
                  <ProtectedRoute>
                    <AIAssistant />
                  </ProtectedRoute>
                } />

                <Route path="/feedback" element={
                  <ProtectedRoute>
                    <Feedback />
                  </ProtectedRoute>
                } />
                
                <Route path="/profile" element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } />

                {/* Redirects */}
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </main>

            {/* Bottom Footer with Disclaimer */}
            <Footer />
          </Router>
        </PatientProvider>
      </HospitalProvider>
    </AuthProvider>
  );
}

export default App;
