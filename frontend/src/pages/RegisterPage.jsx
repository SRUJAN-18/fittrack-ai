import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  UserPlus, 
  Mail, 
  Lock, 
  User, 
  Ruler, 
  Weight, 
  Flame, 
  Target, 
  AlertCircle, 
  Loader2,
  CheckCircle2
} from 'lucide-react';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    age: '',
    height: '',
    weight: '',
    activityLevel: 'Moderately Active',
    fitnessGoal: 'Healthy Lifestyle',
  });

  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Real-time BMI calculation preview
  const h = parseFloat(formData.height);
  const w = parseFloat(formData.weight);
  const previewBmi = (h > 0 && w > 0) ? Math.round((w / ((h / 100) * (h / 100))) * 10) / 10 : null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name || !formData.email || !formData.password) {
      setError('Name, email, and password are required.');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    try {
      setSubmitting(true);
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        age: formData.age ? parseInt(formData.age, 10) : null,
        height: formData.height ? parseFloat(formData.height) : null,
        weight: formData.weight ? parseFloat(formData.weight) : null,
        activityLevel: formData.activityLevel,
        fitnessGoal: formData.fitnessGoal,
      });
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Registration failed. Please check the provided information.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="register-page-container">
      <div className="register-card glass-card">
        {/* Header */}
        <div className="register-head">
          <div className="register-icon-wrap">
            <UserPlus size={26} />
          </div>
          <h2>Join FitTrack AI</h2>
          <p>Create your account and personalize your AI-powered fitness journey</p>
        </div>

        {error && (
          <div className="alert alert-error">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="register-form">
          {/* Account Basics */}
          <div className="form-section-title">1. Account Credentials</div>
          
          <div className="form-row-2">
            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <div className="input-with-icon">
                <User size={18} className="input-icon" />
                <input
                  type="text"
                  name="name"
                  className="form-input with-left-icon"
                  placeholder="Alex Morgan"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Email Address *</label>
              <div className="input-with-icon">
                <Mail size={18} className="input-icon" />
                <input
                  type="email"
                  name="email"
                  className="form-input with-left-icon"
                  placeholder="alex@fitness.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password *</label>
            <div className="input-with-icon">
              <Lock size={18} className="input-icon" />
              <input
                type="password"
                name="password"
                className="form-input with-left-icon"
                placeholder="At least 6 characters"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Biometrics */}
          <div className="form-section-title">2. Physical Profile & Goals</div>

          <div className="form-row-3">
            <div className="form-group">
              <label className="form-label">Age</label>
              <input
                type="number"
                name="age"
                className="form-input"
                placeholder="e.g. 26"
                min="10"
                max="120"
                value={formData.age}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Height (cm)</label>
              <div className="input-with-icon">
                <Ruler size={16} className="input-icon" />
                <input
                  type="number"
                  name="height"
                  className="form-input with-left-icon"
                  placeholder="e.g. 178"
                  min="50"
                  max="250"
                  step="0.1"
                  value={formData.height}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Starting Weight (kg)</label>
              <div className="input-with-icon">
                <Weight size={16} className="input-icon" />
                <input
                  type="number"
                  name="weight"
                  className="form-input with-left-icon"
                  placeholder="e.g. 74.5"
                  min="20"
                  max="350"
                  step="0.1"
                  value={formData.weight}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {previewBmi && (
            <div className="bmi-live-preview">
              <CheckCircle2 size={16} className="text-emerald" />
              <span>Calculated Starting BMI: <strong>{previewBmi}</strong></span>
              <span className="badge badge-accent">Auto-computed</span>
            </div>
          )}

          <div className="form-row-2">
            <div className="form-group">
              <label className="form-label">Activity Level</label>
              <div className="input-with-icon">
                <Flame size={18} className="input-icon" />
                <select
                  name="activityLevel"
                  className="form-select with-left-icon"
                  value={formData.activityLevel}
                  onChange={handleChange}
                >
                  <option value="Sedentary">Sedentary (Little or no exercise)</option>
                  <option value="Lightly Active">Lightly Active (1-3 days/week)</option>
                  <option value="Moderately Active">Moderately Active (3-5 days/week)</option>
                  <option value="Very Active">Very Active (6-7 days/week)</option>
                  <option value="Athlete">Athlete (Intense training daily)</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Fitness Goal</label>
              <div className="input-with-icon">
                <Target size={18} className="input-icon" />
                <select
                  name="fitnessGoal"
                  className="form-select with-left-icon"
                  value={formData.fitnessGoal}
                  onChange={handleChange}
                >
                  <option value="Weight Loss">Weight Loss</option>
                  <option value="Muscle Gain">Muscle Gain / Hypertrophy</option>
                  <option value="Endurance">Cardio & Endurance</option>
                  <option value="Maintenance">Weight Maintenance</option>
                  <option value="Healthy Lifestyle">Healthy Lifestyle & Wellness</option>
                </select>
              </div>
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
                <span>Creating Your Account...</span>
              </>
            ) : (
              <span>Create Account & Start Tracking</span>
            )}
          </button>
        </form>

        <div className="auth-footer-prompt">
          <span>Already registered? </span>
          <Link to="/login" className="auth-link">Sign In</Link>
        </div>
      </div>

      <style>{`
        .register-page-container {
          min-height: calc(100vh - 160px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2.5rem 1.5rem;
        }

        .register-card {
          width: 100%;
          max-width: 620px;
          border-radius: var(--radius-xl);
          padding: 2.5rem;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6), 0 0 35px rgba(16, 185, 129, 0.12);
        }

        .register-head {
          text-align: center;
          margin-bottom: 2rem;
        }

        .register-icon-wrap {
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

        .register-head h2 {
          font-size: 1.85rem;
          font-weight: 800;
          color: #ffffff;
        }

        .register-head p {
          color: var(--text-muted);
          font-size: 0.875rem;
          margin-top: 0.35rem;
        }

        .form-section-title {
          font-size: 0.825rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--primary-light);
          margin: 1.25rem 0 0.85rem;
          padding-bottom: 0.4rem;
          border-bottom: 1px solid var(--border-subtle);
        }

        .form-row-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .form-row-3 {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 1rem;
        }

        @media (max-width: 640px) {
          .form-row-2, .form-row-3 {
            grid-template-columns: 1fr;
          }
          .register-card {
            padding: 1.75rem 1.25rem;
          }
        }

        .bmi-live-preview {
          background: rgba(16, 185, 129, 0.1);
          border: 1px solid rgba(16, 185, 129, 0.25);
          border-radius: var(--radius-md);
          padding: 0.65rem 1rem;
          margin-bottom: 1.25rem;
          display: flex;
          align-items: center;
          gap: 0.6rem;
          font-size: 0.875rem;
          color: #d1fae5;
        }

        .bmi-live-preview strong {
          color: #34d399;
          font-size: 1rem;
        }

        .btn-submit {
          width: 100%;
          padding: 0.9rem;
          font-size: 1rem;
          margin-top: 1rem;
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
