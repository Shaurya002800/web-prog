import { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement,
  Filler
} from 'chart.js';
import { Line, Doughnut, Bar } from 'react-chartjs-2';
import { TrendingUp, ShieldAlert, Activity, Users } from 'lucide-react';
import styles from './Dashboard.module.css';

// Register ChartJS modules
ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement,
  BarElement, ArcElement, Title, Tooltip, Legend, Filler
);

const Dashboard = () => {
  const [timeframe, setTimeframe] = useState('7d');
  const [themeColors, setThemeColors] = useState({
    bg: '#050505',
    text: '#ffffff',
    textMuted: '#666666',
    border: '#222222',
    accent: '#00ff41',
    accentDim: 'rgba(0, 255, 65, 0.1)',
    secondary: '#d6ff00'
  });

  useEffect(() => {
    const updateTheme = () => {
      const rs = getComputedStyle(document.documentElement);
      setThemeColors({
        bg: rs.getPropertyValue('--bg-primary').trim() || '#050505',
        text: rs.getPropertyValue('--text-primary').trim() || '#ffffff',
        textMuted: rs.getPropertyValue('--text-muted').trim() || '#666666',
        border: rs.getPropertyValue('--border-color').trim() || '#222222',
        accent: rs.getPropertyValue('--accent-primary').trim() || '#00ff41',
        accentDim: rs.getPropertyValue('--accent-primary-dim').trim() || 'rgba(0, 255, 65, 0.1)',
        secondary: rs.getPropertyValue('--accent-secondary').trim() || '#d6ff00'
      });
    };

    updateTheme();
    // Re-check theme occasionally or on mutation if needed, but simple re-render triggers via React context in navbar toggle
    // For robust implementation, we can listen for clicks on toggle using a global event or interval
    const interval = setInterval(updateTheme, 500);
    return () => clearInterval(interval);
  }, []);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: { color: themeColors.textMuted, font: { family: 'Space Grotesk' } }
      },
      tooltip: {
        backgroundColor: themeColors.bg,
        titleColor: themeColors.accent,
        titleFont: { family: 'Space Grotesk', size: 14 },
        bodyColor: themeColors.text,
        borderColor: themeColors.border,
        borderWidth: 1,
        padding: 12,
      }
    },
    scales: {
      y: {
        grid: { color: themeColors.border },
        ticks: { color: themeColors.textMuted, font: { family: 'Space Grotesk' } }
      },
      x: {
        grid: { color: themeColors.border },
        ticks: { color: themeColors.textMuted, font: { family: 'Space Grotesk' } }
      }
    }
  };

  const lineData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Cyber Incidents Reported',
        data: [65, 59, 80, 81, 56, 105, 130],
        borderColor: themeColors.accent,
        backgroundColor: themeColors.accentDim,
        tension: 0.4,
        fill: true,
        pointBackgroundColor: themeColors.accent,
        pointBorderColor: themeColors.bg,
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6
      }
    ]
  };

  const doughnutData = {
    labels: ['Phishing', 'UPI Fraud', 'Identity Theft', 'Ransomware', 'Other'],
    datasets: [
      {
        data: [42, 28, 15, 5, 10],
        backgroundColor: [
          themeColors.secondary,
          themeColors.accent,
          '#ef4444', 
          '#f59e0b', 
          themeColors.border 
        ],
        borderColor: themeColors.bg,
        borderWidth: 3,
        hoverOffset: 4
      }
    ]
  };

  const barData = {
    labels: ['Delhi', 'Mumbai', 'Bangalore', 'Hyderabad', 'Chennai'],
    datasets: [
      {
        label: 'High Severity Threats',
        data: [210, 185, 142, 98, 85],
        backgroundColor: 'rgba(255, 51, 102, 0.8)',
        borderRadius: 4,
      }
    ]
  };

  return (
    <div className={styles.dashboardContainer}>
      <header className={styles.header}>
        <div className={styles.headerTop}>
          <h1>THREAT <span className="glow-text-yellow">ANALYTICS</span></h1>
          <div className={styles.timeControls}>
            <button 
              className={`${styles.timeBtn} ${timeframe === '7d' ? styles.active : ''}`}
              onClick={() => setTimeframe('7d')}
            >
              7D
            </button>
            <button 
              className={`${styles.timeBtn} ${timeframe === '30d' ? styles.active : ''}`}
              onClick={() => setTimeframe('30d')}
            >
              30D
            </button>
            <button 
              className={`${styles.timeBtn} ${timeframe === '1y' ? styles.active : ''}`}
              onClick={() => setTimeframe('1y')}
            >
              1Y
            </button>
          </div>
        </div>
        <p className={styles.subtext}>Live statistics overview of cyber complaints and threat vectors across the nation.</p>
      </header>

      {/* KPI Stats */}
      <div className={styles.kpiGrid}>
        <div className={`${styles.kpiCard} glass-panel`}>
          <div className={styles.kpiHeader}>
            <Activity className={styles.iconGreen} />
            <span className={styles.trendUp}>+12.5%</span>
          </div>
          <div className={styles.kpiValue}>1,284</div>
          <div className={styles.kpiLabel}>Total Reports Filed</div>
        </div>
        
        <div className={`${styles.kpiCard} glass-panel`}>
          <div className={styles.kpiHeader}>
            <ShieldAlert className={styles.iconYellow} />
            <span className={styles.trendUp}>+8.1%</span>
          </div>
          <div className={styles.kpiValue}>432</div>
          <div className={styles.kpiLabel}>Critical Threats Active</div>
        </div>

        <div className={`${styles.kpiCard} glass-panel`}>
          <div className={styles.kpiHeader}>
            <TrendingUp className={styles.iconGreen} />
            <span className={styles.trendUp}>+5.2%</span>
          </div>
          <div className={styles.kpiValue}>$2.4M</div>
          <div className={styles.kpiLabel}>Estimated Financial Loss</div>
        </div>

        <div className={`${styles.kpiCard} glass-panel`}>
          <div className={styles.kpiHeader}>
            <Users className={styles.iconYellow} />
            <span className={styles.trendDown}>-2.4%</span>
          </div>
          <div className={styles.kpiValue}>891</div>
          <div className={styles.kpiLabel}>Cases Resolved</div>
        </div>
      </div>

      {/* Charts */}
      <div className={styles.chartsGrid}>
        <div className={`${styles.chartWrapper} glass-panel ${styles.spanAll}`}>
          <h3>Incident Volume Trend</h3>
          <div className={styles.chartContainer}>
            <Line options={chartOptions as any} data={lineData} />
          </div>
        </div>

        <div className={`${styles.chartWrapper} glass-panel`}>
          <h3>Threat Distribution</h3>
          <div className={styles.chartContainer}>
            <Doughnut options={{...chartOptions, cutout: '70%'} as any} data={doughnutData} />
          </div>
        </div>

        <div className={`${styles.chartWrapper} glass-panel`}>
          <h3>Regional Hotspots</h3>
          <div className={styles.chartContainer}>
            <Bar 
              options={{...chartOptions, indexAxis: 'y' as const} as any} 
              data={barData} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
