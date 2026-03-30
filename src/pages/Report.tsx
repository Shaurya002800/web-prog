import React, { useState, useRef } from 'react';
import { Upload, AlertCircle, CheckCircle, File, X, ArrowRight, ArrowLeft } from 'lucide-react';
import styles from './Report.module.css';

const Report = () => {
  const [step, setStep] = useState(1);
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [evidence, setEvidence] = useState<{file: File, preview: string} | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [complaintId, setComplaintId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const categories = [
    'Phishing & Malicious Links',
    'UPI / Online Payment Fraud',
    'Identity Theft / Impersonation',
    'Crypto Scam',
    'Ransomware Attack',
    'Other Cyber Crime'
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const preview = URL.createObjectURL(file);
      setEvidence({ file, preview });
    }
  };

  const removeEvidence = () => {
    if (evidence?.preview) URL.revokeObjectURL(evidence.preview);
    setEvidence(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const formData = new FormData();
      formData.append('category', category);
      formData.append('description', description);
      if (evidence?.file) {
        formData.append('evidence', evidence.file);
      }

      const res = await fetch('http://localhost:5001/api/complaints', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error('Submission failed');

      const data = await res.json();
      setComplaintId(data.complaintId);
      setStep(4);
    } catch (err) {
      console.error(err);
      alert('Error submitting report. Please verify connection to server.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentProgress = (step / 3) * 100;

  return (
    <div className={styles.reportContainer}>
      <header className={styles.header}>
        <div className={styles.warningBadge}>
          <AlertCircle size={16} />
          <span>Filing a false report is a punishable offense</span>
        </div>
        <h1>FILE A <span className="glow-text-yellow">CYBER COMPLAINT</span></h1>
        <p className={styles.subtext}>Our threat response team will analyze your report and initiate necessary action within 24 hours.</p>
      </header>

      {step < 4 && (
        <div className={styles.progressBarContainer}>
          <div className={styles.progressBar} style={{ width: `${currentProgress}%` }}></div>
        </div>
      )}

      <div className={`${styles.formCard} glass-panel`}>
        {step === 1 && (
          <div className={styles.stepContainer}>
            <h2>1. Select Incident Category</h2>
            <div className={styles.categoryGrid}>
              {categories.map((cat) => (
                <button
                  key={cat}
                  className={`${styles.categoryBtn} ${category === cat ? styles.selected : ''}`}
                  onClick={() => setCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
            <div className={styles.stepActions}>
              <div />
              <button 
                className="cyber-button" 
                onClick={() => setStep(2)}
                disabled={!category}
              >
                Next Step <ArrowRight size={16} className={styles.iconMargin} />
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className={styles.stepContainer}>
            <h2>2. Incident Details</h2>
            <div className={styles.formGroup}>
              <label>Description of the Incident</label>
              <textarea 
                className={styles.textarea} 
                rows={6}
                placeholder="Please describe exactly what happened. Include dates, times, and specific details."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div className={styles.stepActions}>
              <button className={styles.textBtn} onClick={() => setStep(1)}>
                <ArrowLeft size={16} /> Back
              </button>
              <button 
                className="cyber-button" 
                onClick={() => setStep(3)}
                disabled={description.length < 20}
              >
                Next Step <ArrowRight size={16} className={styles.iconMargin} />
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className={styles.stepContainer}>
            <h2>3. Evidence Upload</h2>
            <p className={styles.helpText}>Upload screenshots, emails, or transaction receipts that serve as proof.</p>
            
            <div 
              className={styles.uploadArea}
              onClick={() => !evidence && fileInputRef.current?.click()}
            >
              <input 
                type="file" 
                ref={fileInputRef} 
                className={styles.hiddenInput}
                onChange={handleFileChange}
                accept="image/*,application/pdf"
              />
              
              {!evidence ? (
                <div className={styles.uploadPrompt}>
                  <Upload size={48} className={styles.uploadIcon} />
                  <p>Click or drag file to upload</p>
                  <span>PNG, JPG, PDF up to 10MB</span>
                </div>
              ) : (
                <div className={styles.evidencePreview}>
                  {evidence.file.type.startsWith('image/') ? (
                    <img src={evidence.preview} alt="Evidence" className={styles.previewImage} />
                  ) : (
                    <div className={styles.fileIconPreview}>
                      <File size={48} />
                      <span>{evidence.file.name}</span>
                    </div>
                  )}
                  <button className={styles.removeBtn} onClick={(e) => { e.stopPropagation(); removeEvidence(); }}>
                    <X size={16} /> Remove
                  </button>
                </div>
              )}
            </div>

            <div className={styles.stepActions}>
              <button className={styles.textBtn} onClick={() => setStep(2)}>
                <ArrowLeft size={16} /> Back
              </button>
              <button 
                className={`cyber-button ${isSubmitting ? styles.loading : ''}`} 
                onClick={handleSubmit}
                disabled={!evidence || isSubmitting}
              >
                {isSubmitting ? 'ENCRYPTING & SUBMITTING...' : 'SUBMIT REPORT'}
              </button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className={styles.successState}>
            <div className={styles.successIconWrapper}>
              <CheckCircle size={64} className={styles.successIcon} />
            </div>
            <h2>REPORT FILED SUCCESSFULLY</h2>
            <p>Your incident has been recorded and encrypted.</p>
            
            <div className={styles.idBox}>
              <span>Complaint Reference ID</span>
              <div className={styles.refId}>{complaintId}</div>
            </div>
            
            <p className={styles.warningText}>
              Please save this ID. You will need it to track your complaint status.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Report;
