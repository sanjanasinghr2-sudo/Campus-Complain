import { useState, useEffect } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import { ShieldCheck, MessageSquare } from 'lucide-react';

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

const AdminDashboard = () => {
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);

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
        socket.on('new_complaint', (complaint) => {
            setComplaints(prev => [complaint, ...prev]);
        });

        return () => socket.disconnect();
    }, []);

    const updateStatus = async (id, status) => {
        try {
            const token = localStorage.getItem('token');
            const adminNotes = prompt(`Add a note for status update to ${status} (Optional):`, '');
            if (adminNotes === null) return; // User cancelled

            const res = await axios.put(`http://localhost:5000/api/complaints/${id}`, 
                { status, adminNotes },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            
            setComplaints(prev => prev.map(c => c._id === id ? res.data : c));
        } catch (err) {
            console.error(err);
            alert('Failed to update status');
        }
    };

    if (loading) return <div className="loader">Loading...</div>;

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2><ShieldCheck style={{ verticalAlign: 'middle', marginRight: '0.5rem', color: 'var(--primary)' }} /> Administration</h2>
                <div className="badge badge-pending">Total Complaints: {complaints.length}</div>
            </div>

            <div className="complaint-list" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
                {complaints.length === 0 ? (
                    <div className="glass-card">No complaints found.</div>
                ) : complaints.map(c => (
                    <div key={c._id} className="complaint-item" style={{ background: 'var(--bg-card)' }}>
                        <div className="complaint-header">
                            <span className={getStatusBadgeClass(c.status)}>{c.status}</span>
                            <span className="badge" style={{ background: 'rgba(255,255,255,0.1)' }}>{c.category}</span>
                        </div>
                        <div className="complaint-title" style={{ marginTop: '0.5rem' }}>{c.title}</div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.5rem', flex: 1 }}>{c.description}</div>
                        
                        <div className="complaint-meta" style={{ borderTop: '1px solid var(--border)', paddingTop: '0.75rem', marginTop: '1rem', flexDirection: 'column', gap: '0.5rem' }}>
                            <div><strong>Student:</strong> {c.createdBy?.name || 'Unknown'} ({c.createdBy?.email || 'N/A'})</div>
                            <div><strong>Date:</strong> {new Date(c.createdAt).toLocaleString()}</div>
                        </div>

                        {c.adminNotes && (
                            <div style={{ marginTop: '0.5rem', padding: '0.5rem', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', fontSize: '0.85rem' }}>
                                <MessageSquare size={14} style={{ verticalAlign: 'middle', marginRight: '4px' }} /> {c.adminNotes}
                            </div>
                        )}

                        <div className="admin-actions">
                            <button className="btn btn-outline btn-small" onClick={() => updateStatus(c._id, 'In Progress')} disabled={c.status === 'In Progress'}>Mark In Progress</button>
                            <button className="btn btn-outline btn-small" onClick={() => updateStatus(c._id, 'Resolved')} style={{ borderColor: 'var(--success)', color: 'var(--success)' }} disabled={c.status === 'Resolved'}>Resolve</button>
                            <button className="btn btn-outline btn-small" onClick={() => updateStatus(c._id, 'Rejected')} style={{ borderColor: 'var(--danger)', color: 'var(--danger)' }} disabled={c.status === 'Rejected'}>Reject</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminDashboard;
