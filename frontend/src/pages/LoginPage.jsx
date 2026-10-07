import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Activity, Mail, Lock, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in both email and password.');
      return;
    }

    try {
      setSubmitting(true);
      await login({ email, password });
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleFillDemo = () => {
    setEmail('athlete@fittrack.com');
    setPassword('fitness123');
  };

  return (
    <div className="auth-page-container">
      <div className="auth-card glass-card">
        {/* Brand header */}
        <div className="auth-brand-head">
          <div className="auth-icon-wrap">
            <Activity size={28} />
          </div>
          <h2>Fit Tracker</h2>
          <div className="auth-creator-tag">by Srujan</div>
          <p>Sign in to access your personalized fitness metrics & AI coach</p>
        </div>

        {error && (
          <div className="alert alert-error">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div className="input-with-icon">
              <Mail size={18} className="input-icon" />
              <input
                type="email"
                className="form-input with-left-icon"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="input-with-icon">
              <Lock size={18} className="input-icon" />
              <input
                type="password"
                className="form-input with-left-icon"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary btn-submit"
            disabled={submitting}
          >
            {submitting ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span>Signing In...</span>
              </>
            ) : (
              <>
                <span>Sign In to Dashboard</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <div className="demo-helper">
          <button 
            type="button" 
            onClick={handleFillDemo} 
            className="btn-demo-pill"
          >
            ⚡ Auto-fill Demo Credentials
          </button>
        </div>

        <div className="auth-footer-prompt">
          <span>Don't have an account yet? </span>
          <Link to="/register" className="auth-link">Create Account</Link>
        </div>
      </div>

      <style>{`
        .auth-page-container {
          min-height: calc(100vh - 160px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2.5rem 1.5rem;
        }

        .auth-card {
          width: 100%;
          max-width: 440px;
          border-radius: var(--radius-xl);
          padding: 2.5rem 2rem;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6), 0 0 35px rgba(16, 185, 129, 0.12);
        }

        .auth-brand-head {
          text-align: center;
          margin-bottom: 2rem;
        }

        .auth-icon-wrap {
          width: 52px;
          height: 52px;
          margin: 0 auto 1rem;
          background: linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(6, 182, 212, 0.2));
          border: 1px solid var(--border-active);
          border-radius: var(--radius-lg);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--primary-light);
          box-shadow: 0 0 20px rgba(16, 185, 129, 0.25);
        }

        .auth-brand-head h2 {
          font-size: 1.75rem;
          font-weight: 800;
          color: #ffffff;
        }

        .auth-creator-tag {
          display: inline-block;
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          background: linear-gradient(135deg, #10b981 0%, #06b6d4 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-top: 0.2rem;
        }

        .auth-brand-head p {
          color: var(--text-muted);
          font-size: 0.875rem;
          margin-top: 0.35rem;
        }

        .input-with-icon {
          position: relative;
          display: flex;
          align-items: center;
        }

        .input-icon {
          position: absolute;
          left: 1rem;
          color: var(--text-dim);
          pointer-events: none;
        }

        .with-left-icon {
          padding-left: 2.75rem;
        }

        .btn-submit {
          width: 100%;
          padding: 0.85rem;
          font-size: 1rem;
          margin-top: 0.75rem;
        }

        .demo-helper {
          margin-top: 1.25rem;
          text-align: center;
        }

        .btn-demo-pill {
          background: rgba(255, 255, 255, 0.05);
          border: 1px dashed var(--border-subtle);
          color: var(--text-muted);
          font-size: 0.8rem;
          padding: 0.35rem 0.85rem;
          border-radius: var(--radius-full);
          cursor: pointer;
          transition: var(--transition);
        }

        .btn-demo-pill:hover {
          color: var(--primary-light);
          border-color: var(--primary);
          background: rgba(16, 185, 129, 0.1);
        }

        .auth-footer-prompt {
          text-align: center;
          margin-top: 1.75rem;
          font-size: 0.875rem;
          color: var(--text-muted);
          border-top: 1px solid var(--border-subtle);
          padding-top: 1.25rem;
        }

        .auth-link {
          color: var(--primary-light);
          font-weight: 600;
          text-decoration: none;
        }

        .auth-link:hover {
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
}
