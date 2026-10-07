import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { userService } from '../api/userService';
import { 
  User, 
  Mail, 
  Calendar, 
  Ruler, 
  Weight, 
  Flame, 
  Target, 
  CheckCircle2, 
  AlertCircle, 
  Save, 
  Loader2,
  Sparkles,
  Activity
} from 'lucide-react';

export default function ProfilePage() {
  const { user, profile, setProfile, refreshProfile } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    age: '',
    height: '',
    weight: '',
    activityLevel: 'Moderately Active',
    fitnessGoal: 'Healthy Lifestyle',
  });

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        email: profile.email || '',
        age: profile.age ?? '',
        height: profile.height ?? '',
        weight: profile.weight ?? '',
        activityLevel: profile.activityLevel || 'Moderately Active',
        fitnessGoal: profile.fitnessGoal || 'Healthy Lifestyle',
      });
    } else if (user?.userId) {
      userService.getProfile(user.userId).then((p) => {
        setFormData({
          name: p.name || '',
          email: p.email || '',
          age: p.age ?? '',
          height: p.height ?? '',
          weight: p.weight ?? '',
          activityLevel: p.activityLevel || 'Moderately Active',
          fitnessGoal: p.fitnessGoal || 'Healthy Lifestyle',
        });
      });
    }
  }, [profile, user?.userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Real-time calculated BMI
  const h = parseFloat(formData.height);
  const w = parseFloat(formData.weight);
  const calculatedBmi = (h > 0 && w > 0) ? Math.round((w / ((h / 100) * (h / 100))) * 10) / 10 : null;

  const getBmiCategoryText = (bmiVal) => {
    if (!bmiVal) return 'N/A';
    if (bmiVal < 18.5) return 'Underweight';
    if (bmiVal < 25.0) return 'Normal weight';
    if (bmiVal < 30.0) return 'Overweight';
    return 'Obese';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg('');
    setErrorMsg('');

    if (!user?.userId) {
      setErrorMsg('No user logged in.');
      return;
    }

    try {
      setLoading(true);
      const updated = await userService.updateProfile(user.userId, {
        name: formData.name,
        age: formData.age ? parseInt(formData.age, 10) : null,
        height: formData.height ? parseFloat(formData.height) : null,
        weight: formData.weight ? parseFloat(formData.weight) : null,
        activityLevel: formData.activityLevel,
        fitnessGoal: formData.fitnessGoal,
      });

      setProfile(updated);
      setSuccessMsg('Your fitness profile has been successfully updated!');
      setTimeout(() => setSuccessMsg(''), 4500);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container profile-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Personal Profile</h1>
          <p className="page-subtitle">Manage your biometric credentials, physical stats, and fitness preferences</p>
        </div>
      </div>

      {successMsg && (
        <div className="alert alert-success">
          <CheckCircle2 size={18} />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="alert alert-error">
          <AlertCircle size={18} />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="profile-layout-grid">
        {/* Profile Card Preview */}
        <div className="glass-card profile-summary-card">
          <div className="profile-avatar-large">
            {(formData.name || 'U').charAt(0).toUpperCase()}
          </div>
          <h3 className="profile-name-heading">{formData.name || 'Athlete'}</h3>
          <p className="profile-email-sub">{formData.email}</p>

          <div className="profile-badges-strip">
            <span className="badge badge-normal">{formData.fitnessGoal}</span>
            <span className="badge badge-accent">{formData.activityLevel}</span>
          </div>

          <div className="profile-stats-card">
            <div className="p-stat">
              <span className="p-stat-lbl">Height</span>
              <span className="p-stat-val">{formData.height ? `${formData.height} cm` : '--'}</span>
            </div>
            <div className="p-stat">
              <span className="p-stat-lbl">Weight</span>
              <span className="p-stat-val">{formData.weight ? `${formData.weight} kg` : '--'}</span>
            </div>
            <div className="p-stat">
              <span className="p-stat-lbl">BMI</span>
              <span className="p-stat-val text-emerald">{calculatedBmi ?? '--'}</span>
            </div>
          </div>

          <div className="ai-context-notice">
            <Sparkles size={16} className="text-cyan" />
            <p>
              Your Gemini AI Assistant automatically uses these biometric attributes to customize workout volume, nutrition macros, and recovery strategies.
            </p>
          </div>
        </div>

        {/* Edit Form */}
        <div className="glass-card profile-form-card">
          <form onSubmit={handleSubmit}>
            <div className="form-section-header">
              <User size={18} className="text-emerald" />
              <span>Identity & Contact</span>
            </div>

            <div className="grid-2col">
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  name="name"
                  className="form-input"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email Address (Read-only)</label>
                <input
                  type="email"
                  name="email"
                  className="form-input"
                  value={formData.email}
                  disabled
                  style={{ opacity: 0.65, cursor: 'not-allowed' }}
                />
              </div>
            </div>

            <div className="form-section-header">
              <Activity size={18} className="text-emerald" />
              <span>Biometric Parameters</span>
            </div>

            <div className="grid-3col">
              <div className="form-group">
                <label className="form-label">Age (years)</label>
                <input
                  type="number"
                  name="age"
                  className="form-input"
                  placeholder="e.g. 28"
                  min="10"
                  max="120"
                  value={formData.age}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Height (cm)</label>
                <input
                  type="number"
                  name="height"
                  className="form-input"
                  placeholder="e.g. 175"
                  min="50"
                  max="260"
                  step="0.1"
                  value={formData.height}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Weight (kg)</label>
                <input
                  type="number"
                  name="weight"
                  className="form-input"
                  placeholder="e.g. 70"
                  min="20"
                  max="350"
                  step="0.1"
                  value={formData.weight}
                  onChange={handleChange}
                />
              </div>
            </div>

            {calculatedBmi && (
              <div className="live-bmi-indicator">
                <div className="bmi-ind-left">
                  <span className="lbl">Computed BMI:</span>
                  <span className="val">{calculatedBmi}</span>
                </div>
                <span className="badge badge-normal">
                  {getBmiCategoryText(calculatedBmi)}
                </span>
              </div>
            )}

            <div className="form-section-header">
              <Target size={18} className="text-emerald" />
              <span>Lifestyle & Fitness Direction</span>
            </div>

            <div className="grid-2col">
              <div className="form-group">
                <label className="form-label">Activity Level</label>
                <select
                  name="activityLevel"
                  className="form-select"
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

              <div className="form-group">
                <label className="form-label">Fitness Goal</label>
                <select
                  name="fitnessGoal"
                  className="form-select"
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

            <div className="profile-actions-bottom">
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    <span>Saving Changes...</span>
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    <span>Save Profile Changes</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      <style>{`
        .profile-page {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .profile-layout-grid {
          display: grid;
          grid-template-columns: 320px 1fr;
          gap: 1.75rem;
          align-items: start;
        }

        @media (max-width: 880px) {
          .profile-layout-grid {
            grid-template-columns: 1fr;
          }
        }

        .profile-summary-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 2.25rem 1.75rem;
        }

        .profile-avatar-large {
          width: 76px;
          height: 76px;
          border-radius: 50%;
          background: var(--primary-gradient);
          color: #042f1a;
          font-size: 2rem;
          font-weight: 800;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 0 25px rgba(16, 185, 129, 0.35);
          margin-bottom: 1rem;
        }

        .profile-name-heading {
          font-size: 1.35rem;
          margin-bottom: 0.2rem;
        }

        .profile-email-sub {
          font-size: 0.85rem;
          color: var(--text-muted);
          margin-bottom: 1.25rem;
        }

        .profile-badges-strip {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
          justify-content: center;
          margin-bottom: 1.5rem;
        }

        .profile-stats-card {
          width: 100%;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0.5rem;
          background: rgba(15, 23, 42, 0.6);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          padding: 1rem 0.5rem;
          margin-bottom: 1.5rem;
        }

        .p-stat {
          display: flex;
          flex-direction: column;
        }

        .p-stat-lbl {
          font-size: 0.725rem;
          color: var(--text-dim);
          text-transform: uppercase;
        }

        .p-stat-val {
          font-size: 1.05rem;
          font-weight: 700;
          color: #ffffff;
          margin-top: 0.2rem;
        }

        .ai-context-notice {
          display: flex;
          gap: 0.75rem;
          text-align: left;
          background: rgba(6, 182, 212, 0.08);
          border: 1px solid rgba(6, 182, 212, 0.25);
          padding: 0.85rem 1rem;
          border-radius: var(--radius-md);
          font-size: 0.775rem;
          color: #bae6fd;
          line-height: 1.45;
        }

        .form-section-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.85rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--text-muted);
          margin: 1.5rem 0 1rem;
          padding-bottom: 0.4rem;
          border-bottom: 1px solid var(--border-subtle);
        }

        .form-section-header:first-of-type {
          margin-top: 0;
        }

        .live-bmi-indicator {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: rgba(16, 185, 129, 0.1);
          border: 1px solid rgba(16, 185, 129, 0.25);
          border-radius: var(--radius-md);
          padding: 0.75rem 1.25rem;
          margin: 0.5rem 0 1.25rem;
        }

        .bmi-ind-left {
          display: flex;
          align-items: baseline;
          gap: 0.5rem;
        }

        .bmi-ind-left .lbl {
          font-size: 0.85rem;
          color: var(--text-muted);
        }

        .bmi-ind-left .val {
          font-size: 1.25rem;
          font-weight: 800;
          color: #34d399;
        }

        .profile-actions-bottom {
          margin-top: 2rem;
          display: flex;
          justify-content: flex-end;
        }
      `}</style>
    </div>
  );
}
