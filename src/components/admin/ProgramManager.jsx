import React, { useState } from 'react';
import useStore from '../../store/useStore';
import { Edit2, Trash2, Plus, X, Save } from 'lucide-react';

const ProgramManager = () => {
    const { programs, addProgram, updateProgram, deleteProgram } = useStore();
    const [isEditing, setIsEditing] = useState(false);
    const [currentProgram, setCurrentProgram] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        category: 'On-Stage',
        maxPoints: 100
    });

    const resetForm = () => {
        setFormData({ name: '', category: 'On-Stage', maxPoints: 100 });
        setCurrentProgram(null);
        setIsEditing(false);
    };

    const handleEdit = (program) => {
        setFormData(program);
        setCurrentProgram(program);
        setIsEditing(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (currentProgram) {
                await updateProgram(currentProgram.id, formData);
            } else {
                await addProgram(formData);
            }
            resetForm();
        } catch (error) {
            alert("Error saving program");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Delete this program?")) {
            await deleteProgram(id);
        }
    };

    return (
        <div className="manager-section">
            <div className="manager-header">
                <h3>Programs Management</h3>
                {!isEditing && (
                    <button className="btn btn-sm btn-primary" onClick={() => setIsEditing(true)}>
                        <Plus size={16} /> Add Program
                    </button>
                )}
            </div>

            {isEditing && (
                <div className="edit-form-card">
                    <h4>{currentProgram ? 'Edit Program' : 'New Program'}</h4>
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
                            <label>Category</label>
                            <select
                                value={formData.category}
                                onChange={e => setFormData({ ...formData, category: e.target.value })}
                            >
                                <option value="On-Stage">On-Stage</option>
                                <option value="Off-Stage">Off-Stage</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Max Points</label>
                            <input
                                type="number"
                                value={formData.maxPoints}
                                onChange={e => setFormData({ ...formData, maxPoints: Number(e.target.value) })}
                                required
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
                            <th>Name</th>
                            <th>Category</th>
                            <th>Max Points</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {programs.map(p => (
                            <tr key={p.id}>
                                <td>{p.name}</td>
                                <td><span className={`badge ${p.category === 'On-Stage' ? 'badge-blue' : 'badge-purple'}`}>{p.category}</span></td>
                                <td>{p.maxPoints}</td>
                                <td>
                                    <button className="icon-btn" onClick={() => handleEdit(p)}>
                                        <Edit2 size={16} />
                                    </button>
                                    <button className="icon-btn text-red" onClick={() => handleDelete(p.id)}>
                                        <Trash2 size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {programs.length === 0 && (
                            <tr><td colSpan="4" className="text-center">No programs found.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ProgramManager;
