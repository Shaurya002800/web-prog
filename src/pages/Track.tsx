import React, { useState } from 'react';
import { Search, Loader, ShieldCheck, Clock, CheckCircle } from 'lucide-react';
import styles from './Track.module.css';

const Track = () => {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [result, setResult] = useState<null | any>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query) return;

    setIsSearching(true);
    setResult(null);

    try {
      const res = await fetch(`http://localhost:5001/api/complaints/${query}`);
      if (!res.ok) {
        throw new Error('Complaint not found');
      }
      const data = await res.json();
      
      setResult({
        id: data.id,
        status: data.status,
        date: new Date(data.createdAt).toLocaleDateString(),
        category: data.category,
        assignedTo: 'Cyber Cell - Unit Alpha' // Mocking assignee as it's not in DB yet
      });
    } catch (err) {
      alert('Complaint ID not found or server error.');
    } finally {
      setIsSearching(false);
    }
  };

  const timelineSteps = [
    { id: 'filed', label: 'Report Filed', icon: <CheckCircle size={24} /> },
    { id: 'review', label: 'Under Review', icon: <Clock size={24} /> },
    { id: 'action', label: 'Action Taken', icon: <ShieldCheck size={24} /> },
    { id: 'resolved', label: 'Issue Resolved', icon: <CheckCircle size={24} /> }
  ];

  const getStepStatus = (stepId: string, currentStatus: string) => {
    const statuses = ['filed', 'review', 'action', 'resolved'];
    const currentIndex = statuses.indexOf(currentStatus);
    const stepIndex = statuses.indexOf(stepId);

    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'active';
    return 'pending';
  };

  return (
    <div className={styles.trackWrapper}>
      <div className={styles.radarBackground}>
        <div className={styles.radarGrid}></div>
        <div className={styles.radarRings}></div>
      </div>
      <div className={styles.trackContainer}>
        <header className={styles.header}>
        <h1>TRACK <span className="glow-text-yellow">COMPLAINT</span></h1>
        <p className={styles.subtext}>Enter your 9-character Complaint Reference ID below to check the real-time status of your report.</p>
      </header>

      <div className={styles.searchSection}>
        <form onSubmit={handleSearch} className={styles.searchForm}>
          <div className={styles.inputWrapper}>
            <Search className={styles.searchIcon} size={20} />
            <input 
              type="text" 
              placeholder="e.g. CYB-123456" 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className={styles.searchInput}
            />
          </div>
          <button type="submit" className="cyber-button yellow" disabled={isSearching || !query}>
            {isSearching ? 'SEARCHING NODE...' : 'TRACK STATUS'}
          </button>
        </form>
      </div>

      {isSearching && (
        <div className={styles.loaderContainer}>
          <Loader className={styles.spinner} size={48} />
          <p>Decrypting records...</p>
        </div>
      )}

      {result && (
        <div className={`${styles.resultCard} glass-panel`}>
          <div className={styles.resultHeader}>
            <div className={styles.idBadge}>ID: {result.id}</div>
            <div className={styles.metaData}>
              <span>Filed: {result.date}</span>
              <span className={styles.divider}>|</span>
              <span>{result.assignedTo}</span>
            </div>
          </div>

          <div className={styles.timelineContainer}>
            {timelineSteps.map((step, index) => {
              const status = getStepStatus(step.id, result.status);
              
              return (
                <div key={step.id} className={`${styles.timelineStep} ${styles[status]}`}>
                  <div className={styles.stepIconWrapper}>
                    {step.icon}
                  </div>
                  <div className={styles.stepContent}>
                    <h3>{step.label}</h3>
                    {status === 'active' && <p className={styles.activeText}>Current Stage</p>}
                  </div>
                  {index < timelineSteps.length - 1 && (
                    <div className={styles.connector}></div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default Track;
