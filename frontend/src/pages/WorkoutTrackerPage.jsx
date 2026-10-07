import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { workoutService } from '../api/workoutService';
import MetricCard from '../components/MetricCard';
import {
  Dumbbell,
  PlusCircle,
  Trash2,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Clock,
  Flame,
  Target,
  BarChart3,
  X,
  Plus,
  Zap,
} from 'lucide-react';

const MUSCLE_GROUPS = [
  'Chest', 'Back', 'Shoulders', 'Biceps', 'Triceps',
  'Forearms', 'Core / Abs', 'Quads', 'Hamstrings',
  'Glutes', 'Calves', 'Full Body', 'Cardio / Conditioning',
];

const WORKOUT_TEMPLATES = [
  {
    name: 'Push Day (Chest & Shoulders)',
    duration: 60,
    exercises: [
      { exerciseName: 'Barbell Bench Press', muscleGroup: 'Chest', sets: 4, reps: 8, weightKg: 60 },
      { exerciseName: 'Incline Dumbbell Press', muscleGroup: 'Chest', sets: 3, reps: 12, weightKg: 24 },
      { exerciseName: 'Overhead Press', muscleGroup: 'Shoulders', sets: 3, reps: 10, weightKg: 40 },
      { exerciseName: 'Lateral Raises', muscleGroup: 'Shoulders', sets: 3, reps: 15, weightKg: 10 },
      { exerciseName: 'Tricep Rope Pushdown', muscleGroup: 'Triceps', sets: 3, reps: 12, weightKg: 20 },
    ],
  },
  {
    name: 'Pull Day (Back & Biceps)',
    duration: 60,
    exercises: [
      { exerciseName: 'Deadlift', muscleGroup: 'Back', sets: 4, reps: 5, weightKg: 100 },
      { exerciseName: 'Barbell Row', muscleGroup: 'Back', sets: 4, reps: 8, weightKg: 60 },
      { exerciseName: 'Lat Pulldown', muscleGroup: 'Back', sets: 3, reps: 12, weightKg: 50 },
      { exerciseName: 'Seated Cable Row', muscleGroup: 'Back', sets: 3, reps: 12, weightKg: 55 },
      { exerciseName: 'Barbell Curl', muscleGroup: 'Biceps', sets: 3, reps: 10, weightKg: 30 },
    ],
  },
  {
    name: 'Leg Day',
    duration: 70,
    exercises: [
      { exerciseName: 'Barbell Squat', muscleGroup: 'Quads', sets: 4, reps: 8, weightKg: 80 },
      { exerciseName: 'Romanian Deadlift', muscleGroup: 'Hamstrings', sets: 4, reps: 10, weightKg: 70 },
      { exerciseName: 'Leg Press', muscleGroup: 'Quads', sets: 3, reps: 15, weightKg: 120 },
      { exerciseName: 'Walking Lunges', muscleGroup: 'Glutes', sets: 3, reps: 12, weightKg: 20 },
      { exerciseName: 'Calf Raises', muscleGroup: 'Calves', sets: 4, reps: 20, weightKg: 30 },
    ],
  },
  {
    name: 'HIIT Cardio Session',
    duration: 30,
    exercises: [
      { exerciseName: 'Jump Rope', muscleGroup: 'Cardio / Conditioning', sets: 5, reps: null, durationSeconds: 60 },
      { exerciseName: 'Burpees', muscleGroup: 'Full Body', sets: 4, reps: 15, weightKg: null },
      { exerciseName: 'Box Jumps', muscleGroup: 'Quads', sets: 4, reps: 10, weightKg: null },
      { exerciseName: 'Mountain Climbers', muscleGroup: 'Core / Abs', sets: 4, reps: null, durationSeconds: 45 },
    ],
  },
];

const emptyExercise = () => ({
  exerciseName: '',
  muscleGroup: '',
  sets: 3,
  reps: 10,
  weightKg: '',
  durationSeconds: '',
  restSeconds: 60,
  _key: Date.now() + Math.random(),
});

export default function WorkoutTrackerPage() {
  const { user } = useAuth();

  const [sessions, setSessions] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [expandedSession, setExpandedSession] = useState(null);
  const [showTemplates, setShowTemplates] = useState(false);

  // Form state
  const [workoutName, setWorkoutName] = useState('');
  const [sessionDate, setSessionDate] = useState(new Date().toISOString().split('T')[0]);
  const [durationMins, setDurationMins] = useState('');
  const [sessionNotes, setSessionNotes] = useState('');
  const [exercises, setExercises] = useState([emptyExercise()]);

  const fetchData = async () => {
    if (!user?.userId) return;
    try {
      const [sessionData, statsData] = await Promise.all([
        workoutService.getSessions(user.userId).catch(() => []),
        workoutService.getStats(user.userId).catch(() => null),
      ]);
      setSessions(sessionData || []);
      setStats(statsData);
    } catch (err) {
      console.error('Failed to load workout data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [user?.userId]);

  const addExercise = () => setExercises((prev) => [...prev, emptyExercise()]);

  const removeExercise = (key) =>
    setExercises((prev) => prev.filter((e) => e._key !== key));

  const updateExercise = (key, field, value) =>
    setExercises((prev) =>
      prev.map((e) => (e._key === key ? { ...e, [field]: value } : e))
    );

  const applyTemplate = (tpl) => {
    setWorkoutName(tpl.name);
    setDurationMins(tpl.duration.toString());
    setExercises(
      tpl.exercises.map((ex, i) => ({
        ...emptyExercise(),
        ...ex,
        weightKg: ex.weightKg ?? '',
        durationSeconds: ex.durationSeconds ?? '',
        _key: Date.now() + i,
      }))
    );
    setShowTemplates(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const validExercises = exercises.filter((ex) => ex.exerciseName.trim());
    if (validExercises.length === 0) {
      setErrorMsg('Add at least one exercise to log your workout.');
      return;
    }

    try {
      setSubmitting(true);
      await workoutService.createSession({
        userId: user.userId,
        sessionDate,
        workoutName: workoutName.trim() || 'Workout Session',
        notes: sessionNotes.trim(),
        durationMinutes: durationMins ? parseInt(durationMins) : null,
        exercises: validExercises.map((ex, idx) => ({
          exerciseName: ex.exerciseName.trim(),
          muscleGroup: ex.muscleGroup || null,
          sets: ex.sets ? parseInt(ex.sets) : null,
          reps: ex.reps ? parseInt(ex.reps) : null,
          weightKg: ex.weightKg !== '' ? parseFloat(ex.weightKg) : null,
          durationSeconds: ex.durationSeconds !== '' ? parseInt(ex.durationSeconds) : null,
          restSeconds: ex.restSeconds !== '' ? parseInt(ex.restSeconds) : null,
          sortOrder: idx,
        })),
      });

      setSuccessMsg(`✅ "${workoutName || 'Workout'}" logged with ${validExercises.length} exercise(s)!`);
      setWorkoutName('');
      setSessionNotes('');
      setDurationMins('');
      setExercises([emptyExercise()]);
      await fetchData();
      setTimeout(() => setSuccessMsg(''), 5000);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to log workout session.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (sessionId) => {
    if (!window.confirm('Delete this workout session?')) return;
    try {
      await workoutService.deleteSession(sessionId, user.userId);
      await fetchData();
    } catch (err) {
      setErrorMsg(err.message || 'Failed to delete session.');
    }
  };

  const formatVolume = (vol) => {
    if (vol >= 1000) return `${(vol / 1000).toFixed(1)}t`;
    return `${vol} kg`;
  };

  return (
    <div className="page-container workout-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Workout Tracker</h1>
          <p className="page-subtitle">Log exercises, track volume, and monitor your training progress</p>
        </div>
        <button
          className="btn btn-secondary btn-sm"
          onClick={() => setShowTemplates((v) => !v)}
        >
          <Zap size={15} />
          Quick Templates
        </button>
      </div>

      {/* Template Quick-picks */}
      {showTemplates && (
        <div className="templates-panel glass-card">
          <h4 className="templates-title">Select a Workout Template</h4>
          <div className="templates-grid">
            {WORKOUT_TEMPLATES.map((tpl, i) => (
              <button key={i} className="template-card" onClick={() => applyTemplate(tpl)}>
                <div className="template-icon"><Dumbbell size={18} /></div>
                <div>
                  <div className="template-name">{tpl.name}</div>
                  <div className="template-meta">{tpl.exercises.length} exercises · {tpl.duration} min</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Alerts */}
      {successMsg && (
        <div className="alert alert-success">
          <CheckCircle2 size={18} /><span>{successMsg}</span>
        </div>
      )}
      {errorMsg && (
        <div className="alert alert-error">
          <AlertCircle size={18} /><span>{errorMsg}</span>
        </div>
      )}

      {/* Stats KPI */}
      <div className="grid-kpi">
        <MetricCard
          title="Total Sessions"
          value={stats?.totalSessions ?? '--'}
          unit=""
          icon={Dumbbell}
          subtitle={stats?.lastSessionDate ? `Last: ${stats.lastSessionDate}` : 'No sessions yet'}
          glowColor="emerald"
        />
        <MetricCard
          title="Total Time"
          value={stats ? Math.round((stats.totalDurationMinutes || 0) / 60) : '--'}
          unit="hrs"
          icon={Clock}
          subtitle={`${stats?.totalDurationMinutes || 0} total minutes`}
          glowColor="cyan"
        />
        <MetricCard
          title="Total Volume"
          value={stats ? formatVolume(stats.totalVolumeKg || 0) : '--'}
          unit=""
          icon={BarChart3}
          subtitle={`${stats?.totalExercises || 0} total exercises`}
          glowColor="purple"
        />
        <MetricCard
          title="Top Muscle"
          value={stats?.mostUsedMuscleGroup || '--'}
          unit=""
          icon={Flame}
          subtitle="Most trained muscle group"
          glowColor="amber"
        />
      </div>

      {/* Main Layout: Form + History */}
      <div className="grid-2col workout-main-layout">
        {/* LEFT: Log Workout Form */}
        <div className="glass-card workout-form-card">
          <div className="card-top-title">
            <PlusCircle size={20} className="text-emerald" />
            <div>
              <h3>Log Workout Session</h3>
              <p className="card-sub">Add exercises, sets, reps, and weight</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="workout-form">
            {/* Session Meta */}
            <div className="session-meta-row">
              <div className="form-group flex-1">
                <label className="form-label">Workout Name *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Push Day, Leg Day"
                  value={workoutName}
                  onChange={(e) => setWorkoutName(e.target.value)}
                />
              </div>
              <div className="form-group w-130">
                <label className="form-label">Date</label>
                <input
                  type="date"
                  className="form-input"
                  value={sessionDate}
                  onChange={(e) => setSessionDate(e.target.value)}
                />
              </div>
              <div className="form-group w-100">
                <label className="form-label">Duration (min)</label>
                <input
                  type="number"
                  className="form-input"
                  placeholder="60"
                  min="1"
                  max="480"
                  value={durationMins}
                  onChange={(e) => setDurationMins(e.target.value)}
                />
              </div>
            </div>

            {/* Exercises */}
            <div className="exercises-section">
              <div className="exercises-header">
                <span className="exercises-label">Exercises ({exercises.filter(e => e.exerciseName).length})</span>
                <button type="button" className="btn-add-exercise" onClick={addExercise}>
                  <Plus size={14} />
                  Add Exercise
                </button>
              </div>

              <div className="exercises-list">
                {exercises.map((ex, idx) => (
                  <div key={ex._key} className="exercise-row">
                    <div className="exercise-num">{idx + 1}</div>
                    <div className="exercise-fields">
                      <div className="ex-row-top">
                        <input
                          type="text"
                          className="form-input ex-name-input"
                          placeholder="Exercise name (e.g. Bench Press)"
                          value={ex.exerciseName}
                          onChange={(e) => updateExercise(ex._key, 'exerciseName', e.target.value)}
                        />
                        <select
                          className="form-select ex-muscle-select"
                          value={ex.muscleGroup}
                          onChange={(e) => updateExercise(ex._key, 'muscleGroup', e.target.value)}
                        >
                          <option value="">Muscle group</option>
                          {MUSCLE_GROUPS.map((mg) => (
                            <option key={mg} value={mg}>{mg}</option>
                          ))}
                        </select>
                      </div>
                      <div className="ex-row-bottom">
                        <div className="ex-field-group">
                          <label className="ex-field-label">Sets</label>
                          <input
                            type="number"
                            className="form-input ex-num-input"
                            placeholder="3"
                            min="1" max="20"
                            value={ex.sets}
                            onChange={(e) => updateExercise(ex._key, 'sets', e.target.value)}
                          />
                        </div>
                        <div className="ex-field-group">
                          <label className="ex-field-label">Reps</label>
                          <input
                            type="number"
                            className="form-input ex-num-input"
                            placeholder="10"
                            min="1" max="200"
                            value={ex.reps}
                            onChange={(e) => updateExercise(ex._key, 'reps', e.target.value)}
                          />
                        </div>
                        <div className="ex-field-group">
                          <label className="ex-field-label">Weight (kg)</label>
                          <input
                            type="number"
                            className="form-input ex-num-input"
                            placeholder="—"
                            min="0" max="1000"
                            step="0.5"
                            value={ex.weightKg}
                            onChange={(e) => updateExercise(ex._key, 'weightKg', e.target.value)}
                          />
                        </div>
                        <div className="ex-field-group">
                          <label className="ex-field-label">Rest (s)</label>
                          <input
                            type="number"
                            className="form-input ex-num-input"
                            placeholder="60"
                            min="0" max="600"
                            value={ex.restSeconds}
                            onChange={(e) => updateExercise(ex._key, 'restSeconds', e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="btn-remove-exercise"
                      onClick={() => removeExercise(ex._key)}
                      disabled={exercises.length === 1}
                      title="Remove exercise"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Session Notes (Optional)</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. PRs hit today, felt strong!"
                value={sessionNotes}
                onChange={(e) => setSessionNotes(e.target.value)}
              />
            </div>

            <button type="submit" className="btn btn-primary btn-submit-workout" disabled={submitting}>
              {submitting ? (
                <><Loader2 size={18} className="animate-spin" /><span>Logging Workout...</span></>
              ) : (
                <><Dumbbell size={18} /><span>Save Workout Session</span></>
              )}
            </button>
          </form>
        </div>

        {/* RIGHT: Session History */}
        <div className="glass-card sessions-history-card">
          <div className="card-top-title">
            <Clock size={20} className="text-cyan" />
            <div>
              <h3>Workout History</h3>
              <p className="card-sub">{sessions.length} session{sessions.length !== 1 ? 's' : ''} logged</p>
            </div>
          </div>

          {loading ? (
            <div className="loading-state">
              <Loader2 size={24} className="animate-spin text-emerald" />
              <span>Loading sessions...</span>
            </div>
          ) : sessions.length === 0 ? (
            <div className="empty-sessions">
              <Dumbbell size={36} className="empty-icon" />
              <p>No workout sessions yet.</p>
              <p className="empty-sub">Log your first session using the form!</p>
            </div>
          ) : (
            <div className="sessions-list">
              {sessions.map((session) => (
                <div key={session.id} className="session-item">
                  <div className="session-item-header" onClick={() => setExpandedSession(
                    expandedSession === session.id ? null : session.id
                  )}>
                    <div className="session-item-left">
                      <div className="session-icon-box">
                        <Dumbbell size={16} />
                      </div>
                      <div>
                        <div className="session-name">{session.workoutName}</div>
                        <div className="session-meta-line">
                          <span>{session.sessionDate}</span>
                          {session.durationMinutes && (
                            <><span className="meta-dot">·</span><span><Clock size={11} className="inline-icon" /> {session.durationMinutes} min</span></>
                          )}
                          <span className="meta-dot">·</span>
                          <span>{session.totalExercises} exercises</span>
                          {session.totalVolume > 0 && (
                            <><span className="meta-dot">·</span><span className="text-emerald">{formatVolume(session.totalVolume)}</span></>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="session-item-actions">
                      <button
                        className="btn-delete-session"
                        onClick={(e) => { e.stopPropagation(); handleDelete(session.id); }}
                        title="Delete session"
                      >
                        <Trash2 size={15} />
                      </button>
                      {expandedSession === session.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </div>
                  </div>

                  {expandedSession === session.id && (
                    <div className="session-exercises-expanded">
                      {session.notes && (
                        <p className="session-notes-text">📝 {session.notes}</p>
                      )}
                      <div className="ex-table-header">
                        <span>Exercise</span>
                        <span>Muscle</span>
                        <span>Sets</span>
                        <span>Reps</span>
                        <span>Weight</span>
                      </div>
                      {session.exercises.map((ex) => (
                        <div key={ex.id} className="ex-table-row">
                          <span className="ex-ex-name">{ex.exerciseName}</span>
                          <span className="ex-badge-muscle">{ex.muscleGroup || '—'}</span>
                          <span>{ex.sets ?? '—'}</span>
                          <span>{ex.reps ?? '—'}</span>
                          <span className="text-emerald">{ex.weightKg != null ? `${ex.weightKg} kg` : ex.durationSeconds ? `${ex.durationSeconds}s` : '—'}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <style>{`
        .workout-page {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        /* Templates Panel */
        .templates-panel {
          padding: 1.5rem;
          border-color: rgba(245, 158, 11, 0.25);
          background: linear-gradient(135deg, rgba(17, 24, 39, 0.85) 0%, rgba(245, 158, 11, 0.04) 100%);
        }
        .templates-title {
          font-size: 0.875rem;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 1rem;
        }
        .templates-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
          gap: 0.75rem;
        }
        .template-card {
          display: flex;
          align-items: center;
          gap: 0.85rem;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          padding: 0.85rem 1rem;
          cursor: pointer;
          transition: var(--transition);
          text-align: left;
          color: var(--text-main);
        }
        .template-card:hover {
          border-color: rgba(245, 158, 11, 0.4);
          background: rgba(245, 158, 11, 0.08);
          transform: translateY(-2px);
        }
        .template-icon {
          width: 36px; height: 36px;
          background: rgba(245, 158, 11, 0.15);
          color: #fbbf24;
          border-radius: var(--radius-sm);
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .template-name {
          font-size: 0.9rem;
          font-weight: 600;
          color: #ffffff;
          margin-bottom: 0.2rem;
        }
        .template-meta {
          font-size: 0.78rem;
          color: var(--text-muted);
        }

        /* Form Card */
        .workout-form-card {
          height: fit-content;
        }
        .card-top-title {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1.5rem;
        }
        .card-sub {
          font-size: 0.825rem;
          color: var(--text-dim);
          margin-top: 0.15rem;
        }

        .workout-form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .session-meta-row {
          display: flex;
          gap: 0.75rem;
          align-items: flex-end;
          flex-wrap: wrap;
        }
        .flex-1 { flex: 1; min-width: 160px; }
        .w-130 { width: 130px; flex-shrink: 0; }
        .w-100 { width: 100px; flex-shrink: 0; }

        /* Exercises section */
        .exercises-section {
          background: rgba(15, 23, 42, 0.4);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          padding: 1rem;
        }
        .exercises-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.85rem;
        }
        .exercises-label {
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .btn-add-exercise {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--primary-light);
          background: rgba(16, 185, 129, 0.1);
          border: 1px solid rgba(16, 185, 129, 0.25);
          border-radius: var(--radius-sm);
          padding: 0.35rem 0.75rem;
          cursor: pointer;
          transition: var(--transition);
        }
        .btn-add-exercise:hover {
          background: rgba(16, 185, 129, 0.2);
          border-color: rgba(16, 185, 129, 0.5);
        }
        .exercises-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .exercise-row {
          display: flex;
          gap: 0.65rem;
          align-items: flex-start;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: var(--radius-md);
          padding: 0.75rem;
        }
        .exercise-num {
          width: 24px; height: 24px;
          background: rgba(16, 185, 129, 0.15);
          color: var(--primary-light);
          border-radius: var(--radius-sm);
          display: flex; align-items: center; justify-content: center;
          font-size: 0.75rem; font-weight: 700;
          flex-shrink: 0; margin-top: 0.5rem;
        }
        .exercise-fields { flex: 1; display: flex; flex-direction: column; gap: 0.5rem; }
        .ex-row-top { display: flex; gap: 0.5rem; }
        .ex-name-input { flex: 1; }
        .ex-muscle-select { width: 150px; flex-shrink: 0; padding: 0.6rem 0.75rem; font-size: 0.85rem; }
        .ex-row-bottom { display: flex; gap: 0.5rem; }
        .ex-field-group { display: flex; flex-direction: column; gap: 0.25rem; flex: 1; min-width: 60px; }
        .ex-field-label { font-size: 0.7rem; font-weight: 600; color: var(--text-dim); text-transform: uppercase; }
        .ex-num-input { padding: 0.55rem 0.6rem; font-size: 0.875rem; text-align: center; }
        .btn-remove-exercise {
          background: transparent; border: none;
          color: var(--text-dim); cursor: pointer;
          padding: 0.3rem; border-radius: var(--radius-sm);
          transition: var(--transition); margin-top: 0.3rem;
        }
        .btn-remove-exercise:hover:not(:disabled) { color: #fb7185; background: rgba(244, 63, 94, 0.12); }
        .btn-remove-exercise:disabled { opacity: 0.3; cursor: not-allowed; }

        .btn-submit-workout {
          width: 100%;
          padding: 0.9rem;
          font-size: 1rem;
        }

        /* Sessions History */
        .workout-main-layout { align-items: start; }
        .sessions-history-card { min-height: 400px; }
        .loading-state {
          display: flex; align-items: center; gap: 0.75rem;
          color: var(--text-muted); padding: 2rem;
          justify-content: center;
        }
        .empty-sessions {
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          padding: 3rem 2rem; color: var(--text-muted);
          text-align: center; gap: 0.5rem;
        }
        .empty-icon { opacity: 0.3; margin-bottom: 0.75rem; }
        .empty-sub { font-size: 0.85rem; color: var(--text-dim); }

        .sessions-list { display: flex; flex-direction: column; gap: 0.75rem; }
        .session-item {
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          overflow: hidden;
          transition: var(--transition);
        }
        .session-item:hover { border-color: rgba(255, 255, 255, 0.12); }
        .session-item-header {
          display: flex; justify-content: space-between; align-items: center;
          padding: 0.85rem 1rem; cursor: pointer;
          background: rgba(255, 255, 255, 0.03);
        }
        .session-item-header:hover { background: rgba(255, 255, 255, 0.05); }
        .session-item-left { display: flex; gap: 0.75rem; align-items: center; }
        .session-icon-box {
          width: 34px; height: 34px;
          background: rgba(16, 185, 129, 0.12);
          color: var(--primary-light);
          border-radius: var(--radius-sm);
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .session-name { font-size: 0.925rem; font-weight: 700; color: #ffffff; margin-bottom: 0.2rem; }
        .session-meta-line { font-size: 0.775rem; color: var(--text-muted); display: flex; align-items: center; gap: 0.35rem; flex-wrap: wrap; }
        .meta-dot { opacity: 0.4; }
        .inline-icon { display: inline; vertical-align: middle; margin-right: 2px; }
        .session-item-actions { display: flex; align-items: center; gap: 0.5rem; color: var(--text-dim); }
        .btn-delete-session {
          background: transparent; border: none; cursor: pointer;
          color: var(--text-dim); padding: 0.35rem; border-radius: var(--radius-sm);
          transition: var(--transition); display: flex; align-items: center;
        }
        .btn-delete-session:hover { color: #fb7185; background: rgba(244, 63, 94, 0.12); }

        /* Expanded exercise view */
        .session-exercises-expanded {
          border-top: 1px solid var(--border-subtle);
          padding: 0.85rem 1rem;
          background: rgba(9, 13, 22, 0.4);
        }
        .session-notes-text {
          font-size: 0.825rem; color: var(--text-muted);
          margin-bottom: 0.75rem;
          font-style: italic;
        }
        .ex-table-header {
          display: grid;
          grid-template-columns: 2fr 1.2fr 0.7fr 0.7fr 1fr;
          gap: 0.5rem;
          padding: 0.4rem 0.5rem;
          font-size: 0.7rem;
          font-weight: 700;
          text-transform: uppercase;
          color: var(--text-dim);
          letter-spacing: 0.04em;
          border-bottom: 1px solid var(--border-subtle);
          margin-bottom: 0.35rem;
        }
        .ex-table-row {
          display: grid;
          grid-template-columns: 2fr 1.2fr 0.7fr 0.7fr 1fr;
          gap: 0.5rem;
          padding: 0.5rem 0.5rem;
          font-size: 0.85rem;
          border-bottom: 1px solid rgba(255,255,255,0.03);
          align-items: center;
        }
        .ex-table-row:last-child { border-bottom: none; }
        .ex-ex-name { color: #e5e7eb; font-weight: 500; }
        .ex-badge-muscle {
          font-size: 0.7rem;
          background: rgba(6, 182, 212, 0.12);
          color: #22d3ee;
          border-radius: var(--radius-full);
          padding: 0.15rem 0.5rem;
          display: inline-block;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .text-emerald { color: var(--primary-light) !important; }
        .text-dim { color: var(--text-dim); }

        @media (max-width: 700px) {
          .session-meta-row { flex-direction: column; }
          .w-130, .w-100 { width: 100%; }
          .ex-row-top { flex-direction: column; }
          .ex-muscle-select { width: 100%; }
          .ex-table-header, .ex-table-row { grid-template-columns: 2fr 1fr 0.6fr 0.6fr 0.8fr; }
        }
      `}</style>
    </div>
  );
}
