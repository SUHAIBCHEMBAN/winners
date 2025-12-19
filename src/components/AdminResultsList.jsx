import { motion } from 'framer-motion';
import { Edit2, Trash2, Calendar, Award } from 'lucide-react';
import useStore from '../store/useStore';
import { programs } from '../data/programs';
import { participants } from '../data/participants';
import { teams } from '../data/teams';
import { format } from 'date-fns';
import './AdminResultsList.css';

const AdminResultsList = ({ onEdit }) => {
  const { results, deleteResult } = useStore();

  const handleDelete = (id, participantName) => {
    if (
      window.confirm(
        `Are you sure you want to delete the result for ${participantName}? This action cannot be undone.`
      )
    ) {
      deleteResult(id);
    }
  };

  if (results.length === 0) {
    return (
      <div className="admin-results-empty">
        <Award size={64} className="empty-icon" />
        <h3>No Results Published Yet</h3>
        <p>Click "Publish New Result" to add your first result.</p>
      </div>
    );
  }

  return (
    <div className="admin-results-section">
      <h2 className="section-title">
        <Award size={24} />
        Published Results ({results.length})
      </h2>

      <div className="admin-results-list">
        {results.map((result, index) => {
          const participant = participants.find((p) => p.id === result.participantId);
          const program = programs.find((p) => p.id === result.programId);
          const team = teams.find((t) => t.id === result.teamId);

          return (
            <motion.div
              key={result.id}
              className="admin-result-card"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              layout
            >
              <div className="admin-result-content">
                <div className="admin-result-main">
                  <div className="admin-result-participant">
                    <h3>{participant?.name}</h3>
                    <span className="participant-details">
                      {participant?.category} • {program?.name}
                    </span>
                  </div>
                  <div className="admin-result-meta">
                    <div
                      className="admin-team-badge"
                      style={{ '--team-color': team?.color }}
                    >
                      {team?.name}
                    </div>
                    {result.place && <div className="admin-place-badge">{result.place}</div>}
                    <div className="admin-grade-badge">{result.grade}</div>
                    <div className="admin-points-badge">{result.points} pts</div>
                  </div>
                </div>

                <div className="admin-result-footer">
                  <div className="admin-result-timestamp">
                    <Calendar size={14} />
                    <span>
                      {format(new Date(result.timestamp), 'MMM dd, yyyy • hh:mm a')}
                    </span>
                    {result.editedAt && <span className="edited-tag">• Edited</span>}
                  </div>
                  <div className="admin-result-actions">
                    <button
                      className="action-btn edit-btn"
                      onClick={() => onEdit(result)}
                      title="Edit result"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      className="action-btn delete-btn"
                      onClick={() => handleDelete(result.id, participant?.name)}
                      title="Delete result"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default AdminResultsList;
