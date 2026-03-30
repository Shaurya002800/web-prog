import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import AnimatedBackground from '../AnimatedBackground';
// import Footer from './Footer';
import styles from './Layout.module.css';

const Layout = () => {
  return (
    <div className={styles.appContainer}>
      <AnimatedBackground />
      <Navbar />
      <main className={styles.mainContent}>
        <Outlet />
      </main>
      {/* <Footer /> */}
    </div>
  );
};

export default Layout;
