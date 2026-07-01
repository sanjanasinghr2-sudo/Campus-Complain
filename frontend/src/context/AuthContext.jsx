import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

    useEffect(() => {
        const checkLoggedIn = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const res = await axios.get(`${API_URL}/auth/me`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setUser(res.data);
                } catch (err) {
                    console.error(err);
                    localStorage.removeItem('token');
                }
            }
            setLoading(false);
        };
        checkLoggedIn();
    }, [API_URL]);

    const login = async (email, password) => {
        const res = await axios.post(`${API_URL}/auth/login`, { email, password });
        localStorage.setItem('token', res.data.token);
        const userRes = await axios.get(`${API_URL}/auth/me`, {
            headers: { Authorization: `Bearer ${res.data.token}` }
        });
        setUser(userRes.data);
    };

    const register = async (name, email, password, role) => {
        const res = await axios.post(`${API_URL}/auth/register`, { name, email, password, role });
        localStorage.setItem('token', res.data.token);
        const userRes = await axios.get(`${API_URL}/auth/me`, {
            headers: { Authorization: `Bearer ${res.data.token}` }
        });
        setUser(userRes.data);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
