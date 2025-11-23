import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error accessing localStorage in request interceptor:', error);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle network errors (no response from server)
    if (!error.response) {
      if (error.code === 'ECONNABORTED' || error.message === 'Network Error') {
        error.message = 'Network error. Please check your connection and try again.';
      } else if (error.message.includes('timeout')) {
        error.message = 'Request timeout. Please try again.';
      } else {
        error.message = error.message || 'Unable to connect to server. Please try again later.';
      }
      return Promise.reject(error);
    }

    // Handle HTTP status codes
    const status = error.response?.status;
    
    if (status === 401) {
      // Unauthorized - clear auth and redirect to login
      try {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      } catch (e) {
        console.error('Error clearing localStorage:', e);
      }
      // Only redirect if not already on login page
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    } else if (status === 403) {
      error.message = error.response?.data?.error || 'You do not have permission to perform this action.';
    } else if (status === 404) {
      error.message = error.response?.data?.error || 'The requested resource was not found.';
    } else if (status === 409) {
      error.message = error.response?.data?.error || 'A conflict occurred. The resource may already exist.';
    } else if (status === 422) {
      error.message = error.response?.data?.error || 'Validation error. Please check your input.';
    } else if (status >= 500) {
      error.message = error.response?.data?.error || 'Server error. Please try again later.';
    } else if (status >= 400) {
      error.message = error.response?.data?.error || error.message || 'An error occurred.';
    }

    return Promise.reject(error);
  }
);

// Export the base api instance
export { api };

// Auth endpoints
export const authApi = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (data) => api.post('/auth/register', data),
  getCurrentUser: () => api.get('/auth/me')
};

// Dashboard endpoints
export const dashboardApi = {
  getRegional: (params) => api.get('/dashboard/regional', { params }),
  getCountry: (countryId, params) => api.get(`/dashboard/country/${countryId}`, { params }),
  getWorkstream: (workstreamId) => api.get(`/dashboard/workstream/${workstreamId}`),
  getComprehensive: () => api.get('/dashboard/comprehensive')
};

// ToR endpoints
export const torApi = {
  getAll: (params) => api.get('/tors', { params }),
  getById: (id) => api.get(`/tors/${id}`),
  create: (data) => api.post('/tors', data),
  update: (id, data) => api.put(`/tors/${id}`, data),
  approve: (id) => api.post(`/tors/${id}/approve`),
  reject: (id, reason) => api.post(`/tors/${id}/reject`, { rejectionReason: reason }),
  submitForApproval: (id) => api.post(`/tors/${id}/submit`),
  delete: (id) => api.delete(`/tors/${id}`)
};

// Assignment endpoints
export const assignmentApi = {
  getAll: (params) => api.get('/assignments', { params }),
  getById: (id) => api.get(`/assignments/${id}`),
  getFinancials: (id) => api.get(`/assignments/${id}/financials`),
  getAllFinancials: () => api.get('/assignments/financials'),
  create: (data) => api.post('/assignments', data),
  update: (id, data) => api.put(`/assignments/${id}`, data),
  delete: (id) => api.delete(`/assignments/${id}`)
};

// Indicator endpoints
export const indicatorApi = {
  getAll: (params) => api.get('/indicators', { params }),
  getById: (id) => api.get(`/indicators/${id}`),
  create: (data) => api.post('/indicators', data),
  update: (id, data) => api.put(`/indicators/${id}`, data),
  delete: (id) => api.delete(`/indicators/${id}`),
  addResult: (id, data) => api.post(`/indicators/${id}/results`, data)
};

// Budget endpoints
export const budgetApi = {
  getAll: (params) => api.get('/budgets', { params }),
  getById: (id) => api.get(`/budgets/${id}`),
  create: (data) => api.post('/budgets', data),
  update: (id, data) => api.put(`/budgets/${id}`, data),
  delete: (id) => api.delete(`/budgets/${id}`),
  getSummary: (params) => api.get('/budgets/summary', { params })
};

// Risk endpoints
export const riskApi = {
  getAll: (params) => api.get('/risks', { params }),
  getById: (id) => api.get(`/risks/${id}`),
  create: (data) => api.post('/risks', data),
  update: (id, data) => api.put(`/risks/${id}`, data),
  delete: (id) => api.delete(`/risks/${id}`),
  getMatrix: (params) => api.get('/risks/matrix', { params })
};

// Evidence endpoints
export const evidenceApi = {
  getAll: (params) => api.get('/evidence', { params }),
  getById: (id) => api.get(`/evidence/${id}`),
  create: (data) => api.post('/evidence', data),
  update: (id, data) => api.put(`/evidence/${id}`, data),
  delete: (id) => api.delete(`/evidence/${id}`),
  linkToIndicator: (id, indicatorId) => api.post(`/evidence/${id}/link-indicator`, { indicatorId })
};

// Generic endpoints
export const genericApi = {
  countries: {
    getAll: (params) => api.get('/countries', { params }),
    getById: (id) => api.get(`/countries/${id}`),
    create: (data) => api.post('/countries', data),
    update: (id, data) => api.put(`/countries/${id}`, data)
  },
  programmes: {
    getAll: (params) => api.get('/programmes', { params }),
    getById: (id) => api.get(`/programmes/${id}`),
    create: (data) => api.post('/programmes', data),
    update: (id, data) => api.put(`/programmes/${id}`, data)
  },
  workstreams: {
    getAll: (params) => api.get('/workstreams', { params }),
    getById: (id) => api.get(`/workstreams/${id}`),
    create: (data) => api.post('/workstreams', data),
    update: (id, data) => api.put(`/workstreams/${id}`, data)
  },
  consultants: {
    getAll: (params) => api.get('/consultants', { params }),
    getById: (id) => api.get(`/consultants/${id}`),
    create: (data) => api.post('/consultants', data),
    update: (id, data) => api.put(`/consultants/${id}`, data)
  },
  deliverables: {
    getAll: (params) => api.get('/deliverables', { params }),
    getById: (id) => api.get(`/deliverables/${id}`),
    create: (data) => api.post('/deliverables', data),
    update: (id, data) => api.put(`/deliverables/${id}`, data)
  },
  issues: {
    getAll: (params) => api.get('/issues', { params }),
    getById: (id) => api.get(`/issues/${id}`),
    create: (data) => api.post('/issues', data),
    update: (id, data) => api.put(`/issues/${id}`, data)
  }
};

// Export endpoints
export const exportApi = {
  toJSON: (params) => api.get('/exports/json', { params }),
  toCSV: (params) => api.get('/exports/csv', { params, responseType: 'blob' }),
  toDevTracker: (params) => api.get('/exports/devtracker', { params }),
  toARPack: (params) => api.get('/exports/ar-pack', { params })
};

// Donor endpoints
export const donorApi = {
  getAllDonors: () => api.get('/donors'),
  getProjects: (params) => api.get('/donors/projects', { params }),
  getProjectById: (id) => api.get(`/donors/projects/${id}`),
  getCountryActivity: (countryCode) => api.get(`/donors/activity/${countryCode}`)
};

export default api;

