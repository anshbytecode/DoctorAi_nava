import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI, tokenManager, User } from '@/lib/api';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string, role?: 'patient' | 'doctor', specialty?: string, licenseNumber?: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const initAuth = async () => {
      const token = tokenManager.getToken();
      if (token) {
        try {
          const userData = await authAPI.getCurrentUser(token);
          setUser(userData);
        } catch (error) {
          console.error('Failed to get user from backend, checking local storage:', error);
          // Try to get from local storage as fallback
          try {
            const localUser = JSON.parse(localStorage.getItem('doctorai_current_user') || 'null');
            if (localUser) {
              setUser(localUser);
            } else {
              tokenManager.removeToken();
            }
          } catch {
            tokenManager.removeToken();
          }
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const response = await authAPI.login({ email, password });
    tokenManager.setToken(response.token);
    setUser(response.user);
    // Save to local storage as backup
    localStorage.setItem('doctorai_current_user', JSON.stringify(response.user));
    // Navigate to appropriate dashboard based on role
    if (response.user.role === 'doctor') {
      navigate('/doctor-dashboard');
    } else {
      navigate('/');
    }
  };

  const signup = async (name: string, email: string, password: string, role: 'patient' | 'doctor' = 'patient', specialty?: string, licenseNumber?: string) => {
    const response = await authAPI.signup({ name, email, password, role, specialty, licenseNumber });
    tokenManager.setToken(response.token);
    setUser(response.user);
    // Save to local storage as backup
    localStorage.setItem('doctorai_current_user', JSON.stringify(response.user));
    // Navigate to appropriate dashboard based on role
    if (role === 'doctor') {
      navigate('/doctor-dashboard');
    } else {
      navigate('/');
    }
  };

  const logout = () => {
    tokenManager.removeToken();
    localStorage.removeItem('doctorai_current_user');
    setUser(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

