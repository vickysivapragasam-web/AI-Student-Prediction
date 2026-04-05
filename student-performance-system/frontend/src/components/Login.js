import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Alert from './common/Alert';
import { getDefaultRoute } from '../utils/roles';

const Login = ({ onSwitchMode }) => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ identifier: '', password: '' });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (!form.identifier || !form.password) {
      setError('Please enter your email and password.');
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await login({
        identifier: form.identifier,
        password: form.password,
      });

      navigate(getDefaultRoute(response.user), { replace: true });
    } catch (error) {
      setError(error.response?.data?.error || 'Login failed. Please check your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-form-shell">
      <div className="auth-form-header">
        <h2>Sign in to continue</h2>
        <p>Access the prediction portal, leaderboard, and your personal performance history.</p>
      </div>

      <Alert tone="error">{error}</Alert>

      <form className="form-stack" onSubmit={handleSubmit}>
        <label className="field">
          <span className="field-label">Email / Username</span>
          <input
            type="text"
            placeholder="you@example.com"
            value={form.identifier}
            onChange={(event) => setForm((current) => ({ ...current, identifier: event.target.value }))}
          />
        </label>

        <label className="field">
          <span className="field-label">Password</span>
          <input
            type="password"
            placeholder="Enter your password"
            value={form.password}
            onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
          />
        </label>

        <button className="button-primary" type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Signing in...' : 'Login'}
        </button>
      </form>

      <div className="auth-form-footer">
        <span>Need an account?</span>
        <button className="button-link" type="button" onClick={() => onSwitchMode('register')}>
          Register here
        </button>
      </div>
    </div>
  );
};

export default Login;
