import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { weightService } from '../api/weightService';
import WeightChart from '../components/WeightChart';
import MetricCard from '../components/MetricCard';
import { 
  Weight, 
  PlusCircle, 
  Calendar, 
  FileText, 
  Trash2, 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  CheckCircle2, 
  AlertCircle, 
  Loader2,
  Clock
} from 'lucide-react';

export default function WeightTrackingPage() {
  const { user, refreshProfile } = useAuth();

  const [weightHistory, setWeightHistory] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Form State
  const [newWeight, setNewWeight] = useState('');
  const [recordDate, setRecordDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const fetchRecords = async () => {
    if (!user?.userId) return;
    try {
      const [historyData, statsData] = await Promise.all([
        weightService.getWeightHistory(user.userId),
        weightService.getWeightStats(user.userId),
      ]);
      setWeightHistory(historyData || []);
      setStats(statsData);
    } catch (err) {
      console.error('Failed to load weight records:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, [user?.userId]);

  const handleAddWeight = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const parsedWeight = parseFloat(newWeight);
    if (!parsedWeight || parsedWeight <= 0) {
      setErrorMsg('Please enter a valid weight in kg.');
      return;
    }

    try {
      setSubmitting(true);
      await weightService.addWeight({
        userId: user.userId,
        weight: parsedWeight,
        recordDate: recordDate,
        notes: notes.trim(),
      });

      setSuccessMsg(`Logged ${parsedWeight} kg successfully for ${recordDate}!`);
      setNewWeight('');
      setNotes('');
      await fetchRecords();
      await refreshProfile();
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to log weight entry.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteRecord = async (recordId) => {
    if (!window.confirm('Are you sure you want to delete this weight entry?')) return;
    try {
      await weightService.deleteWeight(recordId, user.userId);
      await fetchRecords();
      await refreshProfile();
    } catch (err) {
      setErrorMsg(err.message || 'Failed to delete record.');
    }
  };

  const getProgressIcon = () => {
    if (!stats || stats.netChange === 0) return Minus;
    return stats.netChange < 0 ? TrendingDown : TrendingUp;
  };

  const ProgressIcon = getProgressIcon();

  return (
    <div className="page-container weight-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Weight Tracking</h1>
          <p className="page-subtitle">Log your weight entries and monitor your body transformation over time</p>
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

      {/* Quick Stats Grid */}
      <div className="grid-kpi">
        <MetricCard
          title="Current Weight"
          value={stats?.currentWeight ?? '--'}
          unit="kg"
          icon={Weight}
          subtitle={stats?.latestDate ? `As of ${stats.latestDate}` : 'No records yet'}
          glowColor="emerald"
        />

        <MetricCard
          title="Starting Weight"
          value={stats?.startingWeight ?? '--'}
          unit="kg"
          icon={Calendar}
          subtitle={`${stats?.totalEntries || 0} total records logged`}
          glowColor="cyan"
        />

        <MetricCard
          title="Net Progress"
          value={stats?.netChange !== undefined ? `${stats.netChange > 0 ? '+' : ''}${stats.netChange}` : '--'}
          unit="kg"
          icon={ProgressIcon}
          badge={stats?.netChange !== undefined ? (stats.netChange <= 0 ? 'Weight Loss' : 'Weight Gain') : null}
          badgeType={stats?.netChange <= 0 ? 'normal' : 'overweight'}
          subtitle="Change since first log"
          glowColor="purple"
        />

        <MetricCard
          title="Lowest Recorded"
          value={stats?.lowestWeight ?? '--'}
          unit="kg"
          icon={TrendingDown}
          subtitle={stats?.highestWeight ? `Peak: ${stats.highestWeight} kg` : ''}
          glowColor="amber"
        />
      </div>

      {/* Main Section: Chart + Log Form */}
      <div className="grid-2col weight-main-layout">
        {/* Left: Interactive Progress Chart */}
        <div className="glass-card chart-container-card">
          <div className="card-top-title">
            <TrendingUp size={20} className="text-emerald" />
            <div>
              <h3>Weight History Chart</h3>
              <p className="card-sub">Visual line trajectory of all recorded entries</p>
            </div>
          </div>

          <WeightChart data={weightHistory} height={290} />
        </div>

        {/* Right: Add New Entry Form */}
        <div className="glass-card add-weight-card">
          <div className="card-top-title">
            <PlusCircle size={20} className="text-emerald" />
            <div>
              <h3>Log Weight Entry</h3>
              <p className="card-sub">Record today's or a past date's weigh-in</p>
            </div>
          </div>

          <form onSubmit={handleAddWeight} className="add-weight-form">
            <div className="form-group">
              <label className="form-label">Weight (kg) *</label>
              <div className="input-with-icon">
                <Weight size={18} className="input-icon" />
                <input
                  type="number"
                  step="0.1"
                  min="20"
                  max="350"
                  className="form-input with-left-icon"
                  placeholder="e.g. 72.4"
                  value={newWeight}
                  onChange={(e) => setNewWeight(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Record Date *</label>
              <div className="input-with-icon">
                <Calendar size={18} className="input-icon" />
                <input
                  type="date"
                  className="form-input with-left-icon"
                  value={recordDate}
                  onChange={(e) => setRecordDate(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Notes (Optional)</label>
              <div className="input-with-icon">
                <FileText size={18} className="input-icon" />
                <input
                  type="text"
                  className="form-input with-left-icon"
                  placeholder="e.g. Morning fasted, post-workout"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
            </div>

            <button 
              type="submit" 
              className="btn btn-primary btn-log-submit"
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>Logging Weight...</span>
                </>
              ) : (
                <>
                  <PlusCircle size={18} />
                  <span>Record Weight</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* History Table */}
      <div className="glass-card history-table-card">
        <div className="card-top-title">
          <Clock size={20} className="text-cyan" />
          <div>
            <h3>Weight Log Records</h3>
            <p className="card-sub">All historical entries stored in MySQL</p>
          </div>
        </div>

        {weightHistory.length === 0 ? (
          <div className="empty-history-notice">
            <p>No weight logs found yet. Enter your first weight above to start your log history!</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="weight-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Weight (kg)</th>
                  <th>Notes</th>
                  <th>Change</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {[...weightHistory]
                  .sort((a, b) => new Date(b.recordDate) - new Date(a.recordDate))
                  .map((rec, idx, arr) => {
                    const prevRec = arr[idx + 1];
                    const diff = prevRec ? Math.round((rec.weight - prevRec.weight) * 10) / 10 : null;

                    return (
                      <tr key={rec.id}>
                        <td className="td-date">
                          <Calendar size={14} className="text-dim" />
                          <span>{rec.recordDate}</span>
                        </td>
                        <td className="td-weight">
                          <strong>{rec.weight}</strong> kg
                        </td>
                        <td className="td-notes">
                          {rec.notes || <span className="text-dim">—</span>}
                        </td>
                        <td className="td-change">
                          {diff !== null ? (
                            <span className={`diff-pill ${diff <= 0 ? 'diff-down' : 'diff-up'}`}>
                              {diff > 0 ? `+${diff}` : diff} kg
                            </span>
                          ) : (
                            <span className="diff-pill diff-neutral">Base</span>
                          )}
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <button
                            onClick={() => handleDeleteRecord(rec.id)}
                            className="btn-delete-entry"
                            title="Delete this record"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <style>{`
        .weight-page {
          display: flex;
          flex-direction: column;
          gap: 2rem;
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

        .weight-main-layout {
          align-items: start;
        }

        .add-weight-card {
          padding: 1.75rem;
        }

        .btn-log-submit {
          width: 100%;
          margin-top: 0.75rem;
        }

        /* History Table */
        .history-table-card {
          padding: 1.75rem;
        }

        .table-responsive {
          width: 100%;
          overflow-x: auto;
        }

        .weight-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.925rem;
        }

        .weight-table th {
          text-align: left;
          padding: 0.85rem 1rem;
          font-size: 0.775rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--text-muted);
          border-bottom: 1px solid var(--border-subtle);
        }

        .weight-table td {
          padding: 1rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.04);
          vertical-align: middle;
        }

        .weight-table tr:hover td {
          background: rgba(255, 255, 255, 0.02);
        }

        .td-date {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 500;
          color: #e5e7eb;
        }

        .td-weight strong {
          color: #ffffff;
          font-size: 1.05rem;
          font-family: var(--font-display);
        }

        .td-notes {
          color: var(--text-muted);
          max-width: 250px;
        }

        .diff-pill {
          display: inline-block;
          padding: 0.2rem 0.55rem;
          border-radius: var(--radius-full);
          font-size: 0.75rem;
          font-weight: 700;
        }

        .diff-down {
          background: rgba(16, 185, 129, 0.15);
          color: #34d399;
        }

        .diff-up {
          background: rgba(245, 158, 11, 0.15);
          color: #fbbf24;
        }

        .diff-neutral {
          background: rgba(255, 255, 255, 0.08);
          color: var(--text-dim);
        }

        .btn-delete-entry {
          background: transparent;
          border: none;
          color: var(--text-dim);
          cursor: pointer;
          padding: 0.4rem;
          border-radius: var(--radius-sm);
          transition: var(--transition);
        }

        .btn-delete-entry:hover {
          color: #fb7185;
          background: rgba(244, 63, 94, 0.15);
        }

        .empty-history-notice {
          padding: 2.5rem;
          text-align: center;
          color: var(--text-muted);
        }
      `}</style>
    </div>
  );
}
