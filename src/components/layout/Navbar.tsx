import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Shield, BarChart3, Search, AlertOctagon, Menu, X, Phone, Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import styles from './Navbar.module.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  const navLinks = [
    { path: '/', label: 'AWARENESS', icon: <Shield size={18} /> },
    { path: '/report', label: 'REPORT CRIME', icon: <AlertOctagon size={18} /> },
    { path: '/track', label: 'TRACK COMPLAINT', icon: <Search size={18} /> },
    { path: '/analytics', label: 'STATISTICS', icon: <BarChart3 size={18} /> },
  ];

  return (
    <nav className={styles.navbar}>
      <div className={styles.navContainer}>
        <div className={styles.logoContainer}>
          <Link to="/" className={styles.logo}>
            <span className={styles.glitchBlock}></span>
            CYBER<span className={styles.accent}>PORTAL</span>
          </Link>
        </div>
        
        <div className={styles.linksContainer}>
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`${styles.navLink} ${location.pathname === link.path ? styles.active : ''}`}
            >
              <span className={styles.icon}>{link.icon}</span>
              {link.label}
            </Link>
          ))}
        </div>

        <div className={styles.actionContainer}>
          <button onClick={toggleTheme} className={styles.themeToggle} aria-label="Toggle Theme">
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <Link to="/report" className="cyber-button">
            Emergency
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
