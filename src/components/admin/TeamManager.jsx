import React, { useState } from 'react';
import useStore from '../../store/useStore';
import { Edit2, Trash2, Plus, X, Save } from 'lucide-react';

const TeamManager = () => {
    const { teams, addTeam, updateTeam, deleteTeam } = useStore();
    const [isEditing, setIsEditing] = useState(false);
    const [currentTeam, setCurrentTeam] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        color: '#000000',
        gradient: ''
    });

    const resetForm = () => {
        setFormData({ name: '', color: '#000000', gradient: '' });
        setCurrentTeam(null);
        setIsEditing(false);
    };

    const handleEdit = (team) => {
        setFormData(team);
        setCurrentTeam(team);
        setIsEditing(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (currentTeam) {
                await updateTeam(currentTeam.id, formData);
            } else {
                await addTeam(formData);
            }
            resetForm();
        } catch (error) {
            alert("Error saving team");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Delete this team?")) {
            await deleteTeam(id);
        }
    };

    return (
        <div className="manager-section">
            <div className="manager-header">
                <h3>Teams Management</h3>
                {!isEditing && (
                    <button className="btn btn-sm btn-primary" onClick={() => setIsEditing(true)}>
                        <Plus size={16} /> Add Team
                    </button>
                )}
            </div>

            {isEditing && (
                <div className="edit-form-card">
                    <h4>{currentTeam ? 'Edit Team' : 'New Team'}</h4>
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
                            <label>Base Color</label>
                            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                <input
                                    type="color"
                                    value={formData.color}
                                    onChange={e => setFormData({ ...formData, color: e.target.value })}
                                />
                                <input
                                    type="text"
                                    value={formData.color}
                                    onChange={e => setFormData({ ...formData, color: e.target.value })}
                                    placeholder="#000000"
                                />
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Gradient CSS (Optional)</label>
                            <input
                                type="text"
                                value={formData.gradient}
                                onChange={e => setFormData({ ...formData, gradient: e.target.value })}
                                placeholder="linear-gradient(...)"
                            />
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
                            <th>Preview</th>
                            <th>Name</th>
                            <th>Color</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {teams.map(t => (
                            <tr key={t.id}>
                                <td>
                                    <div style={{
                                        width: '30px', 
                                        height: '30px', 
                                        borderRadius: '50%',
                                        background: t.gradient || t.color 
                                    }}></div>
                                </td>
                                <td>{t.name}</td>
                                <td>{t.color}</td>
                                <td>
                                    <button className="icon-btn" onClick={() => handleEdit(t)}>
                                        <Edit2 size={16} />
                                    </button>
                                    <button className="icon-btn text-red" onClick={() => handleDelete(t.id)}>
                                        <Trash2 size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {teams.length === 0 && (
                            <tr><td colSpan="4" className="text-center">No teams found.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TeamManager;
