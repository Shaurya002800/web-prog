import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldAlert, FileWarning, Eye } from 'lucide-react';
import ScamAlertCard from '../components/ScamAlertCard';
import PhishingAnalyzer from '../components/PhishingAnalyzer';
import styles from './Home.module.css';

const Home = () => {
  const [recentAlerts, setRecentAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5001/api/alerts')
      .then(res => res.json())
      .then(data => {
        setRecentAlerts(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load alerts:', err);
        setLoading(false);
      });
  }, []);

  return (
    <div className={styles.homeContainer}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroGrid}></div>
        <div className={styles.heroContent}>
          <div className={styles.badge}>
            <span className={styles.liveDot}></span>
            NATIONAL CYBER ALERT SYSTEM
          </div>
          
          <h1 className={styles.title}>
            ADAPTIVE.<br />
            RESILIENT.<br />
            <span className={styles.accentText}>REGENERATIVE.</span>
          </h1>
          
          <p className={styles.subtitle}>
            Empowering citizens to take bold actions against digital threats. 
            Report, track, and prevent cyber crimes in real-time.
          </p>
          
          <div className={styles.heroActions}>
            <Link to="/report" className="cyber-button">
              File a Complaint
            </Link>
            <Link to="/track" className={`cyber-button yellow`}>
              Track Status <ArrowRight size={18} className={styles.inlineIcon} />
            </Link>
          </div>
        </div>

        {/* Floating Stats / Features */}
        <div className={styles.features}>
          <div className={`${styles.featureCard} glass-panel`}>
             <ShieldAlert className={styles.featureIcon} />
             <h3>Secure Reporting</h3>
             <p>End-to-end encrypted submission of digital evidence.</p>
          </div>
          <div className={`${styles.featureCard} glass-panel`}>
             <Eye className={styles.featureIcon} />
             <h3>Live Tracking</h3>
             <p>Real-time updates on your complaint status.</p>
          </div>
          <div className={`${styles.featureCard} glass-panel`}>
             <FileWarning className={styles.featureIcon} />
             <h3>Threat Intelligence</h3>
             <p>Stay ahead with our live scam awareness database.</p>
          </div>
        </div>
      </section>

      {/* Phishing Analyzer Module */}
      <PhishingAnalyzer />

      {/* Recent Alerts Section */}
      <section className={styles.alertsSection}>
        <div className={styles.sectionHeader}>
          <h2><span className="glow-text-yellow">//</span> LIVE SCAM ALERTS</h2>
          <Link to="/analytics" className={styles.viewAllBtn}>
            View All Threats
          </Link>
        </div>
        
        <div className={styles.alertsGrid}>
          {loading ? (
             <p className="glow-text-yellow" style={{fontFamily: 'var(--font-mono)'}}>DECRYPTING ALERTS DATABASE...</p>
          ) : (
            recentAlerts.map(alert => (
              <ScamAlertCard key={alert.id} alert={alert} />
            ))
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
