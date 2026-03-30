import React from 'react';
import { AlertTriangle, Clock, Activity } from 'lucide-react';
import styles from './ScamAlertCard.module.css';

interface ScamAlertProps {
  alert: {
    id: number;
    type: string;
    title: string;
    description: string;
    date: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
  };
}

const ScamAlertCard: React.FC<ScamAlertProps> = ({ alert }) => {
  return (
    <div className={`${styles.card} ${styles[alert.severity]}`}>
      <div className={styles.header}>
        <div className={styles.typeBadge}>
           <Activity size={14} />
           {alert.type}
        </div>
        <div className={styles.timeBadge}>
           <Clock size={12} />
           {alert.date}
        </div>
      </div>
      
      <h3 className={styles.title}>
        <AlertTriangle size={18} className={styles.alertIcon} />
        {alert.title}
      </h3>
      
      <p className={styles.description}>
        {alert.description}
      </p>
      
      <div className={styles.footer}>
        <button className={styles.readMoreBtn}>Review Details</button>
      </div>
    </div>
  );
};

export default ScamAlertCard;
