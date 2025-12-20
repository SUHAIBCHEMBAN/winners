import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, SortAsc, Award, Calendar, User, Trophy, X, LayoutGrid, List as ListIcon, Medal } from 'lucide-react';
import useStore from '../store/useStore';
import { categories } from '../data/programs';
import { format } from 'date-fns';
import './ResultsList.css';
import './ResultPoster.css';

const ResultsList = () => {
  const { results, teams, programs, participants } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTeam, setSelectedTeam] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState('gallery'); // Default to 'gallery' as per user interest

  const filteredAndSortedResults = useMemo(() => {
    let filtered = [...results];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((result) => {
        const participant = participants.find((p) => p.id === result.participantId);
        const program = programs.find((p) => p.id === result.programId);
        return (
          participant?.name.toLowerCase().includes(query) ||
          program?.name.toLowerCase().includes(query) ||
          result.grade?.toLowerCase().includes(query) ||
          participant?.category?.toLowerCase().includes(query)
        );
      });
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter((result) => {
        const program = programs.find((p) => p.id === result.programId);
        return program?.category === selectedCategory;
      });
    }

    // Team filter
    if (selectedTeam !== 'all') {
      filtered = filtered.filter((result) => result.teamId === selectedTeam);
    }

    // Sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'recent':
          return new Date(b.timestamp) - new Date(a.timestamp);
        case 'oldest':
          return new Date(a.timestamp) - new Date(b.timestamp);
        case 'points-high':
          return b.points - a.points;
        case 'points-low':
          return a.points - b.points;
        case 'grade':
          return (a.grade || '').localeCompare(b.grade || '');
        default:
          return 0;
      }
    });

    return filtered;
  }, [results, programs, participants, searchQuery, selectedCategory, selectedTeam, sortBy]);

  const getGradeColor = (grade) => {
    const gradeColors = {
      'A+': '#10b981',
      'A': '#22c55e',
      'B+': '#84cc16',
      'B': '#eab308',
      'C': '#f59e0b',
      'D': '#f97316',
      'E': '#ef4444',
    };
    return gradeColors[grade] || '#94a3b8';
  };

  const getRankIcon = (place) => {
      const p = place?.toLowerCase();
      if (p?.includes('1st')) return <Medal size={32} />;
      if (p?.includes('2nd')) return <Medal size={28} />;
      if (p?.includes('3rd')) return <Medal size={28} />;
      return <Award size={24} />;
  }

  const getRankClass = (place) => {
      const p = place?.toLowerCase();
      if (p?.includes('1st')) return 'rank-1st';
      if (p?.includes('2nd')) return 'rank-2nd';
      if (p?.includes('3rd')) return 'rank-3rd';
      return 'rank-participation';
  }

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedTeam('all');
    setSortBy('recent');
  };

  const hasActiveFilters = searchQuery || selectedCategory !== 'all' || selectedTeam !== 'all' || sortBy !== 'recent';

  return (
    <div className="results-section">
      <div className="results-header">
        <div className="header-title">
          <Award className="header-icon" />
          <h2>Published Results</h2>
          <span className="results-count">{filteredAndSortedResults.length}</span>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
             {/* View Toggle */}
            <div className="view-toggle" style={{ display: 'flex', background: 'var(--bg-secondary)', borderRadius: '8px', padding: '2px', border: '1px solid var(--border-color)' }}>
                <button 
                    className={`btn-icon ${viewMode === 'list' ? 'active' : ''}`}
                    onClick={() => setViewMode('list')}
                    style={{ 
                        padding: '0.4rem', 
                        background: viewMode === 'list' ? 'white' : 'transparent',
                        borderRadius: '6px',
                        border: 'none',
                        cursor: 'pointer',
                        color: viewMode === 'list' ? 'var(--primary)' : 'var(--text-secondary)',
                        boxShadow: viewMode === 'list' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
                    }}
                    title="List View"
                >
                    <ListIcon size={18} />
                </button>
                <button 
                    className={`btn-icon ${viewMode === 'gallery' ? 'active' : ''}`}
                    onClick={() => setViewMode('gallery')}
                    style={{ 
                        padding: '0.4rem', 
                        background: viewMode === 'gallery' ? 'white' : 'transparent',
                        borderRadius: '6px',
                        border: 'none',
                        cursor: 'pointer',
                        color: viewMode === 'gallery' ? 'var(--primary)' : 'var(--text-secondary)',
                        boxShadow: viewMode === 'gallery' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
                    }}
                    title="Gallery View (E-Poster)"
                >
                    <LayoutGrid size={18} />
                </button>
            </div>

            <button
            className="btn btn-outline filter-toggle"
            onClick={() => setShowFilters(!showFilters)}
            >
            <Filter size={18} />
            <span>Filters</span>
            {hasActiveFilters && <span className="filter-badge">{
                [searchQuery, selectedCategory !== 'all', selectedTeam !== 'all', sortBy !== 'recent']
                .filter(Boolean).length
            }</span>}
            </button>
        </div>
      </div>

      <AnimatePresence>
        {showFilters && (
          <motion.div
            className="filters-panel"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="filters-grid">
              {/* Search */}
              <div className="filter-group">
                <label className="filter-label">
                  <Search size={16} />
                  Search
                </label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="name, program, grade, category..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Category Filter */}
              <div className="filter-group">
                <label className="filter-label">
                  <Filter size={16} />
                  Category
                </label>
                <select
                  className="select-field"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="all">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.name}>
                      {cat.icon} {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Team Filter */}
              <div className="filter-group">
                <label className="filter-label">
                  <Trophy size={16} />
                  Team
                </label>
                <select
                  className="select-field"
                  value={selectedTeam}
                  onChange={(e) => setSelectedTeam(e.target.value)}
                >
                  <option value="all">All Teams</option>
                  {teams.map((team) => (
                    <option key={team.id} value={team.id}>
                      {team.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort */}
              <div className="filter-group">
                <label className="filter-label">
                  <SortAsc size={16} />
                  Sort By
                </label>
                <select
                  className="select-field"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="recent">Most Recent</option>
                  <option value="oldest">Oldest First</option>
                  <option value="points-high">Highest Points</option>
                  <option value="points-low">Lowest Points</option>
                  <option value="grade">Grade (A-E)</option>
                </select>
              </div>
            </div>

            {hasActiveFilters && (
              <button className="btn btn-outline clear-filters" onClick={clearFilters}>
                <X size={16} />
                Clear All Filters
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results List / Gallery */}
      <div className={viewMode === 'gallery' ? 'results-gallery' : 'results-list'}>
        <AnimatePresence mode="popLayout">
          {filteredAndSortedResults.length === 0 ? (
            <motion.div
              className="no-results"
              style={{ gridColumn: '1 / -1' }} /* Span full width grid */
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <Award size={64} className="no-results-icon" />
              <h3>No Results Found</h3>
              <p>Try adjusting your filters or check back later for new results!</p>
            </motion.div>
          ) : (
            filteredAndSortedResults.map((result, index) => {
              const participant = participants.find((p) => p.id === result.participantId);
              const program = programs.find((p) => p.id === result.programId);
              const team = teams.find((t) => t.id === result.teamId);

              if (viewMode === 'gallery') {
                  // Gallery / E-Poster View
                  return (
                      <motion.div
                        key={result.id}
                        className="result-poster"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ delay: index * 0.05 }}
                        layout
                      >
                         <div className="poster-header">
                             <div className="poster-program">{program?.name || 'Unknown Program'}</div>
                             <span className="poster-category-badge">{program?.category}</span>
                             
                             <div className={`poster-rank-container ${getRankClass(result.place)}`}>
                                 {getRankIcon(result.place)}
                             </div>
                         </div>
                         
                         <div className="poster-body">
                             <div style={{ marginTop: '1.5rem' }}>
                                 <h3 className="poster-participant-name">{participant?.name || 'Unknown'}</h3>
                                 <p className="poster-participant-details">{participant?.category}</p>
                                 <div 
                                    className="poster-team-badge" 
                                    style={{ background: team?.color || '#999', boxShadow: `0 4px 10px ${team?.color}40` }}
                                 >
                                     {team?.name || 'Unknown Team'}
                                 </div>
                             </div>
                             
                             <div className="poster-deco-circle"></div>
                         </div>

                         <div className="poster-footer">
                             <div className="poster-stat">
                                 <span className="stat-label">Grade</span>
                                 <span className="stat-value" style={{ color: getGradeColor(result.grade) }}>{result.grade}</span>
                             </div>
                              <div className="poster-stat">
                                 <span className="stat-label">Points</span>
                                 <span className="stat-value">{result.points}</span>
                             </div>
                              <div className="poster-stat">
                                 <span className="stat-label">Time</span>
                                 <span className="stat-value" style={{ fontSize: '0.65rem', color: '#999' }}>{format(new Date(result.timestamp), 'h:mm a')}</span>
                             </div>
                         </div>
                      </motion.div>
                  )
              }

              // List View Card (Existing)
              return (
                <motion.div
                  key={result.id}
                  className="result-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ delay: index * 0.05 }}
                  layout
                >
                  <div className="result-header">
                    <div className="result-participant">
                      <User className="participant-icon" />
                      <div>
                        <h3 className="participant-name">{participant?.name || 'Unknown'}</h3>
                        <p className="participant-class">{participant?.category}</p>
                      </div>
                    </div>
                    <div className="result-badges">
                       <span className={`place-badge place-${result.place?.toLowerCase().replace(' ', '-')}`}>
                        {result.place}
                      </span>
                      <div
                        className="result-grade"
                        style={{ '--grade-color': getGradeColor(result.grade) }}
                      >
                        {result.grade}
                      </div>
                    </div>
                  </div>

                  <div className="result-body">
                    <div className="result-info">
                      <span className="info-label">Program</span>
                      <span className="info-value">{program?.name || 'Unknown Program'}</span>
                    </div>
                    <div className="result-info">
                      <span className="info-label">Team</span>
                      <span
                        className="team-badge"
                        style={{ '--team-color': team?.color || '#ccc' }}
                      >
                        {team?.name || 'Unknown Team'}
                      </span>
                    </div>
                    <div className="result-info">
                      <span className="info-label">Points</span>
                      <span className="points-value">{result.points}</span>
                    </div>
                  </div>

                  <div className="result-footer">
                    <div className="result-timestamp">
                      <Calendar size={14} />
                      <span>{format(new Date(result.timestamp), 'MMM dd, yyyy • hh:mm a')}</span>
                    </div>
                    {result.editedAt && (
                      <span className="edited-badge">Edited</span>
                    )}
                  </div>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ResultsList;
