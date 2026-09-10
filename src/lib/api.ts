// Determine API URL based on environment
const getApiBaseUrl = () => {
  // If explicitly set via environment variable, use it
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  // In production (deployed), use Render backend
  if (import.meta.env.PROD) {
    return 'https://doctorai-nava.onrender.com/api';
  }
  
  // In development, use localhost
  return 'http://localhost:3001/api';
};

const API_BASE_URL = getApiBaseUrl();

// Log API URL in development for debugging
if (import.meta.env.DEV) {
  console.log('🔗 API Base URL:', API_BASE_URL);
}

export interface User {
  id: string;
  name: string;
  email: string;
  role?: 'patient' | 'doctor';
  specialty?: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

export interface SignupData {
  name: string;
  email: string;
  password: string;
  role?: 'patient' | 'doctor';
  specialty?: string;
  licenseNumber?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

// Helper function to handle fetch errors
const handleFetchError = async (response: Response, defaultMessage: string) => {
  if (!response.ok) {
    let errorMessage = defaultMessage;
    try {
      const errorData = await response.json();
      errorMessage = errorData.error || errorData.message || defaultMessage;
    } catch {
      // If response is not JSON, use status text
      errorMessage = response.statusText || defaultMessage;
    }
    
    // Add more context for network errors
    if (!response.status) {
      errorMessage = 'Network error: Unable to connect to server. Please check your internet connection.';
    }
    
    throw new Error(errorMessage);
  }
  return response.json();
};


// Token management
export const tokenManager = {
  getToken: (): string | null => {
    return localStorage.getItem('auth_token');
  },

  setToken: (token: string): void => {
    localStorage.setItem('auth_token', token);
  },

  removeToken: (): void => {
    localStorage.removeItem('auth_token');
  },
};

// Local storage fallback for offline mode
const LOCAL_STORAGE_USERS_KEY = 'doctorai_local_users';
const LOCAL_STORAGE_CURRENT_USER_KEY = 'doctorai_current_user';

interface LocalUser {
  id: string;
  name: string;
  email: string;
  password: string; // Hashed in real scenario, but for simplicity storing plain (not recommended for production)
  role: 'patient' | 'doctor';
  specialty?: string;
  licenseNumber?: string;
  createdAt: string;
}

const localUserStorage = {
  getUsers: (): LocalUser[] => {
    try {
      const users = localStorage.getItem(LOCAL_STORAGE_USERS_KEY);
      return users ? JSON.parse(users) : [];
    } catch {
      return [];
    }
  },

  saveUser: (user: LocalUser): void => {
    const users = localUserStorage.getUsers();
    const existingIndex = users.findIndex(u => u.email === user.email);
    if (existingIndex >= 0) {
      users[existingIndex] = user;
    } else {
      users.push(user);
    }
    localStorage.setItem(LOCAL_STORAGE_USERS_KEY, JSON.stringify(users));
  },

  getUserByEmail: (email: string): LocalUser | null => {
    const users = localUserStorage.getUsers();
    return users.find(u => u.email === email) || null;
  },

  setCurrentUser: (user: User): void => {
    localStorage.setItem(LOCAL_STORAGE_CURRENT_USER_KEY, JSON.stringify(user));
  },

  getCurrentUser: (): User | null => {
    try {
      const user = localStorage.getItem(LOCAL_STORAGE_CURRENT_USER_KEY);
      return user ? JSON.parse(user) : null;
    } catch {
      return null;
    }
  },

  clearCurrentUser: (): void => {
    localStorage.removeItem(LOCAL_STORAGE_CURRENT_USER_KEY);
  },
};

// Simple password hashing for local storage (not secure, but better than plain text)
const simpleHash = (str: string): string => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash.toString();
};

// Enhanced Auth API with local storage fallback
export const authAPI = {
  signup: async (data: SignupData): Promise<AuthResponse> => {
    // Try backend first
    try {
      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        signal: AbortSignal.timeout(5000), // 5 second timeout
      });

      if (response.ok) {
        const result = await response.json();
        // Also save to local storage as backup
        const localUser: LocalUser = {
          id: result.user.id,
          name: data.name,
          email: data.email,
          password: simpleHash(data.password), // Simple hash for local storage
          role: data.role || 'patient',
          specialty: data.specialty,
          licenseNumber: data.licenseNumber,
          createdAt: new Date().toISOString(),
        };
        localUserStorage.saveUser(localUser);
        return result;
      }
    } catch (error) {
      // Backend failed, use local storage fallback
      console.log('Backend unavailable, using local storage fallback');
    }

    // Fallback to local storage
    const users = localUserStorage.getUsers();
    if (users.find(u => u.email === data.email)) {
      throw new Error('User with this email already exists');
    }

    const newUser: LocalUser = {
      id: Date.now().toString(),
      name: data.name,
      email: data.email,
      password: simpleHash(data.password),
      role: data.role || 'patient',
      specialty: data.specialty,
      licenseNumber: data.licenseNumber,
      createdAt: new Date().toISOString(),
    };

    localUserStorage.saveUser(newUser);

    // Generate a simple token for local storage
    const token = `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const user: User = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      specialty: newUser.specialty,
    };

    return {
      message: 'Account created successfully (offline mode)',
      token,
      user,
    };
  },

  login: async (data: LoginData): Promise<AuthResponse> => {
    // Try backend first
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        signal: AbortSignal.timeout(5000), // 5 second timeout
      });

      if (response.ok) {
        const result = await response.json();
        return result;
      }
    } catch (error) {
      // Backend failed, use local storage fallback
      console.log('Backend unavailable, using local storage fallback');
    }

    // Fallback to local storage
    const localUser = localUserStorage.getUserByEmail(data.email);
    if (!localUser) {
      throw new Error('Invalid email or password');
    }

    // Simple password check (compare hashes)
    if (localUser.password !== simpleHash(data.password)) {
      throw new Error('Invalid email or password');
    }

    // Generate a simple token for local storage
    const token = `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const user: User = {
      id: localUser.id,
      name: localUser.name,
      email: localUser.email,
      role: localUser.role,
      specialty: localUser.specialty,
    };

    return {
      message: 'Login successful (offline mode)',
      token,
      user,
    };
  },

  getCurrentUser: async (token: string): Promise<User> => {
    // If it's a local token, get from local storage
    if (token.startsWith('local_')) {
      const user = localUserStorage.getCurrentUser();
      if (user) {
        return user;
      }
      throw new Error('User not found');
    }

    // Try backend
    try {
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        signal: AbortSignal.timeout(3000),
      });

      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      // Backend failed, try local storage
      const user = localUserStorage.getCurrentUser();
      if (user) {
        return user;
      }
    }

    throw new Error('Failed to get user information');
  },
};

// Helper for authenticated headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};

// Appointments API connecting to Neon PostgreSQL
export const appointmentAPI = {
  getAppointments: async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/appointments`, { headers: getAuthHeaders() });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('Could not fetch appointments from backend:', e);
    }
    return [];
  },
  createAppointment: async (appointmentData: {
    doctorId: string | number;
    doctorName: string;
    specialty: string;
    date: string;
    time: string;
    reason?: string;
  }) => {
    const res = await fetch(`${API_BASE_URL}/appointments`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(appointmentData),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to book appointment');
    }
    return await res.json();
  }
};

// Medical Data API connecting directly to Neon PostgreSQL via backend
export const medicalAPI = {
  // 1. Vitals
  getVitals: async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/vitals`, { headers: getAuthHeaders() });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('Could not fetch vitals from backend:', e);
    }
    return [];
  },
  saveVital: async (data: any) => {
    const res = await fetch(`${API_BASE_URL}/vitals`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to save vital to database');
    return await res.json();
  },

  // 2. Health Records
  getHealthRecords: async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/health-records`, { headers: getAuthHeaders() });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('Could not fetch health records:', e);
    }
    return [];
  },
  saveHealthRecord: async (data: any) => {
    const res = await fetch(`${API_BASE_URL}/health-records`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to save health record to database');
    return await res.json();
  },

  // 3. Medications
  getMedications: async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/medications`, { headers: getAuthHeaders() });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('Could not fetch medications:', e);
    }
    return [];
  },
  saveMedication: async (data: any) => {
    const res = await fetch(`${API_BASE_URL}/medications`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to save medication to database');
    return await res.json();
  },

  // 4. Patients
  getPatients: async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/patients`, { headers: getAuthHeaders() });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('Could not fetch patients:', e);
    }
    return [];
  },
  savePatient: async (data: any) => {
    const res = await fetch(`${API_BASE_URL}/patients`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to save patient to database');
    return await res.json();
  },

  // 5. Inventory
  getInventory: async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/inventory`, { headers: getAuthHeaders() });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('Could not fetch inventory:', e);
    }
    return [];
  },
  saveInventoryItem: async (data: any) => {
    const res = await fetch(`${API_BASE_URL}/inventory`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to save inventory item to database');
    return await res.json();
  },

  // 6. Reminders
  getReminders: async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/reminders`, { headers: getAuthHeaders() });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('Could not fetch reminders:', e);
    }
    return [];
  },
  saveReminder: async (data: any) => {
    const res = await fetch(`${API_BASE_URL}/reminders`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to save reminder to database');
    return await res.json();
  },

  // 7. Health Logs
  getHealthLogs: async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/health-logs`, { headers: getAuthHeaders() });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('Could not fetch health logs:', e);
    }
    return [];
  },
  saveHealthLog: async (data: any) => {
    const res = await fetch(`${API_BASE_URL}/health-logs`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to save health log to database');
    return await res.json();
  },

  // 8. Consult Copilot
  getCopilotNotes: async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/copilot`, { headers: getAuthHeaders() });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('Could not fetch copilot notes:', e);
    }
    return [];
  },
  saveCopilotNote: async (data: any) => {
    const res = await fetch(`${API_BASE_URL}/copilot`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to save copilot note to database');
    return await res.json();
  },

  // 9. Personal Health Profile (Neon PostgreSQL users.data JSONB)
  getProfile: async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/profile`, { headers: getAuthHeaders() });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('Could not fetch profile:', e);
    }
    return null;
  },
  saveProfile: async (profileData: any) => {
    const res = await fetch(`${API_BASE_URL}/profile`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(profileData),
    });
    if (!res.ok) throw new Error('Failed to save profile to database');
    return await res.json();
  }
};


