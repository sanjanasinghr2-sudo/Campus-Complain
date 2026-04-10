import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { io } from 'socket.io-client';
import { PlusCircle, Clock, CheckCircle, XCircle, Loader2 } from 'lucide-react';

const SOCKET_URL = 'http://localhost:5000';

const getStatusBadgeClass = (status) => {
    switch(status) {
        case 'Pending': return 'badge badge-pending';
        case 'In Progress': return 'badge badge-progress';
        case 'Resolved': return 'badge badge-resolved';
        case 'Rejected': return 'badge badge-rejected';
        default: return 'badge';
    }
};

const Dashboard = () => {
    const { user } = useContext(AuthContext);
    const [complaints, setComplaints] = useState([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('Maintenance');
    const [loading, setLoading] = useState(true);

    const categories = ['Maintenance', 'Hostel', 'Academic', 'Mess/Food', 'Other'];

    useEffect(() => {
        const fetchComplaints = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get('http://localhost:5000/api/complaints', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setComplaints(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchComplaints();

        const socket = io(SOCKET_URL);
        socket.on('status_update', (data) => {
            if(data.user === user._id || data.user._id === user._id) {
                setComplaints(prev => prev.map(c => c._id === data.id ? { ...c, status: data.status, adminNotes: data.adminNotes } : c));
                // Show notification (simple alert for now or just visual update)
            }
        });

        return () => socket.disconnect();
    }, [user._id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const res = await axios.post('http://localhost:5000/api/complaints', 
                { title, description, category }, 
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setComplaints([res.data, ...complaints]);
            setTitle('');
            setDescription('');
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) return <div className="loader"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="dashboard-grid">
            <div className="glass-card">
                <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <PlusCircle /> New Complaint
                </h3>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Category</label>
                        <select className="form-select" value={category} onChange={(e) => setCategory(e.target.value)}>
                            {categories.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                    <div className="form-group">
                        <label className="form-label">Title</label>
                        <input type="text" className="form-input" value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="Brief summary of issue" />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Description</label>
                        <textarea className="form-textarea" rows="4" value={description} onChange={(e) => setDescription(e.target.value)} required placeholder="Provide detailed information..."></textarea>
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Submit Complaint</button>
                </form>
            </div>

            <div>
                <h3 style={{ marginBottom: '1.5rem' }}>Your Complaints</h3>
                <div className="complaint-list">
                    {complaints.length === 0 ? (
                        <div className="glass-card" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No complaints submitted yet.</div>
                    ) : complaints.map(c => (
                        <div key={c._id} className="complaint-item">
                            <div className="complaint-header">
                                <span className={getStatusBadgeClass(c.status)}>{c.status}</span>
                                <span className="badge" style={{ background: 'rgba(255,255,255,0.1)' }}>{c.category}</span>
                            </div>
                            <div className="complaint-title">{c.title}</div>
                            <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.5rem' }}>{c.description}</div>
                            {c.adminNotes && (
                                <div style={{ marginTop: '1rem', padding: '0.75rem', background: 'rgba(99, 102, 241, 0.1)', borderLeft: '3px solid var(--primary)', borderRadius: '4px', fontSize: '0.9rem' }}>
                                    <strong>Admin Note:</strong> {c.adminNotes}
                                </div>
                            )}
                            <div className="complaint-meta">
                                <span>{new Date(c.createdAt).toLocaleDateString()}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
