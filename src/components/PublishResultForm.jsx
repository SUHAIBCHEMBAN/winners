import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Award } from 'lucide-react';
import useStore from '../store/useStore';
import { programs } from '../data/programs';
import { participants } from '../data/participants';
import { teams } from '../data/teams';
import './PublishResultForm.css';

const PublishResultForm = ({ editingResult, onClose }) => {
  const { addResult, editResult } = useStore();
  
  const [formData, setFormData] = useState({
    programId: '',
    participantId: '',
    teamId: '',
    points: '',
    grade: '',
    place: '', // Added place field
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editingResult) {
      setFormData({
        programId: editingResult.programId,
        participantId: editingResult.participantId,
        teamId: editingResult.teamId,
        points: editingResult.points,
        grade: editingResult.grade,
        place: editingResult.place || '', // Load place if editing
      });
    }
  }, [editingResult]);

  // Auto-fill team when participant is selected
  useEffect(() => {
    if (formData.participantId) {
      const participant = participants.find((p) => p.id === formData.participantId);
      if (participant) {
        setFormData((prev) => ({ ...prev, teamId: participant.teamId }));
      }
    }
  }, [formData.participantId]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.programId) newErrors.programId = 'Please select a program';
    if (!formData.participantId) newErrors.participantId = 'Please select a participant';
    if (!formData.points) {
      newErrors.points = 'Please enter points';
    } else if (formData.points < 1 || formData.points > 1000) {
      newErrors.points = 'Points must be between 1 and 1000';
    }
    if (!formData.grade) newErrors.grade = 'Please select a grade';
    if (!formData.place) newErrors.place = 'Please select a position'; // Validate place

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    setTimeout(() => {
      const resultData = {
        ...formData,
        points: parseInt(formData.points, 10),
      };

      if (editingResult) {
        editResult(editingResult.id, resultData);
      } else {
        addResult(resultData);
      }

      setIsSubmitting(false);
      onClose();
    }, 500);
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const selectedProgram = programs.find((p) => p.id === formData.programId);
  const selectedParticipant = participants.find((p) => p.id === formData.participantId);
  const selectedTeam = teams.find((t) => t.id === formData.teamId);

  return (
    <AnimatePresence>
      <motion.div
        className="modal-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="modal-content"
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="modal-header">
            <div className="modal-title">
              <Award className="modal-icon" />
              <h2>{editingResult ? 'Edit Result' : 'Publish New Result'}</h2>
            </div>
            <button className="modal-close" onClick={onClose}>
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="publish-form">
            {/* Program Selection */}
            <div className="input-group">
              <label className="input-label">Program *</label>
              <select
                className={`select-field ${errors.programId ? 'error' : ''}`}
                value={formData.programId}
                onChange={(e) => handleChange('programId', e.target.value)}
              >
                <option value="">Select a program</option>
                {programs.map((program) => (
                  <option key={program.id} value={program.id}>
                    {program.name} ({program.category}) - Max: {program.maxPoints} pts
                  </option>
                ))}
              </select>
              {errors.programId && <span className="error-text">{errors.programId}</span>}
            </div>

            {/* Participant Selection */}
            <div className="input-group">
              <label className="input-label">Participant *</label>
              <select
                className={`select-field ${errors.participantId ? 'error' : ''}`}
                value={formData.participantId}
                onChange={(e) => handleChange('participantId', e.target.value)}
              >
                <option value="">Select a participant</option>
                {participants.map((participant) => {
                  const team = teams.find((t) => t.id === participant.teamId);
                  return (
                    <option key={participant.id} value={participant.id}>
                      {participant.name} - {participant.category} ({team?.name})
                    </option>
                  );
                })}
              </select>
              {errors.participantId && <span className="error-text">{errors.participantId}</span>}
            </div>

            {/* Points Input */}
            <div className="input-group">
              <label className="input-label">
                Points * {selectedProgram && `(Max: ${selectedProgram.maxPoints})`}
              </label>
              <input
                type="number"
                className={`input-field ${errors.points ? 'error' : ''}`}
                placeholder="Enter points (1-1000)"
                min="1"
                max="1000"
                value={formData.points}
                onChange={(e) => handleChange('points', e.target.value)}
              />
              {errors.points && <span className="error-text">{errors.points}</span>}
            </div>

            {/* Place/Position Selection */}
            <div className="input-group">
              <label className="input-label">Position / Place *</label>
              <select
                className={`select-field ${errors.place ? 'error' : ''}`}
                value={formData.place}
                onChange={(e) => handleChange('place', e.target.value)}
              >
                <option value="">Select position</option>
                <option value="1st">1st Place 🥇</option>
                <option value="2nd">2nd Place 🥈</option>
                <option value="3rd">3rd Place 🥉</option>
                <option value="Participation">Participation</option>
              </select>
              {errors.place && <span className="error-text">{errors.place}</span>}
            </div>

            {/* Grade Selection */}
            <div className="input-group">
              <label className="input-label">Grade *</label>
              <select
                className={`select-field ${errors.grade ? 'error' : ''}`}
                value={formData.grade}
                onChange={(e) => handleChange('grade', e.target.value)}
              >
                <option value="">Select a grade</option>
                <option value="A+">A+ (Excellent)</option>
                <option value="A">A (Very Good)</option>
                <option value="B+">B+ (Good)</option>
                <option value="B">B (Above Average)</option>
                <option value="C">C (Average)</option>
                <option value="D">D (Below Average)</option>
                <option value="E">E (Poor)</option>
              </select>
              {errors.grade && <span className="error-text">{errors.grade}</span>}
            </div>

            {/* Summary */}
            {selectedParticipant && selectedProgram && selectedTeam && (
              <motion.div
                className="result-summary"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h3>Result Summary</h3>
                <div className="summary-grid">
                  <div className="summary-item">
                    <span className="summary-label">Participant:</span>
                    <span className="summary-value">{selectedParticipant.name}</span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-label">Program:</span>
                    <span className="summary-value">{selectedProgram.name}</span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-label">Team:</span>
                    <span
                      className="summary-value"
                      style={{ color: selectedTeam.color }}
                    >
                      {selectedTeam.name}
                    </span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-label">Position:</span>
                    <span className="summary-value">{formData.place}</span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-label">Points:</span>
                    <span className="summary-value">{formData.points || 0}</span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Form Actions */}
            <div className="form-actions">
              <button type="button" className="btn btn-outline" onClick={onClose}>
                <X size={18} />
                <span>Cancel</span>
              </button>
              <button
                type="submit"
                className="btn btn-success"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className="spinner" style={{ width: '18px', height: '18px' }} />
                    <span>Publishing...</span>
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    <span>{editingResult ? 'Update Result' : 'Publish Result'}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PublishResultForm;
