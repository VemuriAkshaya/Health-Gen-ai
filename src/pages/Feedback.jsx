import React, { useState } from 'react';
import { Star, CheckCircle, MessageSquare, Send, Calendar } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Feedback = () => {
  const { user } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [message, setMessage] = useState('');
  
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (rating === 0) {
      setError('Please select a star rating (1 to 5 stars) before submitting.');
      return;
    }

    if (!name || !email || !message) {
      setError('Please complete all form fields.');
      return;
    }

    const feedbackEntry = {
      id: Date.now(),
      name,
      email,
      rating,
      message,
      date: new Date().toLocaleDateString()
    };

    // Save to localStorage
    try {
      const existing = localStorage.getItem('hg_feedbacks');
      let list = [];
      if (existing) {
        list = JSON.parse(existing);
      }
      list.unshift(feedbackEntry);
      localStorage.setItem('hg_feedbacks', JSON.stringify(list));
      
      setSubmitted(true);
      // Reset form
      setMessage('');
      setRating(0);
    } catch (e) {
      console.error('Failed to save feedback to localStorage', e);
      setError('Failed to record feedback database. Please try again.');
    }
  };

  const handleRatingClick = (val) => {
    setRating(val);
  };

  const handleRatingHover = (val) => {
    setHoverRating(val);
  };

  return (
    <div className="feedback-page container animate-fade-in" style={{ padding: '3rem 0', maxWidth: '600px' }}>
      
      <div style={{ marginBottom: '2.5rem', textAlign: 'center' }}>
        <span className="badge badge-primary" style={{ marginBottom: '0.75rem' }}>Quality Assurance</span>
        <h2 style={{ fontSize: '2.2rem', marginBottom: '0.5rem' }}>Portal Feedback</h2>
        <p style={{ color: 'var(--text-muted)' }}>Help us optimize clinical AI tools by logging your interface experiences and reviews</p>
      </div>

      <div className="card">
        {submitted ? (
          /* Success Screen */
          <div style={{ textAlign: 'center', padding: '2rem 1rem' }} className="animate-fade-in">
            <div style={{ display: 'inline-flex', padding: '1rem', borderRadius: '50%', backgroundColor: 'var(--primary-light)', color: 'var(--primary-color)', marginBottom: '1.5rem' }}>
              <CheckCircle size={48} />
            </div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.75rem', color: 'var(--primary-dark)' }}>Feedback Submitted</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '0.95rem' }}>
              Thank you for sharing your thoughts. Your feedback has been recorded in the local database registry.
            </p>
            <button 
              onClick={() => setSubmitted(false)} 
              className="btn btn-primary"
            >
              Submit Another Review
            </button>
          </div>
        ) : (
          /* Form Screen */
          <form onSubmit={handleSubmit}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <MessageSquare size={20} style={{ color: 'var(--primary-color)' }} />
              <span>Submit Portal Review</span>
            </h3>

            {error && (
              <div style={{ display: 'flex', gap: '0.5rem', backgroundColor: 'var(--danger-light)', border: '1px solid #fee2e2', color: 'var(--danger-color)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', fontSize: '0.875rem', alignItems: 'center', fontWeight: '500' }}>
                <CheckCircle size={18} style={{ color: 'var(--danger-color)' }} />
                <span>{error}</span>
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }} className="grid-2">
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  required 
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email Address *</label>
                <input 
                  type="email" 
                  className="form-input" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  required 
                />
              </div>
            </div>

            {/* Interactive Stars */}
            <div className="form-group" style={{ margin: '1rem 0 2rem 0', textAlign: 'center' }}>
              <label className="form-label" style={{ marginBottom: '0.75rem' }}>Rate your Experience *</label>
              
              <div 
                style={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  gap: '0.5rem',
                  padding: '0.5rem',
                  backgroundColor: 'var(--bg-primary)',
                  borderRadius: 'var(--radius-md)'
                }}
                onMouseLeave={() => handleRatingHover(0)}
              >
                {[1, 2, 3, 4, 5].map((index) => {
                  const isHighlighted = (hoverRating || rating) >= index;
                  return (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleRatingClick(index)}
                      onMouseEnter={() => handleRatingHover(index)}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: isHighlighted ? '#eab308' : 'var(--text-light)',
                        transition: 'transform 0.15s ease'
                      }}
                      className="star-btn-hover"
                    >
                      <Star 
                        size={36} 
                        fill={isHighlighted ? '#eab308' : 'none'} 
                        strokeWidth={2}
                      />
                    </button>
                  );
                })}
              </div>
              
              {rating > 0 && (
                <div style={{ fontSize: '0.85rem', color: 'var(--primary-color)', fontWeight: 'bold', marginTop: '0.5rem' }}>
                  Selected: {rating} out of 5 stars
                </div>
              )}
            </div>

            {/* Feedback Message */}
            <div className="form-group">
              <label className="form-label">Feedback Message *</label>
              <textarea
                className="form-textarea"
                placeholder="Share your experience using the AI Assistant, Patient management, or report options..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
              />
            </div>

            <button 
              type="submit" 
              className="btn btn-primary"
              style={{ width: '100%', gap: '0.5rem', padding: '0.85rem' }}
            >
              <Send size={18} /> Submit Review
            </button>
          </form>
        )}
      </div>

    </div>
  );
};

export default Feedback;
