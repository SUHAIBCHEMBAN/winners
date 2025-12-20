import { motion } from 'framer-motion';
import { Trophy, TrendingUp } from 'lucide-react';
import useStore from '../store/useStore';
import './TeamScoreboard.css';

const TeamScoreboard = () => {
  const teams = useStore((state) => state.teams);
  const results = useStore((state) => state.results);

  // Calculate scores dynamically
  const scores = {};
  teams.forEach(t => scores[t.id] = 0);
  
  results.forEach((result) => {
      if (result.teamId && result.points) {
          scores[result.teamId] = (scores[result.teamId] || 0) + result.points;
      }
  });

  const totalPoints = Object.values(scores).reduce((a, b) => a + b, 0);
  
  // Find leader
  let leader = null;
  let maxScore = -1;
  teams.forEach(t => {
      if (scores[t.id] > maxScore) {
          maxScore = scores[t.id];
          leader = t;
      }
  });
  if (totalPoints === 0 || maxScore === 0) leader = null;

  return (
    <div className="scoreboard-container">
      <div className="scoreboard-header">
        <Trophy className="scoreboard-icon" />
        <h2>Live Scoreboard</h2>
        {leader && totalPoints > 0 && (
          <motion.div
            className="leader-badge"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
          >
            <TrendingUp size={16} />
            <span>{leader.name} Leading!</span>
          </motion.div>
        )}
      </div>

      <div className="scoreboard-grid">
        {teams.map((team, index) => {
          const teamScore = scores[team.id] || 0;
          const percentage = totalPoints > 0 ? (teamScore / totalPoints) * 100 : 0;
          const isLeading = leader && leader.id === team.id;

          return (
            <motion.div
              key={team.id}
              className={`team-card ${isLeading ? 'leading' : ''}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              style={{
                '--team-color': team.color,
                '--team-gradient': team.gradient || `linear-gradient(135deg, ${team.color} 0%, ${team.color} 100%)`,
              }}
            >
              <div className="team-header">
                <h3 className="team-name">{team.name}</h3>
                {isLeading && (
                  <motion.div
                    className="crown-icon"
                    animate={{ rotate: [0, -10, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    👑
                  </motion.div>
                )}
              </div>

              <motion.div
                className="team-score"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 100, delay: 0.2 + index * 0.1 }}
              >
                {teamScore}
              </motion.div>

              <div className="team-label">Total Points</div>

              <div className="progress-bar">
                <motion.div
                  className="progress-fill"
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                  style={{ background: team.gradient || team.color }}
                />
              </div>

              <div className="percentage-text">{percentage.toFixed(1)}%</div>
            </motion.div>
          );
        })}
      </div>

      {totalPoints === 0 && (
        <motion.div
          className="no-results-message"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <p>No results published yet. Stay tuned! 🎉</p>
        </motion.div>
      )}
    </div>
  );
};

export default TeamScoreboard;
