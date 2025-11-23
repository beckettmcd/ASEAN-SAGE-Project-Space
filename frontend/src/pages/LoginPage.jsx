import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login({ email, password });
      navigate('/');
    } catch (err) {
      // Log the full error for debugging
      console.error('Login error:', err);
      console.error('Error response:', err.response);
      console.error('Error data:', err.response?.data);
      console.error('Error message:', err.message);
      
      // Extract error message - handle both string and object responses
      let errorMessage = 'Login failed';
      
      if (err.response?.data) {
        const errorData = err.response.data;
        // Handle object with message property
        if (typeof errorData === 'object' && errorData.message && typeof errorData.message === 'string') {
          errorMessage = errorData.message;
        } 
        // Handle object with error property (string)
        else if (typeof errorData.error === 'string') {
          errorMessage = errorData.error;
        }
        // Handle string directly
        else if (typeof errorData === 'string') {
          errorMessage = errorData;
        }
        // Handle object with details array
        else if (errorData.details && Array.isArray(errorData.details) && errorData.details.length > 0) {
          const firstDetail = errorData.details[0];
          if (typeof firstDetail === 'string') {
            errorMessage = firstDetail;
          } else if (typeof firstDetail === 'object' && firstDetail.message) {
            errorMessage = firstDetail.message;
          } else if (errorData.message) {
            errorMessage = errorData.message;
          }
        }
        // If we still have the default, try to get any string property
        if (errorMessage === 'Login failed' && typeof errorData === 'object') {
          // Try common error message properties
          errorMessage = errorData.message || errorData.error || errorData.msg || errorMessage;
        }
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-primary-700">SAGE TA Tracker</h2>
            <p className="mt-2 text-sm text-gray-600">
              ASEAN-UK SAGE Programme Management System
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <div>
              <label className="label">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="label">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn btn-primary"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-xs font-semibold text-gray-700 mb-2">Demo Credentials:</p>
            <div className="text-xs text-gray-600 space-y-1">
              <p><strong>Admin:</strong> admin@sage.org / admin123</p>
              <p><strong>FCDO SRO:</strong> sro@fcdo.gov.uk / fcdo123</p>
              <p><strong>Focal Point:</strong> focal@edu.gov.th / focal123</p>
              <p><strong>Implementer:</strong> impl@dai.com / impl123</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

