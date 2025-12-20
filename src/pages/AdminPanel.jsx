import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  PlusCircle,
  Download,
  Upload,
  Trash2,
  Database,
  TrendingUp,
  LogOut,
  Layout,
  Users,
  Flag,
  List,
  Settings
} from 'lucide-react';
import useStore from '../store/useStore';
import { programs as initialPrograms } from '../data/programs';
import { participants as initialParticipants } from '../data/participants';
import { teams as initialTeams } from '../data/teams';
import PublishResultForm from '../components/PublishResultForm';
import AdminResultsList from '../components/AdminResultsList';
import ProgramManager from '../components/admin/ProgramManager';
import TeamManager from '../components/admin/TeamManager';
import ParticipantManager from '../components/admin/ParticipantManager';
import '../components/admin/AdminManagers.css';
import './AdminPanel.css';

const AdminPanel = () => {
  const { 
      isAuthenticated, 
      results, 
      programs, 
      teams, 
      participants,
      exportResults, 
      importResults, 
      clearAllResults, 
      logout,
      seedDatabase
  } = useStore();

  const [activeTab, setActiveTab] = useState('results');
  const [showPublishForm, setShowPublishForm] = useState(false);
  const [editingResult, setEditingResult] = useState(null);
  
  // Stats
  const [stats, setStats] = useState({
    totalResults: 0,
    team1Points: 0,
    team2Points: 0,
    programsCovered: 0,
  });

  useEffect(() => {
    // Calculate statistics
    
    // Create a map for quick team lookup if needed, though simpler filter is fine for small count
    const teamScores = {};
    results.forEach(r => {
        if (r.teamId) {
             teamScores[r.teamId] = (teamScores[r.teamId] || 0) + r.points;
        }
    });

    // Provide default for safe access to first two teams if available
    const team1 = teams.length > 0 ? teams[0] : { id: 'team1', name: 'Team 1' };
    const team2 = teams.length > 1 ? teams[1] : { id: 'team2', name: 'Team 2' };

    const programsCovered = new Set(results.map((r) => r.programId)).size;

    setStats({
      totalResults: results.length,
      team1Points: teamScores[team1.id] || 0,
      team2Points: teamScores[team2.id] || 0,
      programsCovered,
    });
  }, [results, teams]);

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
    if (window.confirm('Are you sure you want to delete ALL results? This action cannot be undone!')) {
      clearAllResults();
      alert('All results have been cleared.');
    }
  };

  const handleSeed = async () => {
      if (window.confirm("This will add the initial hardcoded data (Programs, Teams, Participants) to the database. Continue?")) {
          // Normalize existing data structure if needed
          await seedDatabase(initialPrograms, initialTeams, initialParticipants);
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

  // Navigation Tabs
  const tabs = [
      { id: 'results', label: 'Results', icon: List },
      { id: 'programs', label: 'Programs', icon: Layout },
      { id: 'teams', label: 'Teams', icon: Flag },
      { id: 'participants', label: 'Participants', icon: Users },
      { id: 'settings', label: 'Settings', icon: Settings },
  ];

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
            <p className="admin-subtitle">Manage fest content and publish results</p>
          </div>
          <button
              className="btn btn-outline"
              onClick={() => logout()}
            >
              <LogOut size={20} />
              <span>Logout</span>
            </button>
        </motion.div>

        {/* Tab Navigation */}
        <div className="admin-tabs" style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
            {tabs.map(tab => (
                <button
                    key={tab.id}
                    className={`btn ${activeTab === tab.id ? 'btn-primary' : 'btn-outline'}`}
                    onClick={() => setActiveTab(tab.id)}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                    <tab.icon size={18} />
                    {tab.label}
                </button>
            ))}
        </div>

        {/* Dynamic Content */}
        
        {/* Results Tab (Default) */}
        {activeTab === 'results' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                {/* Stats */}
                <div className="stats-grid">
                  <div className="stat-card">
                    <div className="stat-icon" style={{ background: 'rgba(99, 102, 241, 0.2)' }}>
                      <Database size={24} style={{ color: 'var(--primary)' }} />
                    </div>
                    <div className="stat-content">
                      <div className="stat-value">{stats.totalResults}</div>
                      <div className="stat-label">Total Results</div>
                    </div>
                  </div>

                  {teams.length > 0 && stats.team1Points !== undefined && (
                        <div className="stat-card">
                            <div className="stat-icon" style={{ background: 'rgba(255, 107, 107, 0.2)', backgroundColor: teams[0]?.color ? `${teams[0].color}33` : undefined }}>
                            <TrendingUp size={24} style={{ color: teams[0]?.color || 'var(--primary)' }} />
                            </div>
                            <div className="stat-content">
                            <div className="stat-value">{stats.team1Points}</div>
                            <div className="stat-label">{teams[0]?.name || 'Team 1'}</div>
                            </div>
                        </div>
                   )}
                   
                   {teams.length > 1 && stats.team2Points !== undefined && (
                         <div className="stat-card">
                            <div className="stat-icon" style={{ background: 'rgba(78, 205, 196, 0.2)', backgroundColor: teams[1]?.color ? `${teams[1].color}33` : undefined }}>
                            <TrendingUp size={24} style={{ color: teams[1]?.color || 'var(--primary)' }} />
                            </div>
                            <div className="stat-content">
                            <div className="stat-value">{stats.team2Points}</div>
                            <div className="stat-label">{teams[1]?.name || 'Team 2'}</div>
                            </div>
                        </div>
                   )}

                  <div className="stat-card">
                    <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.2)' }}>
                      <CheckCircle size={24} style={{ color: 'var(--success)' }} />
                    </div>
                    <div className="stat-content">
                      <div className="stat-value">
                        {stats.programsCovered}/{programs.length}
                      </div>
                      <div className="stat-label">Programs Covered</div>
                    </div>
                  </div>
                </div>

                <div className="admin-actions" style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'flex-end' }}>
                     <button
                        className="btn btn-primary"
                        onClick={() => setShowPublishForm(true)}
                        >
                        <PlusCircle size={20} />
                        <span>Publish Result</span>
                    </button>
                </div>

                <AdminResultsList onEdit={handleEdit} />

                {showPublishForm && (
                  <PublishResultForm
                    editingResult={editingResult}
                    onClose={handleFormClose}
                  />
                )}
            </motion.div>
        )}

        {/* Managers */}
        {activeTab === 'programs' && <ProgramManager />}
        {activeTab === 'teams' && <TeamManager />}
        {activeTab === 'participants' && <ParticipantManager />}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
             <div className="manager-section">
                <h3>System Settings</h3>
                <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    
                    <div className="setting-item" style={{ padding: '1rem', border: '1px solid #eee', borderRadius: '8px' }}>
                        <h4>Data Seeding</h4>
                        <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '1rem' }}>
                            If you have just connected to a fresh database, you can seed it with the initial hardcoded data (Programs, Teams, Participants).
                            Only do this once to avoid duplicates if not strictly checked.
                        </p>
                        <button className="btn btn-primary" onClick={handleSeed}>
                            <Database size={18} /> Seed Database from Code
                        </button>
                    </div>

                    <div className="setting-item" style={{ padding: '1rem', border: '1px solid #eee', borderRadius: '8px' }}>
                        <h4>Data Management</h4>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button className="btn btn-outline" onClick={exportResults}>
                                <Download size={18} /> Export Full Backup
                            </button>
                        </div>
                    </div>

                     <div className="setting-item" style={{ padding: '1rem', border: '1px solid #fee2e2', borderRadius: '8px', background: '#fef2f2' }}>
                        <h4 style={{ color: '#dc2626' }}>Danger Zone</h4>
                         <button className="btn btn-danger" onClick={handleClearAll}>
                            <Trash2 size={18} /> Clear Published Results
                        </button>
                    </div>

                </div>
             </div>
        )}

      </div>
    </div>
  );
};

// Simple icon for stat check
const CheckCircle = ({ size, style }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width={size} 
        height={size} 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        style={style}
    >
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
);

export default AdminPanel;
