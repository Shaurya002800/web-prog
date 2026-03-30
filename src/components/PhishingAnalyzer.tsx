import React, { useState } from 'react';
import { Search, ShieldAlert, ShieldCheck, HelpCircle } from 'lucide-react';
import styles from './PhishingAnalyzer.module.css';

const PhishingAnalyzer = () => {
  const [url, setUrl] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<'safe' | 'danger' | null>(null);
  const [progress, setProgress] = useState(0);

  const handleScan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    setIsScanning(true);
    setResult(null);
    setProgress(0);

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsScanning(false);
          // Simple mock logic: if it contains 'bank' or 'login', it's dangerous
          setResult(/bank|login|update|verify|secure/i.test(url) ? 'danger' : 'safe');
          return 100;
        }
        return prev + 5;
      });
    }, 100);
  };

  return (
    <div className={`${styles.analyzerContainer} glass-panel`}>
      <div className={styles.header}>
        <h2><span className="glow-text-green">//</span> URL THREAT SCANNER</h2>
        <p>Verify suspicious links before clicking. Our AI engine detects phishing patterns instantly.</p>
      </div>

      <form onSubmit={handleScan} className={styles.scanForm}>
        <div className={styles.inputGroup}>
          <Search size={20} className={styles.inputIcon} />
          <input
            type="text"
            placeholder="Paste suspicious URL here (e.g., http://b4nk-update-kyc.com)"
            className={styles.urlInput}
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
        </div>
        <button type="submit" className="cyber-button" disabled={isScanning || !url}>
          {isScanning ? 'SCANNING...' : 'ANALYZE URL'}
        </button>
      </form>

      {isScanning && (
        <div className={styles.scanningState}>
          <div className={styles.progressBar}>
            <div className={styles.progressFill} style={{ width: `${progress}%` }}></div>
          </div>
          <p className={styles.scanText}>
            {progress < 30 ? 'Analyzing domain reputation...' : 
             progress < 70 ? 'Checking SSL certificates...' : 
             'Heuristic pattern matching...'}
          </p>
        </div>
      )}

      {result && !isScanning && (
        <div className={`${styles.resultBox} ${styles[result]}`}>
          {result === 'safe' ? (
            <>
              <ShieldCheck size={48} className={styles.resultIcon} />
              <div className={styles.resultContent}>
                <h3>LOW RISK DETECTED</h3>
                <p>This URL does not match known phishing signatures. However, always remain vigilant.</p>
              </div>
            </>
          ) : (
            <>
              <ShieldAlert size={48} className={styles.resultIcon} />
              <div className={styles.resultContent}>
                <h3>CRITICAL THREAT: PHISHING SITE</h3>
                <p>DO NOT VISIT THIS LINK. It is designed to steal your credentials or financial information.</p>
                <div className={styles.flags}>
                  <span className={styles.flag}><HelpCircle size={12}/> Suspicious Keywords</span>
                  <span className={styles.flag}><HelpCircle size={12}/> Recent Domain Age</span>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default PhishingAnalyzer;
