import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { loginUser, findUserByEmail } from '../../api/services';
import { useAuth } from '../../context/AuthContext';
import { jwtDecode } from 'jwt-decode';
import '../../styles/auth.css';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (location.state?.success) {
      setSuccessMsg(location.state.success);
    }
  }, [location.state]);

  const validate = () => {
    const errs = {};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      errs.email = 'Enter a valid email address';
    if (!form.password)
      errs.password = 'Password is required';
    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    setApiError('');

    try {
      
      const res = await loginUser(form.email, form.password);
      const token = res.data;

      console.log('Token received:', token);
      console.log('Token type:', typeof token);

      
      if (!token || typeof token !== 'string') {
        setApiError('Login failed — invalid response from server.');
        return;
      }

      const decoded = jwtDecode(token);
      console.log('Decoded JWT:', decoded);

      const role = decoded.role; 
      console.log('Role:', role);

      
      localStorage.setItem('token', token);

      
      let userId = null;
      try {
        const userRes = await findUserByEmail(form.email);
        userId = userRes.data?.userId;
        console.log('UserId fetched:', userId);
      } catch (e) {
        console.warn('Could not fetch userId:', e);
      }

      
      login(token, userId);

      
      if (role === 'OFFICER') {
        navigate('/officer/dashboard');
      } else {
        navigate('/dashboard');
      }

    } 
     catch (err) {
  console.error('Login error:', err);
  console.error('Response data:', err.response?.data);
  console.error('Response status:', err.response?.status);

  if (err.message === 'Network Error' || err.code === 'ERR_NETWORK') {
    setApiError('Cannot connect to server.');
  } else if (err.response?.status === 401) {
    setApiError('Invalid email or password.');
  } else if (err.response?.status === 403) {
    setApiError('Access denied. You do not have permission.');
  } else if (err.response?.status === 500) {
    setApiError('Server error. Please try again later.');
  } else if (err.response?.status === 404) {
    setApiError('User not found. Please register first.');
  } else {
    setApiError(
      err.response?.data?.message ||
      (typeof err.response?.data === 'string'
        ? err.response.data
        : 'Login failed. Please try again.')
    );
  }
}
    finally {
      setLoading(false);
    }

  };

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div className="auth-left-content">
          <div className="auth-logo">🛡️</div>
          <h2 className="auth-left-title">Welcome Back to AutoShield</h2>
          <p className="auth-left-sub">
            Sign in to manage your vehicle insurance policies,
            track proposals, and file claims.
          </p>
          <div className="auth-features">
            {[
              'View all your active policies',
              'Track proposal status',
              'Make premium payments',
              'Download policy documents',
            ].map(f => (
              <div className="auth-feature" key={f}>
                <span>✓</span>{f}
              </div>
            ))}
          </div>
          <div className="auth-testimonial">
            <div className="test-text">
              "AutoShield made vehicle insurance effortless.
              The digital process saved me hours!"
            </div>
            <div className="test-author">
              — Vikram S., Car Policy Holder
            </div>
          </div>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-form-wrap">
          <div className="auth-header">
            <h1 className="auth-title">Sign In</h1>
            <p className="auth-subtitle">
              Access your insurance dashboard
            </p>
          </div>

          {successMsg && (
            <div className="alert alert-success">✓ {successMsg}</div>
          )}
          {apiError && (
            <div className="alert alert-error">⚠️ {apiError}</div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                className={`form-control ${errors.email ? 'error' : ''}`}
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                autoComplete="email"
              />
              {errors.email && (
                <div className="error-msg">⚠ {errors.email}</div>
              )}
            </div>

            <div className="form-group">
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '0.4rem'
              }}>
                <label className="form-label" style={{ margin: 0 }}>
                  Password
                </label>
                <a href="#" className="auth-link" style={{ fontSize: '0.8rem' }}>
                  Forgot password?
                </a>
              </div>
              <div className="input-password-wrap">
                <input
                  className={`form-control ${errors.password ? 'error' : ''}`}
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(s => !s)}
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
              {errors.password && (
                <div className="error-msg">⚠ {errors.password}</div>
              )}
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-full btn-lg"
              disabled={loading}
              style={{ marginTop: '0.5rem' }}
            >
              {loading ? 'Signing In...' : 'Sign In →'}
            </button>
          </form>

          <div className="auth-footer-text">
            New to AutoShield?{' '}
            <Link to="/register" className="auth-link">
              Create an Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;