import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  PlusCircle,
  Download,
  Upload,
  Trash2,
  Edit2,
  CheckCircle,
  XCircle,
  Database,
  TrendingUp,
  LogOut,
} from 'lucide-react';
import useStore from '../store/useStore';
import { programs } from '../data/programs';
import { participants } from '../data/participants';
import { teams } from '../data/teams';
import PublishResultForm from '../components/PublishResultForm';
import AdminResultsList from '../components/AdminResultsList';
import './AdminPanel.css';

const AdminPanel = () => {
  const { isAuthenticated, results, exportResults, importResults, clearAllResults, logout } = useStore();
  const [showPublishForm, setShowPublishForm] = useState(false);
  const [editingResult, setEditingResult] = useState(null);
  const [stats, setStats] = useState({
    totalResults: 0,
    team1Points: 0,
    team2Points: 0,
    programsCovered: 0,
  });

  useEffect(() => {
    // Calculate statistics
    const team1Points = results
      .filter((r) => r.teamId === 'team1')
      .reduce((sum, r) => sum + r.points, 0);
    const team2Points = results
      .filter((r) => r.teamId === 'team2')
      .reduce((sum, r) => sum + r.points, 0);
    const programsCovered = new Set(results.map((r) => r.programId)).size;

    setStats({
      totalResults: results.length,
      team1Points,
      team2Points,
      programsCovered,
    });
  }, [results]);

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const success = importResults(event.target.result);
          if (success) {
            alert('Results imported successfully!');
          } else {
            alert('Failed to import results. Please check the file format.');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const handleClearAll = () => {
    if (
      window.confirm(
        'Are you sure you want to delete ALL results? This action cannot be undone!'
      )
    ) {
      clearAllResults();
      alert('All results have been cleared.');
    }
  };

  const handleEdit = (result) => {
    setEditingResult(result);
    setShowPublishForm(true);
  };

  const handleFormClose = () => {
    setShowPublishForm(false);
    setEditingResult(null);
  };

  if (!isAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  return (
    <div className="admin-panel">
      <div className="container">
        <motion.div
          className="admin-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div>
            <h1>Admin Dashboard</h1>
            <p className="admin-subtitle">Manage and publish fest results</p>
          </div>
          <div className="header-actions" style={{ display: 'flex', gap: '1rem' }}>
            <button
              className="btn btn-primary"
              onClick={() => setShowPublishForm(true)}
            >
              <PlusCircle size={20} />
              <span>Publish Result</span>
            </button>
            <button
              className="btn btn-outline"
              onClick={() => {
                logout();
              }}
            >
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </div>
        </motion.div>

        {/* Statistics Cards */}
        <div className="stats-grid">
          <motion.div
            className="stat-card"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            <div className="stat-icon" style={{ background: 'rgba(99, 102, 241, 0.2)' }}>
              <Database size={24} style={{ color: 'var(--primary)' }} />
            </div>
            <div className="stat-content">
              <div className="stat-value">{stats.totalResults}</div>
              <div className="stat-label">Total Results</div>
            </div>
          </motion.div>

          <motion.div
            className="stat-card"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="stat-icon" style={{ background: 'rgba(255, 107, 107, 0.2)' }}>
              <TrendingUp size={24} style={{ color: 'var(--team1-color)' }} />
            </div>
            <div className="stat-content">
              <div className="stat-value">{stats.team1Points}</div>
              <div className="stat-label">{teams[0].name}</div>
            </div>
          </motion.div>

          <motion.div
            className="stat-card"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="stat-icon" style={{ background: 'rgba(78, 205, 196, 0.2)' }}>
              <TrendingUp size={24} style={{ color: 'var(--team2-color)' }} />
            </div>
            <div className="stat-content">
              <div className="stat-value">{stats.team2Points}</div>
              <div className="stat-label">{teams[1].name}</div>
            </div>
          </motion.div>

          <motion.div
            className="stat-card"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
          >
            <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.2)' }}>
              <CheckCircle size={24} style={{ color: 'var(--success)' }} />
            </div>
            <div className="stat-content">
              <div className="stat-value">
                {stats.programsCovered}/{programs.length}
              </div>
              <div className="stat-label">Programs Covered</div>
            </div>
          </motion.div>
        </div>

        {/* Action Buttons */}
        <motion.div
          className="admin-actions"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <button className="btn btn-outline" onClick={exportResults}>
            <Download size={18} />
            <span>Export Results</span>
          </button>
          <button className="btn btn-outline" onClick={handleImport}>
            <Upload size={18} />
            <span>Import Results</span>
          </button>
          <button className="btn btn-danger" onClick={handleClearAll}>
            <Trash2 size={18} />
            <span>Clear All Results</span>
          </button>
        </motion.div>

        {/* Results Management */}
        <AdminResultsList onEdit={handleEdit} />

        {/* Publish/Edit Form Modal */}
        {showPublishForm && (
          <PublishResultForm
            editingResult={editingResult}
            onClose={handleFormClose}
          />
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
