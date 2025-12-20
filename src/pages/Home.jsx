import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw } from 'lucide-react';
import TeamScoreboard from '../components/TeamScoreboard';
import ResultsList from '../components/ResultsList';
import useStore from '../store/useStore';
import './Home.css';

const Home = () => {
  const results = useStore((state) => state.results);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdated(new Date());
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const handleManualRefresh = () => {
    setIsRefreshing(true);
    setLastUpdated(new Date());
    setTimeout(() => {
      setIsRefreshing(false);
    }, 500);
  };

  return (
    <div className="home-page">
      <div className="container">
        {/* Hero Section */}
        <motion.div
          className="hero-section"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="hero-title">Sztuka '26</h1>
          <h2 style={{ fontSize: '1.5rem', color: 'var(--primary)', marginBottom: '1rem' }}>5th Edition Arts Fest</h2>
          <p className="hero-subtitle">
            "Design the Future"
          </p>
          <div className="hero-stats">
            <div className="hero-stat">
              <span className="stat-number">{results.length}</span>
              <span className="stat-text">Results Published</span>
            </div>
            <div className="hero-divider" />
            <button
              className="refresh-btn"
              onClick={handleManualRefresh}
              disabled={isRefreshing}
            >
              <RefreshCw
                size={16}
                className={isRefreshing ? 'spinning' : ''}
              />
              <span>Refresh</span>
            </button>
          </div>
        </motion.div>

        {/* Team Scoreboard */}
        <TeamScoreboard />

        {/* Results List */}
        <ResultsList />

        {/* Footer */}
        <motion.div
          className="page-footer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <p className="footer-status">
            Last updated: {lastUpdated.toLocaleTimeString()} • Auto-refreshes every 30 seconds
          </p>
          <div className="footer-credit">
            Designed and Developed by <a href="https://suhaibsportfolio.vercel.app/" target="_blank" rel="noopener noreferrer">Suhaib Chemban</a>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Home;
