import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../../api/services';
import '../../styles/auth.css';

const getPasswordStrength = (pwd) => {
  let score = 0;
  if (pwd.length >= 5) score++;
  if (pwd.length >= 8) score++;
  if (/[A-Z]/.test(pwd)) score++;
  if (/[0-9]/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;
  return score;
};

const Register = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: '',
    email: '',
    passwordHash: '',
    confirmPassword: '',
    fullName: '',
    address: '',
    phoneNumber: '',
    role: 'USER',
  });

  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.username || form.username.length < 3 || form.username.length > 20)
      e.username = 'Username must be 3–20 characters';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = 'Enter a valid email address';
    if (!form.passwordHash || form.passwordHash.length < 5)
      e.passwordHash = 'Password must be at least 5 characters';
    if (form.confirmPassword !== form.passwordHash)
      e.confirmPassword = 'Passwords do not match';
    if (!form.fullName.trim())
      e.fullName = 'Full name is required';
    if (!form.address.trim())
      e.address = 'Address is required';
    if (!/^[0-9]{10}$/.test(form.phoneNumber))
      e.phoneNumber = 'Phone number must be exactly 10 digits';
    return e;
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

    const payload = {
      username: form.username.trim(),
      email: form.email.trim(),
      passwordHash: form.passwordHash,
      fullName: form.fullName.trim(),
      address: form.address.trim(),
      phoneNumber: form.phoneNumber.trim(),
      role: form.role,
    };

    try {
      await registerUser(payload);
      navigate('/login', {
        state: { success: 'Registration successful! Please login.' }
      });
    } catch (err) {
      console.error('Register error:', err);
      if (err.message === 'Network Error' || err.code === 'ERR_NETWORK') {
        setApiError('Cannot connect to server. Please make sure Spring Boot is running on port 8080.');
      } else {
        setApiError(
          err.response?.data?.message ||
          err.response?.data ||
          'Registration failed. Please try again.'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const strength = getPasswordStrength(form.passwordHash);
  const strengthLabel = ['', 'Very Weak', 'Weak', 'Fair', 'Good', 'Strong'][strength];
  const strengthClass = ['', 'weak', 'weak', 'fair', 'good', 'strong'][strength];

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div className="auth-left-content">
          <div className="auth-logo">🛡️</div>
          <h2 className="auth-left-title">Join AutoShield Insurance</h2>
          <p className="auth-left-sub">
            Get comprehensive vehicle insurance coverage with
            instant policy documents and transparent pricing.
          </p>
          <div className="auth-features">
            {[
              'Quick proposal submission',
              'Real-time status tracking',
              'Digital policy document',
              'Fast claim settlement',
            ].map(f => (
              <div className="auth-feature" key={f}>
                <span>✓</span>{f}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-form-wrap">
          <div className="auth-header">
            <h1 className="auth-title">Create Account</h1>
            <p className="auth-subtitle">
              Fill in your details to get started
            </p>
          </div>

          {apiError && (
            <div className="alert alert-error">⚠️ {apiError}</div>
          )}

          <form onSubmit={handleSubmit} noValidate>

           
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Username *</label>
                <input
                  className={`form-control ${errors.username ? 'error' : ''}`}
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  placeholder="e.g. rajesh_kumar"
                />
                {errors.username && (
                  <div className="error-msg">⚠ {errors.username}</div>
                )}
              </div>
              <div className="form-group">
                <label className="form-label">Register As *</label>
                <select
                  className="form-control"
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                >
                  <option value="USER">Customer (User)</option>
                  <option value="OFFICER">Insurance Officer</option>
                </select>
              </div>
            </div>

            
            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <input
                className={`form-control ${errors.fullName ? 'error' : ''}`}
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                placeholder="As per your ID"
              />
              {errors.fullName && (
                <div className="error-msg">⚠ {errors.fullName}</div>
              )}
            </div>

           
            <div className="form-group">
              <label className="form-label">Email Address *</label>
              <input
                className={`form-control ${errors.email ? 'error' : ''}`}
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
              />
              {errors.email && (
                <div className="error-msg">⚠ {errors.email}</div>
              )}
            </div>

            
            <div className="form-group">
              <label className="form-label">Phone Number *</label>
              <input
                className={`form-control ${errors.phoneNumber ? 'error' : ''}`}
                name="phoneNumber"
                value={form.phoneNumber}
                onChange={handleChange}
                placeholder="10-digit mobile number"
                maxLength={10}
              />
              {errors.phoneNumber && (
                <div className="error-msg">⚠ {errors.phoneNumber}</div>
              )}
            </div>

           
            <div className="form-group">
              <label className="form-label">Address *</label>
              <textarea
                className={`form-control ${errors.address ? 'error' : ''}`}
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="Your full address"
                rows={2}
              />
              {errors.address && (
                <div className="error-msg">⚠ {errors.address}</div>
              )}
            </div>

            
            <div className="form-group">
              <label className="form-label">Password *</label>
              <input
                className={`form-control ${errors.passwordHash ? 'error' : ''}`}
                type="password"
                name="passwordHash"
                value={form.passwordHash}
                onChange={handleChange}
                placeholder="Minimum 5 characters"
              />
              {errors.passwordHash && (
                <div className="error-msg">⚠ {errors.passwordHash}</div>
              )}
              {form.passwordHash && (
                <div className="password-strength">
                  <div className="strength-bar">
                    {[1, 2, 3, 4, 5].map(i => (
                      <div
                        key={i}
                        className={`strength-segment ${i <= strength ? strengthClass : ''}`}
                      />
                    ))}
                  </div>
                  <div className="strength-text">
                    {strengthLabel}
                  </div>
                </div>
              )}
            </div>

            
            <div className="form-group">
              <label className="form-label">Confirm Password *</label>
              <input
                className={`form-control ${errors.confirmPassword ? 'error' : ''}`}
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="Re-enter your password"
              />
              {errors.confirmPassword && (
                <div className="error-msg">⚠ {errors.confirmPassword}</div>
              )}
              {form.confirmPassword && !errors.confirmPassword &&
                form.confirmPassword === form.passwordHash && (
                  <div className="success-msg">✓ Passwords match</div>
                )}
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-full btn-lg"
              disabled={loading}
            >
              {loading ? 'Creating Account...' : 'Create Account 🎉'}
            </button>
          </form>

          <div className="auth-footer-text">
            Already have an account?{' '}
            <Link to="/login" className="auth-link">Sign In</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;