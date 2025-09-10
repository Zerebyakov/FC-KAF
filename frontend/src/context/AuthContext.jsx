import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react"
import baseUrl from "../components/api/myAPI";

const AuthContext = createContext();

const silentAxios = axios.create();

silentAxios.interceptors.response.use(
    (response) => response,
    (error) => {
        return Promise.reject(error);
    }
);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const getMe = async () => {
        try {
            const res = await axios.get(`${baseUrl}auth/me`, {
                withCredentials: true
            })
            setUser(res.data.data);
        } catch (error) {
            setUser(null);
        } finally {
            setLoading(false);
        }
    }
    const loginAdmin = async (email, password) => {
        try {
            const response = await silentAxios.post(`${baseUrl}auth/login/admin`, {
                email,
                password
            }, {
                withCredentials: true
            });
            
            if (response.data.success) {
                setUser(response.data.data);
                return { success: true, data: response.data.data };
            } else {
                return { 
                    success: false, 
                    error: response.data.message || 'Login gagal' 
                };
            }
        } catch (error) {
            return { 
                success: false, 
                error: error.response?.data?.message || 'Invalid credentials',
                status: error.response?.status
            };
        }
    }

    const loginUser = async (email, password) => {
        try {
            const response = await silentAxios.post(`${baseUrl}auth/login/user`, {
                email,
                password
            }, {
                withCredentials: true
            });
            
            if (response.data.success) {
                setUser(response.data.data);
                return { success: true, data: response.data.data };
            } else {
                return { 
                    success: false, 
                    error: response.data.message || 'Login gagal' 
                };
            }
        } catch (error) {
            return { 
                success: false, 
                error: error.response?.data?.message || 'Invalid credentials',
                status: error.response?.status
            };
        }
    }

    // Logout
    const logout = async () => {
        try {
            await axios.post(`${baseUrl}auth/logout`, {}, {
                withCredentials: true
            });
        } catch (error) {
            console.log('Logout error:', error);
        } finally {
            setUser(null);
        }
    };

    // Helper functions untuk cek role/type
    const isAuthenticated = () => !!user;
    
    const isAdmin = () => user?.role === 'admin';
    
    const isStaff = () => user?.role === 'staff';
    
    const isCustomer = () => user && !user.role; // Customer tidak punya role field
    
    const isAdminOrStaff = () => isAdmin() || isStaff();

    useEffect(() => {
        getMe();
    }, []);

    const value = {
        user,
        setUser,
        loading,
        loginAdmin,
        loginUser,
        logout,
        getMe,
        // Helper functions
        isAuthenticated,
        isAdmin,
        isStaff,
        isCustomer,
        isAdminOrStaff
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};