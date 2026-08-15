import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Activity, 
  Home, 
  Hospital, 
  Users, 
  FileText, 
  MessageSquare,
  Star,
  User, 
  LogOut, 
  Menu, 
  X 
} from 'lucide-react';

const Navigation = () => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsOpen(false);
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <nav className="nav-container">
      <div className="nav-wrapper container">
        {/* Logo */}
        <Link to="/" className="nav-logo" onClick={closeMenu}>
          <Activity size={28} className="logo-icon" />
          <span className="logo-text">HealthGen <span className="logo-accent">AI</span></span>
        </Link>

        {/* Desktop Navigation */}
        {user && (
          <div className="nav-links desktop-only">
            <NavLink to="/home" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
              <Home size={18} /> Home
            </NavLink>
            <NavLink to="/hospitals" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
              <Hospital size={18} /> Hospitals
            </NavLink>
            <NavLink to="/patients" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
              <Users size={18} /> Patients
            </NavLink>
            <NavLink to="/generate" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
              <FileText size={18} /> Generate Report
            </NavLink>

            <NavLink to="/ai-assistant" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
              <MessageSquare size={18} /> AI Assistant
            </NavLink>
            <NavLink to="/feedback" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
              <Star size={18} /> Feedback
            </NavLink>
            <NavLink to="/profile" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
              <User size={18} /> Profile
            </NavLink>
            <button onClick={handleLogout} className="nav-item nav-logout-btn">
              <LogOut size={18} /> Logout
            </button>
          </div>
        )}

        {/* Mobile Hamburger Trigger */}
        {user ? (
          <button className="mobile-toggle mobile-only" onClick={toggleMenu} aria-label="Toggle Navigation">
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        ) : (
          <div className="mobile-only">
            <Link to="/login" className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>Login</Link>
          </div>
        )}
      </div>

      {/* Mobile Navigation Dropdown */}
      {user && isOpen && (
        <div className="mobile-menu mobile-only animate-fade-in">
          <div className="mobile-menu-wrapper container">
            <NavLink to="/home" className={({ isActive }) => isActive ? 'mobile-item active' : 'mobile-item'} onClick={closeMenu}>
              <Home size={20} /> Home
            </NavLink>
            <NavLink to="/hospitals" className={({ isActive }) => isActive ? 'mobile-item active' : 'mobile-item'} onClick={closeMenu}>
              <Hospital size={20} /> Hospitals
            </NavLink>
            <NavLink to="/patients" className={({ isActive }) => isActive ? 'mobile-item active' : 'mobile-item'} onClick={closeMenu}>
              <Users size={20} /> Patients
            </NavLink>
            <NavLink to="/generate" className={({ isActive }) => isActive ? 'mobile-item active' : 'mobile-item'} onClick={closeMenu}>
              <FileText size={20} /> Generate Report
            </NavLink>

            <NavLink to="/ai-assistant" className={({ isActive }) => isActive ? 'mobile-item active' : 'mobile-item'} onClick={closeMenu}>
              <MessageSquare size={20} /> AI Assistant
            </NavLink>
            <NavLink to="/feedback" className={({ isActive }) => isActive ? 'mobile-item active' : 'mobile-item'} onClick={closeMenu}>
              <Star size={20} /> Feedback
            </NavLink>
            <NavLink to="/profile" className={({ isActive }) => isActive ? 'mobile-item active' : 'mobile-item'} onClick={closeMenu}>
              <User size={20} /> Profile
            </NavLink>
            <button onClick={handleLogout} className="mobile-item mobile-logout-btn">
              <LogOut size={20} /> Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
