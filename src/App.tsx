import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Report from './pages/Report';
import Track from './pages/Track';
import Dashboard from './pages/Dashboard';
import { ThemeProvider } from './context/ThemeContext';
 
function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
          <Route path="report" element={<Report />} />
          <Route path="track" element={<Track />} />
          <Route path="analytics" element={<Dashboard />} />
        </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
