import React from 'react';

export default function MetricCard({ 
  title, 
  value, 
  unit = '', 
  icon: Icon, 
  badge, 
  badgeType = 'accent', 
  subtitle,
  glowColor = 'emerald'
}) {
  return (
    <div className={`metric-card glass-card glass-card-interactive glow-${glowColor}`}>
      <div className="metric-header">
        <span className="metric-title">{title}</span>
        {Icon && (
          <div className={`metric-icon-box box-${glowColor}`}>
            <Icon size={20} />
          </div>
        )}
      </div>

      <div className="metric-body">
        <div className="metric-value-wrap">
          <span className="metric-value">{value ?? '--'}</span>
          {unit && <span className="metric-unit">{unit}</span>}
        </div>

        {badge && (
          <span className={`badge badge-${badgeType.toLowerCase().replace(/\s+/g, '-')}`}>
            {badge}
          </span>
        )}
      </div>

      {subtitle && <p className="metric-subtitle">{subtitle}</p>}

      <style>{`
        .metric-card {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 1.5rem;
          min-height: 140px;
        }

        .metric-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.75rem;
        }

        .metric-title {
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }

        .metric-icon-box {
          width: 36px;
          height: 36px;
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .box-emerald {
          background: rgba(16, 185, 129, 0.15);
          color: #34d399;
          border: 1px solid rgba(16, 185, 129, 0.25);
        }

        .box-cyan {
          background: rgba(6, 182, 212, 0.15);
          color: #22d3ee;
          border: 1px solid rgba(6, 182, 212, 0.25);
        }

        .box-purple {
          background: rgba(139, 92, 246, 0.15);
          color: #a78bfa;
          border: 1px solid rgba(139, 92, 246, 0.25);
        }

        .box-amber {
          background: rgba(245, 158, 11, 0.15);
          color: #fbbf24;
          border: 1px solid rgba(245, 158, 11, 0.25);
        }

        .metric-body {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-top: 0.25rem;
        }

        .metric-value-wrap {
          display: flex;
          align-items: baseline;
          gap: 0.35rem;
        }

        .metric-value {
          font-family: var(--font-display);
          font-size: 2.1rem;
          font-weight: 800;
          letter-spacing: -0.03em;
          color: #ffffff;
          line-height: 1;
        }

        .metric-unit {
          font-size: 1rem;
          font-weight: 600;
          color: var(--text-muted);
        }

        .metric-subtitle {
          font-size: 0.8rem;
          color: var(--text-dim);
          margin-top: 0.75rem;
        }
      `}</style>
    </div>
  );
}
