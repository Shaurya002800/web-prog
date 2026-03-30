import { useEffect, useRef } from 'react';
import styles from './AnimatedBackground.module.css';

const AnimatedBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$+-*/=%""\'#&_(),.;:?!\\|{}<>[]^~';
    const lettersArray = letters.split('');
    const fontSize = 14;
    let columns = width / fontSize;

    let drops: number[] = [];
    for (let x = 0; x < columns; x++) {
      drops[x] = 1;
    }

    const draw = () => {
      // Pull dynamic CSS variables from the document element
      const rootStyles = getComputedStyle(document.documentElement);
      const matrixBg = rootStyles.getPropertyValue('--matrix-bg').trim() || 'rgba(5, 5, 5, 0.05)';
      const accentPrimary = rootStyles.getPropertyValue('--accent-primary').trim() || '#00ff41';
      const accentSecondary = rootStyles.getPropertyValue('--accent-secondary').trim() || '#d6ff00';
      const dimGreen = rootStyles.getPropertyValue('--accent-primary-dim').trim() || 'rgba(0, 255, 65, 0.35)';

      ctx.fillStyle = matrixBg;
      ctx.fillRect(0, 0, width, height);

      ctx.fillStyle = accentPrimary;
      ctx.font = fontSize + 'px monospace';

      for (let i = 0; i < drops.length; i++) {
        const text = lettersArray[Math.floor(Math.random() * lettersArray.length)];
        
        if (Math.random() > 0.98) {
           ctx.fillStyle = accentSecondary;
           ctx.shadowBlur = 10;
           ctx.shadowColor = accentSecondary;
        } else {
           ctx.fillStyle = dimGreen;
           ctx.shadowBlur = 0;
        }

        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > height && Math.random() > 0.975) {
          drops[i] = 0;
        }

        drops[i]++;
      }
    };

    const intervalId = setInterval(draw, 33);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      columns = width / fontSize;
      drops = [];
      for (let x = 0; x < columns; x++) {
        drops[x] = 1;
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return <canvas ref={canvasRef} className={styles.matrixCanvas} />;
};

export default AnimatedBackground;
