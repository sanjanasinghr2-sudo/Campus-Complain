import { Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import AdminDashboard from './components/AdminDashboard';
import Navbar from './components/Navbar';

function App() {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <div className="loader">Loading...</div>;

  return (
    <div className="app-container">
      {user && <Navbar />}
      <div className="main-content">
        <Routes>
          <Route path="/" element={user ? (user.role === 'admin' ? <Navigate to="/admin" /> : <Navigate to="/dashboard" />) : <Navigate to="/login" />} />
          <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
          <Route path="/register" element={!user ? <Register /> : <Navigate to="/" />} />
          <Route path="/dashboard" element={user && user.role === 'student' ? <Dashboard /> : <Navigate to="/" />} />
          <Route path="/admin" element={user && user.role === 'admin' ? <AdminDashboard /> : <Navigate to="/" />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
