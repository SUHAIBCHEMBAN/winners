import React, { useState } from 'react';
import useStore from '../../store/useStore';
import { Edit2, Trash2, Plus, X, Save, Search } from 'lucide-react';

const ParticipantManager = () => {
    const { participants, teams, addParticipant, updateParticipant, deleteParticipant } = useStore();
    const [isEditing, setIsEditing] = useState(false);
    const [currentParticipant, setCurrentParticipant] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        teamId: '',
        category: 'JUNIOR'
    });

    const categories = ['SUB-JUNIOR', 'JUNIOR', 'SENIOR', 'GENERAL', 'HSS', 'HS', 'UP', 'LP']; 

    const resetForm = () => {
        setFormData({ name: '', teamId: '', category: 'JUNIOR' });
        setCurrentParticipant(null);
        setIsEditing(false);
    };

    const handleEdit = (participant) => {
        setFormData(participant);
        setCurrentParticipant(participant);
        setIsEditing(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (currentParticipant) {
                await updateParticipant(currentParticipant.id, formData);
            } else {
                await addParticipant(formData);
            }
            resetForm();
        } catch (error) {
            alert("Error saving participant");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Delete this participant?")) {
            await deleteParticipant(id);
        }
    };

    const filteredParticipants = participants.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        teams.find(t => t.id === p.teamId)?.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="manager-section">
            <div className="manager-header">
                <h3>Participants Management</h3>
                <div style={{ display: 'flex', gap: '10px' }}>
                     <div className="search-bar">
                        <Search size={16} />
                        <input 
                            type="text" 
                            placeholder="Search..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    {!isEditing && (
                        <button className="btn btn-sm btn-primary" onClick={() => setIsEditing(true)}>
                            <Plus size={16} /> Add Participant
                        </button>
                    )}
                </div>
            </div>

            {isEditing && (
                <div className="edit-form-card">
                    <h4>{currentParticipant ? 'Edit Participant' : 'New Participant'}</h4>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Name</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Team</label>
                            <select
                                value={formData.teamId}
                                onChange={e => setFormData({ ...formData, teamId: e.target.value })}
                                required
                            >
                                <option value="">Select Team</option>
                                {teams.map(t => (
                                    <option key={t.id} value={t.id}>{t.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Category</label>
                             <input 
                                list="category-options" 
                                value={formData.category}
                                onChange={e => setFormData({ ...formData, category: e.target.value })}
                                placeholder="Select or type category"
                            />
                            <datalist id="category-options">
                                {categories.map(c => <option key={c} value={c} />)}
                            </datalist>
                        </div>
                        <div className="form-actions">
                            <button type="submit" className="btn btn-success">
                                <Save size={16} /> Save
                            </button>
                            <button type="button" className="btn btn-outline" onClick={resetForm}>
                                <X size={16} /> Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="list-table-container">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Team</th>
                            <th>Category</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredParticipants.map(p => {
                            const team = teams.find(t => t.id === p.teamId);
                            return (
                                <tr key={p.id}>
                                    <td>{p.name}</td>
                                    <td>
                                        {team ? (
                                             <span style={{ color: team.color, fontWeight: 'bold' }}>{team.name}</span>
                                        ) : 'Unknown'}
                                    </td>
                                    <td>{p.category}</td>
                                    <td>
                                        <button className="icon-btn" onClick={() => handleEdit(p)}>
                                            <Edit2 size={16} />
                                        </button>
                                        <button className="icon-btn text-red" onClick={() => handleDelete(p.id)}>
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                        {filteredParticipants.length === 0 && (
                            <tr><td colSpan="4" className="text-center">No participants found.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ParticipantManager;
