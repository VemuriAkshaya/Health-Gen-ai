import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Activity, ShieldAlert, CornerDownLeft } from 'lucide-react';

const AIAssistant = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      text: 'Hello, I am the HealthGen Clinical AI Assistant. How can I assist you with clinical guidelines, symptom reviews, or diagnostic pathways today?',
      time: 'Just now'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  // Auto scroll to chat end
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMessage = {
      id: Date.now(),
      sender: 'user',
      text: inputText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Mock AI response latency
    setTimeout(() => {
      const responseText = getMockResponse(userMessage.text);
      const aiMessage = {
        id: Date.now() + 1,
        sender: 'ai',
        text: responseText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1000);
  };

  // Mock AI keyword matching rules
  const getMockResponse = (query) => {
    const text = query.toLowerCase();

    if (text.includes('fever') || text.includes('pyrexia') || text.includes('temperature') || text.includes('headache')) {
      return `For patients presenting with Fever / Pyrexia accompanied by Headache, clinical guidelines recommend:
1. Monitoring body temperature every 4 hours.
2. Promoting oral hydration (2.5L - 3L daily of water or oral rehydration salts).
3. Recommending antipyretics (e.g. Paracetamol 500mg, max 4g daily) if pyrexia is above 38.5°C.
4. Warning Signs: If fever persists beyond 3-4 days, or is accompanied by neck stiffness (nuchal rigidity), photophobia, or altered mental states, immediately refer for urgent CSF/blood work to rule out meningitis.`;
    }

    if (text.includes('cough') || text.includes('breath') || text.includes('shortness') || text.includes('chest')) {
      return `For presentations of Cough / Dyspnea / Chest Discomfort:
1. Assess breathing rate and inspect for accessory muscle use.
2. Monitor peripheral oxygen saturation (SpO2). SpO2 < 93% indicates potential hypoxemia.
3. Bronchodilators (e.g., Albuterol/Salbutamol inhalers, 2 puffs every 4 hours PRN) should be reviewed if expiratory wheezing or an asthma history is present.
4. Warn the patient to seek emergency care if they experience blue lips (cyanosis), severe chest pain radiating to the jaw/arm, or difficulty speaking in full sentences.`;
    }

    if (text.includes('stomach') || text.includes('nausea') || text.includes('vomit') || text.includes('abdomen')) {
      return `For Gastric Pain / Nausea presentation guidelines:
1. Confirm localization of pain. Epigastric discomfort is common in GERD or gastritis. Lower right quadrant pain requires palpating for McBurney's sign to rule out appendicitis.
2. Recommend a absolute bland diet (no spices, acids, caffeine, or NSAIDs).
3. If GERD is suspected, recommend remaining upright for 3 hours post-meals and H2-receptor antagonists or proton-pump inhibitors (Omeprazole 20mg).
4. Warning: If vomit contains blood (hematemesis), looks like coffee grounds, or if the abdomen feels rigid/board-like, direct to the surgical ER immediately.`;
    }

    if (text.includes('back') || text.includes('weakness') || text.includes('spine') || text.includes('disc')) {
      return `For Lumbar Strain / Back Pain / Disc Herniation issues:
1. Advise the patient to avoid bed rest for longer than 24 hours. Encourage gentle activity and regular walking.
2. Warm compress intervals (15 mins) help relieve localized muscle spasms.
3. Incorporate NSAIDs (e.g. Ibuprofen 400mg) for anti-inflammatory support, ensuring no history of renal or gastric ulcers.
4. Severe sign check: Evaluate for saddle anesthesia (numbness in the groin) or bladder/bowel incontinence. If present, refer immediately for MRI to rule out Cauda Equina Syndrome (emergency surgical decompression).`;
    }

    if (text.includes('help') || text.includes('assist') || text.includes('what can you do')) {
      return `I can assist you with clinical guidelines for common medical cases:
• Fever & Headaches
• Respiratory symptoms (cough, shortness of breath)
• Epigastric problems (stomach pain, nausea)
• Spine/skeletal discomfort (back pain, muscle weakness)

Just type in your diagnostic question or symptoms to begin!`;
    }

    if (text.includes('hello') || text.includes('hi') || text.includes('hey')) {
      return 'Hello! I am ready to review clinical vitals and assist with diagnostic guidelines. What symptoms or patient histories would you like to review? (e.g. try typing "Fever guidelines" or "Shortness of breath")';
    }

    return `Clinical AI Assistant note: I received your query regarding "${query}". 

For general symptoms, advise the patient to maintain light activity, rest, and report any progress changes. Ensure a comprehensive history check is completed, including medications, allergies, and contraindications.

If you have specific symptom metrics (like fever, cough, stomach pain, back strain), please state them so I can supply targeted diagnostic recommendations.`;
  };

  return (
    <div className="ai-assistant-page container animate-fade-in" style={{ padding: '2rem 0', display: 'flex', justifyContent: 'center' }}>
      <div className="card accented" style={{ width: '100%', maxWidth: '800px', display: 'flex', flexDirection: 'column', height: '620px', padding: '1.5rem' }}>
        
        {/* Chat Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ padding: '0.5rem', borderRadius: '50%', backgroundColor: 'var(--primary-light)', color: 'var(--primary-color)' }}>
              <Activity size={24} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', color: 'var(--primary-dark)', marginBottom: '0.15rem' }}>HealthGen Clinical AI Assistant</h3>
              <span className="badge badge-primary" style={{ fontSize: '0.7rem', padding: '0.15rem 0.5rem' }}>Offline Prototype Helper</span>
            </div>
          </div>
          <div className="desktop-only" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
            <ShieldAlert size={14} /> Medical guidelines database loaded
          </div>
        </div>

        {/* Message Logs */}
        <div style={{ flex: '1', overflowY: 'auto', padding: '0.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-primary)' }}>
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div 
                key={msg.id} 
                style={{ 
                  display: 'flex', 
                  justifyContent: isUser ? 'flex-end' : 'flex-start',
                  width: '100%'
                }}
              >
                <div 
                  style={{ 
                    maxWidth: '80%', 
                    padding: '1rem 1.25rem', 
                    borderRadius: 'var(--radius-md)', 
                    backgroundColor: isUser ? 'var(--primary-color)' : 'var(--bg-secondary)', 
                    color: isUser ? 'white' : 'var(--text-main)',
                    boxShadow: 'var(--shadow-sm)',
                    border: isUser ? 'none' : '1px solid var(--border-color)',
                    whiteSpace: 'pre-line',
                    fontSize: '0.925rem',
                    lineHeight: '1.5'
                  }}
                >
                  {msg.text}
                  <div style={{ textAlign: 'right', fontSize: '0.7rem', marginTop: '0.5rem', opacity: '0.7', color: isUser ? 'white' : 'var(--text-light)' }}>
                    {msg.time}
                  </div>
                </div>
              </div>
            );
          })}
          
          {/* AI Typing Indicator */}
          {isTyping && (
            <div style={{ display: 'flex', justifyContent: 'flex-start', width: '100%' }}>
              <div style={{ padding: '0.75rem 1.25rem', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '500' }}>AI is thinking</span>
                <span className="animate-pulse-slow" style={{ color: 'var(--primary-color)', fontSize: '1.2rem', lineHeight: '0' }}>&bull;&bull;&bull;</span>
              </div>
            </div>
          )}
          
          <div ref={chatEndRef} />
        </div>

        {/* Form Input */}
        <form onSubmit={handleSend} style={{ display: 'flex', gap: '0.5rem' }}>
          <div style={{ position: 'relative', flex: '1' }}>
            <input 
              type="text" 
              className="form-input" 
              style={{ paddingRight: '50px' }}
              placeholder="Ask guidelines... e.g. 'fever guide', 'asthma symptoms'" 
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              disabled={isTyping}
            />
            <div className="desktop-only" style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--text-light)', fontSize: '0.75rem', pointerEvents: 'none' }}>
              <span>Enter</span> <CornerDownLeft size={10} />
            </div>
          </div>
          <button 
            type="submit" 
            className="btn btn-primary"
            style={{ padding: '0 1.5rem' }}
            disabled={isTyping || !inputText.trim()}
          >
            <Send size={18} />
          </button>
        </form>

      </div>
    </div>
  );
};

export default AIAssistant;
