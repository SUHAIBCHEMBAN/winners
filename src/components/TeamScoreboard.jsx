import { motion } from 'framer-motion';
import { Trophy, TrendingUp } from 'lucide-react';
import { teams } from '../data/teams';
import useStore from '../store/useStore';
import './TeamScoreboard.css';

const TeamScoreboard = () => {
  const getTeamScores = useStore((state) => state.getTeamScores);
  const scores = getTeamScores();

  const totalPoints = scores.team1 + scores.team2;
  const team1Percentage = totalPoints > 0 ? (scores.team1 / totalPoints) * 100 : 50;
  const team2Percentage = totalPoints > 0 ? (scores.team2 / totalPoints) * 100 : 50;

  const leader = scores.team1 > scores.team2 ? teams[0] : scores.team2 > scores.team1 ? teams[1] : null;

  return (
    <div className="scoreboard-container">
      <div className="scoreboard-header">
        <Trophy className="scoreboard-icon" />
        <h2>Live Scoreboard</h2>
        {leader && (
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
          const percentage = team.id === 'team1' ? team1Percentage : team2Percentage;
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
                '--team-gradient': team.gradient,
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
                  style={{ background: team.gradient }}
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
