import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, SortAsc, Award, Calendar, User, Trophy, X } from 'lucide-react';
import useStore from '../store/useStore';
import { teams } from '../data/teams';
import { programs, categories } from '../data/programs';
import { participants } from '../data/participants';
import { format } from 'date-fns';
import './ResultsList.css';

const ResultsList = () => {
  const results = useStore((state) => state.results);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTeam, setSelectedTeam] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const [showFilters, setShowFilters] = useState(false);

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
  }, [results, searchQuery, selectedCategory, selectedTeam, sortBy]);

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

      {/* Results List */}
      <div className="results-list">
        <AnimatePresence mode="popLayout">
          {filteredAndSortedResults.length === 0 ? (
            <motion.div
              className="no-results"
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
                        <h3 className="participant-name">{participant?.name}</h3>
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
                      <span className="info-value">{program?.name}</span>
                    </div>
                    <div className="result-info">
                      <span className="info-label">Team</span>
                      <span
                        className="team-badge"
                        style={{ '--team-color': team?.color }}
                      >
                        {team?.name}
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
