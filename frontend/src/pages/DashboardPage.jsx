import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { weightService } from '../api/weightService';
import { workoutService } from '../api/workoutService';
import MetricCard from '../components/MetricCard';
import WeightChart from '../components/WeightChart';
import { 
  Weight, 
  Ruler, 
  Activity, 
  Target, 
  Flame, 
  TrendingUp, 
  Bot, 
  Sparkles, 
  ArrowRight, 
  CheckCircle, 
  AlertCircle,
  Lightbulb,
  HeartPulse,
  Dumbbell
} from 'lucide-react';

export default function DashboardPage() {
  const { user, profile, refreshProfile } = useAuth();
  const navigate = useNavigate();

  const [weightHistory, setWeightHistory] = useState([]);
  const [stats, setStats] = useState(null);
  const [workoutStats, setWorkoutStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      if (user?.userId) {
        try {
          await refreshProfile();
          const [historyData, statsData, workoutData] = await Promise.all([
            weightService.getWeightHistory(user.userId).catch(() => []),
            weightService.getWeightStats(user.userId).catch(() => null),
            workoutService.getStats(user.userId).catch(() => null),
          ]);
          setWeightHistory(historyData || []);
          setStats(statsData);
          setWorkoutStats(workoutData);
        } catch (err) {
          console.error('Failed to load dashboard data:', err);
        } finally {
          setLoading(false);
        }
      }
    };

    loadDashboardData();
  }, [user?.userId]);

  const currentWeight = profile?.weight ?? stats?.currentWeight ?? '--';
  const height = profile?.height ?? '--';
  const bmi = profile?.bmi ?? '--';
  const bmiCategory = profile?.bmiCategory || 'Normal weight';
  const activityLevel = profile?.activityLevel || 'Moderately Active';
  const fitnessGoal = profile?.fitnessGoal || 'Healthy Lifestyle';

  // Determine badge type for BMI
  const getBmiBadgeType = (cat) => {
    const c = (cat || '').toLowerCase();
    if (c.includes('under')) return 'underweight';
    if (c.includes('over')) return 'overweight';
    if (c.includes('obese')) return 'obese';
    return 'normal';
  };

  // Curated general fitness tips based on BMI and Fitness Goal
  const getPersonalizedTips = () => {
    const tips = [];
    const lowerGoal = fitnessGoal.toLowerCase();
    const lowerBmi = bmiCategory.toLowerCase();

    if (lowerGoal.includes('loss') || lowerBmi.includes('over') || lowerBmi.includes('obese')) {
      tips.push({
        title: 'Caloric Mindfulness',
        desc: 'Prioritize high-volume, nutrient-dense foods like leafy greens, lean poultry, and legumes to feel full while maintaining a moderate caloric deficit.',
        icon: Target
      });
      tips.push({
        title: 'Non-Exercise Physical Activity (NEAT)',
        desc: 'Aim for 8,000–10,000 daily steps. Small daily habits like taking stairs and walking after meals burn up to 15% more calories than workouts alone.',
        icon: Flame
      });
    } else if (lowerGoal.includes('muscle')) {
      tips.push({
        title: 'Progressive Overload & Protein',
        desc: 'Focus on advancing weights or repetitions weekly. Strive for 1.6–2.2 grams of protein per kilogram of body weight to maximize muscle protein synthesis.',
        icon: TrendingUp
      });
      tips.push({
        title: 'Sleep & Hypertrophy',
        desc: 'Muscles rebuild during deep slow-wave sleep. Ensure 7.5 to 9 hours of uninterrupted nightly sleep for optimal growth hormone release.',
        icon: HeartPulse
      });
    } else {
      tips.push({
        title: 'Balanced Cardiovascular Health',
        desc: 'Incorporate 150 minutes of moderate aerobic exercise or 75 minutes of vigorous exercise each week as recommended by the World Health Organization.',
        icon: HeartPulse
      });
      tips.push({
        title: 'Consistent Daily Hydration',
        desc: 'Drink at least 35ml of water per kg of body weight daily. Proper hydration optimizes joint lubrication, digestion, and metabolic rate.',
        icon: Sparkles
      });
    }

    tips.push({
      title: 'Rest & Recovery Protocol',
      desc: 'Allow muscle groups 48 hours of recovery before high-intensity reloading. Active recovery days with light mobility work boost circulation.',
      icon: Activity
    });

    return tips;
  };

  const handleAskAiPrompt = (question) => {
    navigate('/ai-chat', { state: { prefilledQuestion: question } });
  };

  return (
    <div className="page-container dashboard-page">
      {/* Top Welcome Header */}
      <div className="welcome-banner glass-card">
        <div className="welcome-content">
          <div className="welcome-badge">
            <Sparkles size={14} className="text-emerald" />
            <span>FitTrack AI Intelligence</span>
          </div>
          <h1>Welcome back, <span className="gradient-text-emerald">{profile?.name || user?.name || 'Athlete'}</span></h1>
          <p className="welcome-motto">
            Tracking consistency is the bridge between your goals and your achievements.
          </p>
        </div>
        <div className="welcome-actions">
          <Link to="/workouts" className="btn btn-primary">
            <Dumbbell size={18} />
            <span>Log Workout</span>
          </Link>
          <Link to="/weight-tracking" className="btn btn-secondary">
            <TrendingUp size={18} />
            <span>Log Weight</span>
          </Link>
          <Link to="/ai-chat" className="btn btn-outline">
            <Bot size={18} />
            <span>AI Assistant</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid-kpi">
        <MetricCard
          title="Current Weight"
          value={currentWeight}
          unit="kg"
          icon={Weight}
          badge={stats?.netChange !== undefined ? `${stats.netChange >= 0 ? '+' : ''}${stats.netChange} kg` : null}
          badgeType={stats?.netChange > 0 ? 'overweight' : 'normal'}
          subtitle={stats?.latestDate ? `Latest record: ${stats.latestDate}` : 'Log your daily weight'}
          glowColor="emerald"
        />

        <MetricCard
          title="Height"
          value={height}
          unit="cm"
          icon={Ruler}
          subtitle="From physical profile"
          glowColor="cyan"
        />

        <MetricCard
          title="Body Mass Index"
          value={bmi}
          icon={Activity}
          badge={bmiCategory}
          badgeType={getBmiBadgeType(bmiCategory)}
          subtitle="Auto-calculated (WHO scale)"
          glowColor="purple"
        />

        <MetricCard
          title="Fitness Goal"
          value={fitnessGoal}
          icon={Target}
          badge={activityLevel}
          badgeType="accent"
          subtitle={`Activity: ${activityLevel}`}
          glowColor="amber"
        />
      </div>

      {/* Main Grid: Weight Progress & AI Assistant Callout */}
      <div className="grid-2col dashboard-main-grid">
        {/* Left: Weight Progress Summary Chart */}
        <div className="glass-card chart-preview-card">
          <div className="card-head-row">
            <div>
              <h3>Weight Trajectory</h3>
              <p className="card-sub">Your weight logs over time</p>
            </div>
            <Link to="/weight-tracking" className="btn btn-outline btn-sm">
              <span>View History</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <WeightChart data={weightHistory} height={240} />

          <div className="chart-stats-footer">
            <div className="stat-pill">
              <span className="pill-label">Starting</span>
              <span className="pill-val">{stats?.startingWeight ?? '--'} kg</span>
            </div>
            <div className="stat-pill">
              <span className="pill-label">Lowest</span>
              <span className="pill-val">{stats?.lowestWeight ?? '--'} kg</span>
            </div>
            <div className="stat-pill">
              <span className="pill-label">Highest</span>
              <span className="pill-val">{stats?.highestWeight ?? '--'} kg</span>
            </div>
            <div className="stat-pill">
              <span className="pill-label">Net Change</span>
              <span className={`pill-val ${(stats?.netChange || 0) < 0 ? 'text-emerald' : 'text-amber'}`}>
                {stats?.netChange !== undefined ? `${stats.netChange > 0 ? '+' : ''}${stats.netChange} kg` : '--'}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Gemini AI Coach Quick Prompts */}
        <div className="glass-card ai-spotlight-card">
          <div className="ai-spotlight-head">
            <div className="ai-spotlight-icon">
              <Bot size={24} />
            </div>
            <div>
              <h3>Gemini Fitness Assistant</h3>
              <p className="card-sub">Tailored to your {fitnessGoal} goal & {bmiCategory} BMI</p>
            </div>
          </div>

          <div className="ai-quick-box">
            <p className="ai-box-prompt">Ask your AI Coach instantly:</p>
            <div className="quick-prompt-buttons">
              <button 
                onClick={() => handleAskAiPrompt("What workout is suitable for me?")}
                className="btn-quick-chip"
              >
                <span>⚡ "What workout is suitable for me?"</span>
              </button>
              <button 
                onClick={() => handleAskAiPrompt("What should I eat before exercise?")}
                className="btn-quick-chip"
              >
                <span>⚡ "What should I eat before exercise?"</span>
              </button>
              <button 
                onClick={() => handleAskAiPrompt("How can I improve my fitness?")}
                className="btn-quick-chip"
              >
                <span>⚡ "How can I improve my fitness?"</span>
              </button>
              <button 
                onClick={() => handleAskAiPrompt("Give me hydration and recovery tips.")}
                className="btn-quick-chip"
              >
                <span>⚡ "Give me hydration and recovery tips."</span>
              </button>
            </div>
          </div>

          <div className="ai-card-footer">
            <Link to="/ai-chat" className="btn btn-primary btn-ai-full">
              <Sparkles size={18} />
              <span>Open Gemini Assistant</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Workout Progress Hub Preview */}
      <div className="glass-card workout-quick-banner" style={{ marginTop: '1.5rem', marginBottom: '1.5rem', padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(99, 102, 241, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#818cf8' }}>
              <Dumbbell size={26} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '700', margin: 0 }}>Workout & Training Hub</h3>
              <p style={{ margin: 0, color: 'var(--text-secondary, #94a3b8)', fontSize: '0.875rem' }}>
                Track exercises, sets, reps, and cumulative lift volume
              </p>
            </div>
          </div>
          <Link to="/workouts" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>Go to Workout Tracker</span>
            <ArrowRight size={16} />
          </Link>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginTop: '1.25rem' }}>
          <div className="stat-pill" style={{ padding: '0.85rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <span className="pill-label" style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Logged Sessions</span>
            <span className="pill-val" style={{ fontSize: '1.25rem', fontWeight: '700' }}>{workoutStats?.totalSessions ?? 0}</span>
          </div>
          <div className="stat-pill" style={{ padding: '0.85rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <span className="pill-label" style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Lift Volume</span>
            <span className="pill-val" style={{ fontSize: '1.25rem', fontWeight: '700' }}>{(workoutStats?.totalVolumeKg || 0).toLocaleString()} kg</span>
          </div>
          <div className="stat-pill" style={{ padding: '0.85rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <span className="pill-label" style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Training Time</span>
            <span className="pill-val" style={{ fontSize: '1.25rem', fontWeight: '700' }}>{workoutStats?.totalDurationMinutes ?? 0} mins</span>
          </div>
          <div className="stat-pill" style={{ padding: '0.85rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <span className="pill-label" style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Top Muscle Focus</span>
            <span className="pill-val text-emerald" style={{ fontSize: '1.15rem', fontWeight: '700' }}>{workoutStats?.mostUsedMuscleGroup || 'General'}</span>
          </div>
        </div>
      </div>

      {/* General Fitness Tips Section */}
      <div className="tips-section glass-card">
        <div className="tips-header">
          <div className="tips-title-wrap">
            <Lightbulb size={24} className="text-amber" />
            <div>
              <h3>General Fitness & Wellness Tips</h3>
              <p className="card-sub">Evidence-based guidelines tailored for your profile</p>
            </div>
          </div>
          <span className="badge badge-normal">Health Guidelines</span>
        </div>

        <div className="tips-grid">
          {getPersonalizedTips().map((tip, idx) => {
            const TipIcon = tip.icon;
            return (
              <div key={idx} className="tip-card">
                <div className="tip-icon-box">
                  <TipIcon size={20} />
                </div>
                <div>
                  <h4 className="tip-title">{tip.title}</h4>
                  <p className="tip-desc">{tip.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* WHO BMI Reference Guide */}
      <div className="bmi-guide-card glass-card">
        <h4>WHO Body Mass Index (BMI) Reference Scale</h4>
        <div className="bmi-scale-bars">
          <div className={`scale-segment seg-under ${bmiCategory === 'Underweight' ? 'active-seg' : ''}`}>
            <span className="seg-range">&lt; 18.5</span>
            <span className="seg-title">Underweight</span>
          </div>
          <div className={`scale-segment seg-normal ${bmiCategory === 'Normal weight' ? 'active-seg' : ''}`}>
            <span className="seg-range">18.5 – 24.9</span>
            <span className="seg-title">Normal Weight</span>
          </div>
          <div className={`scale-segment seg-over ${bmiCategory === 'Overweight' ? 'active-seg' : ''}`}>
            <span className="seg-range">25.0 – 29.9</span>
            <span className="seg-title">Overweight</span>
          </div>
          <div className={`scale-segment seg-obese ${bmiCategory === 'Obese' ? 'active-seg' : ''}`}>
            <span className="seg-range">≥ 30.0</span>
            <span className="seg-title">Obese</span>
          </div>
        </div>
      </div>

      <style>{`
        .dashboard-page {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .welcome-banner {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 1.5rem;
          padding: 2.25rem 2rem;
          background: linear-gradient(135deg, rgba(17, 24, 39, 0.85) 0%, rgba(15, 23, 42, 0.95) 100%);
          border: 1px solid rgba(16, 185, 129, 0.25);
        }

        .welcome-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.775rem;
          color: var(--primary-light);
          background: rgba(16, 185, 129, 0.12);
          border: 1px solid rgba(16, 185, 129, 0.25);
          padding: 0.25rem 0.65rem;
          border-radius: var(--radius-full);
          margin-bottom: 0.5rem;
          font-weight: 600;
        }

        .welcome-content h1 {
          font-size: 2.25rem;
          margin-bottom: 0.4rem;
        }

        .welcome-motto {
          color: var(--text-muted);
          font-size: 0.95rem;
          max-width: 540px;
        }

        .welcome-actions {
          display: flex;
          gap: 0.85rem;
          flex-wrap: wrap;
        }

        .card-head-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.25rem;
        }

        .card-sub {
          font-size: 0.825rem;
          color: var(--text-dim);
          margin-top: 0.15rem;
        }

        .chart-stats-footer {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 0.75rem;
          margin-top: 1.25rem;
          padding-top: 1rem;
          border-top: 1px solid var(--border-subtle);
        }

        @media (max-width: 600px) {
          .chart-stats-footer {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        .stat-pill {
          background: rgba(15, 23, 42, 0.5);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          padding: 0.5rem 0.75rem;
          display: flex;
          flex-direction: column;
        }

        .pill-label {
          font-size: 0.72rem;
          color: var(--text-muted);
          text-transform: uppercase;
        }

        .pill-val {
          font-size: 1rem;
          font-weight: 700;
          color: #ffffff;
        }

        /* AI Spotlight Card */
        .ai-spotlight-card {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          border-color: rgba(6, 182, 212, 0.3);
          background: linear-gradient(135deg, rgba(17, 24, 39, 0.8) 0%, rgba(6, 182, 212, 0.05) 100%);
        }

        .ai-spotlight-head {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1.25rem;
        }

        .ai-spotlight-icon {
          width: 48px;
          height: 48px;
          border-radius: var(--radius-md);
          background: rgba(6, 182, 212, 0.15);
          color: #22d3ee;
          border: 1px solid rgba(6, 182, 212, 0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 0 20px rgba(6, 182, 212, 0.2);
        }

        .ai-box-prompt {
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text-muted);
          margin-bottom: 0.75rem;
        }

        .quick-prompt-buttons {
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
        }

        .btn-quick-chip {
          text-align: left;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid var(--border-subtle);
          color: var(--text-main);
          padding: 0.65rem 0.95rem;
          border-radius: var(--radius-md);
          font-size: 0.85rem;
          cursor: pointer;
          transition: var(--transition);
        }

        .btn-quick-chip:hover {
          background: rgba(6, 182, 212, 0.12);
          border-color: rgba(6, 182, 212, 0.35);
          color: #22d3ee;
          transform: translateX(4px);
        }

        .ai-card-footer {
          margin-top: 1.5rem;
          padding-top: 1rem;
          border-top: 1px solid var(--border-subtle);
        }

        .btn-ai-full {
          width: 100%;
        }

        /* Tips Section */
        .tips-section {
          padding: 2rem;
        }

        .tips-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .tips-title-wrap {
          display: flex;
          align-items: center;
          gap: 0.85rem;
        }

        .tips-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.25rem;
        }

        .tip-card {
          background: rgba(15, 23, 42, 0.5);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          padding: 1.25rem;
          display: flex;
          gap: 1rem;
          transition: var(--transition);
        }

        .tip-card:hover {
          border-color: rgba(245, 158, 11, 0.3);
          background: rgba(15, 23, 42, 0.8);
        }

        .tip-icon-box {
          width: 40px;
          height: 40px;
          border-radius: var(--radius-md);
          background: rgba(245, 158, 11, 0.15);
          color: #fbbf24;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .tip-title {
          font-size: 0.95rem;
          font-weight: 700;
          color: #ffffff;
          margin-bottom: 0.35rem;
        }

        .tip-desc {
          font-size: 0.825rem;
          color: var(--text-muted);
          line-height: 1.5;
        }

        /* BMI Guide */
        .bmi-guide-card {
          padding: 1.5rem 2rem;
        }

        .bmi-guide-card h4 {
          font-size: 0.95rem;
          color: var(--text-muted);
          margin-bottom: 1rem;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }

        .bmi-scale-bars {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 0.5rem;
        }

        @media (max-width: 650px) {
          .bmi-scale-bars {
            grid-template-columns: 1fr 1fr;
          }
        }

        .scale-segment {
          border-radius: var(--radius-md);
          padding: 0.85rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          border: 1px solid transparent;
          transition: var(--transition);
        }

        .seg-range {
          font-size: 0.75rem;
          opacity: 0.8;
          font-weight: 500;
        }

        .seg-title {
          font-size: 0.85rem;
          font-weight: 700;
          margin-top: 0.2rem;
        }

        .seg-under { background: rgba(59, 130, 246, 0.12); color: #60a5fa; border-color: rgba(59, 130, 246, 0.25); }
        .seg-normal { background: rgba(16, 185, 129, 0.12); color: #34d399; border-color: rgba(16, 185, 129, 0.25); }
        .seg-over { background: rgba(245, 158, 11, 0.12); color: #fbbf24; border-color: rgba(245, 158, 11, 0.25); }
        .seg-obese { background: rgba(244, 63, 94, 0.12); color: #f87171; border-color: rgba(244, 63, 94, 0.25); }

        .active-seg {
          box-shadow: 0 0 20px currentColor;
          border-width: 2px;
          transform: scale(1.03);
          font-weight: 800;
        }
      `}</style>
    </div>
  );
}
