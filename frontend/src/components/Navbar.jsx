import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { LogOut, Bell, LayoutDashboard } from 'lucide-react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);

    return (
        <nav className="navbar">
            <Link to="/" style={{textDecoration: 'none'}}>
                <div className="nav-brand">CampusResolve</div>
            </Link>
            <div className="nav-links">
                <span style={{ color: 'var(--text-muted)' }}>Hello, {user?.name}</span>
                <Link to="/" className="btn btn-outline btn-small">
                    <LayoutDashboard size={18} /> Dashboard
                </Link>
                <button onClick={logout} className="btn btn-outline btn-small" style={{ borderColor: 'var(--danger)', color: 'var(--danger)' }}>
                    <LogOut size={18} /> Logout
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
