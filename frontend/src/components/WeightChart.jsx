import React, { useState } from 'react';
import { TrendingUp, Calendar, AlertCircle } from 'lucide-react';

export default function WeightChart({ data = [], height = 280 }) {
  const [hoveredPoint, setHoveredPoint] = useState(null);

  if (!data || data.length === 0) {
    return (
      <div className="chart-empty-state">
        <TrendingUp size={44} className="empty-icon" />
        <h4>No Weight Entries Yet</h4>
        <p>Log your current weight above to begin tracking your fitness progress trajectory.</p>
      </div>
    );
  }

  // Sort chronological
  const sorted = [...data].sort((a, b) => new Date(a.recordDate) - new Date(b.recordDate));

  // Determine bounds
  const weights = sorted.map(d => Number(d.weight));
  const rawMin = Math.min(...weights);
  const rawMax = Math.max(...weights);

  const paddingY = Math.max(1, (rawMax - rawMin) * 0.15 || 2);
  const minY = Math.floor(rawMin - paddingY);
  const maxY = Math.ceil(rawMax + paddingY);

  const chartWidth = 700;
  const chartHeight = height;
  const margin = { top: 25, right: 30, bottom: 45, left: 55 };
  const innerWidth = chartWidth - margin.left - margin.right;
  const innerHeight = chartHeight - margin.top - margin.bottom;

  const getX = (index) => {
    if (sorted.length === 1) return margin.left + innerWidth / 2;
    return margin.left + (index / (sorted.length - 1)) * innerWidth;
  };

  const getY = (weightVal) => {
    if (maxY === minY) return margin.top + innerHeight / 2;
    const ratio = (weightVal - minY) / (maxY - minY);
    return margin.top + innerHeight - ratio * innerHeight;
  };

  // Generate smooth line path
  const points = sorted.map((d, i) => ({
    x: getX(i),
    y: getY(Number(d.weight)),
    item: d,
    index: i,
  }));

  let pathD = '';
  if (points.length === 1) {
    pathD = `M ${points[0].x - 20} ${points[0].y} L ${points[0].x + 20} ${points[0].y}`;
  } else {
    pathD = points.reduce((acc, curr, i, arr) => {
      if (i === 0) return `M ${curr.x} ${curr.y}`;
      // Smooth curve interpolation
      const prev = arr[i - 1];
      const cx = (prev.x + curr.x) / 2;
      return `${acc} C ${cx} ${prev.y}, ${cx} ${curr.y}, ${curr.x} ${curr.y}`;
    }, '');
  }

  // Gradient area path
  let areaD = '';
  if (points.length > 1) {
    const first = points[0];
    const last = points[points.length - 1];
    areaD = `${pathD} L ${last.x} ${margin.top + innerHeight} L ${first.x} ${margin.top + innerHeight} Z`;
  }

  // Y-axis grid levels (4 intervals)
  const yTicks = 4;
  const gridLevels = [];
  for (let i = 0; i <= yTicks; i++) {
    const val = minY + ((maxY - minY) / yTicks) * i;
    gridLevels.push({
      val: Math.round(val * 10) / 10,
      y: getY(val),
    });
  }

  return (
    <div className="weight-chart-wrapper">
      <svg 
        viewBox={`0 0 ${chartWidth} ${chartHeight}`} 
        className="weight-svg-chart" 
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <linearGradient id="weightAreaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.35" />
            <stop offset="60%" stopColor="#06b6d4" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
          </linearGradient>

          <filter id="glowFilter" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="glow" />
            <feComposite in="SourceGraphic" in2="glow" operator="over" />
          </filter>
        </defs>

        {/* Y Axis Grid lines and labels */}
        {gridLevels.map((lvl, idx) => (
          <g key={idx}>
            <line
              x1={margin.left}
              y1={lvl.y}
              x2={margin.left + innerWidth}
              y2={lvl.y}
              stroke="rgba(255, 255, 255, 0.08)"
              strokeDasharray={idx === 0 ? 'none' : '4 4'}
            />
            <text
              x={margin.left - 12}
              y={lvl.y + 4}
              textAnchor="end"
              fill="rgba(156, 163, 175, 0.7)"
              fontSize="11"
              fontFamily="inherit"
            >
              {lvl.val} kg
            </text>
          </g>
        ))}

        {/* Gradient fill underneath */}
        {areaD && (
          <path d={areaD} fill="url(#weightAreaGrad)" />
        )}

        {/* Line Path */}
        <path
          d={pathD}
          fill="none"
          stroke="#10b981"
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#glowFilter)"
        />

        {/* Data points */}
        {points.map((pt, idx) => {
          const isHovered = hoveredPoint?.index === idx;
          return (
            <g 
              key={idx} 
              className="chart-dot-group"
              onMouseEnter={() => setHoveredPoint(pt)}
              onMouseLeave={() => setHoveredPoint(null)}
            >
              {/* Invisible larger hover hitbox */}
              <circle cx={pt.x} cy={pt.y} r="14" fill="transparent" cursor="pointer" />
              
              {/* Outer pulsing ring on hover */}
              {isHovered && (
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r="8"
                  fill="rgba(52, 211, 153, 0.3)"
                  stroke="#34d399"
                  strokeWidth="1.5"
                />
              )}

              {/* Core point dot */}
              <circle
                cx={pt.x}
                cy={pt.y}
                r={isHovered ? 5.5 : 4}
                fill="#ffffff"
                stroke="#10b981"
                strokeWidth="2.5"
                cursor="pointer"
              />

              {/* X Axis Date labels (show selectively to avoid overlap) */}
              {(points.length <= 8 || idx === 0 || idx === points.length - 1 || idx % Math.ceil(points.length / 6) === 0) && (
                <text
                  x={pt.x}
                  y={margin.top + innerHeight + 22}
                  textAnchor="middle"
                  fill="rgba(156, 163, 175, 0.8)"
                  fontSize="11"
                  fontFamily="inherit"
                >
                  {formatDateLabel(pt.item.recordDate)}
                </text>
              )}
            </g>
          );
        })}
      </svg>

      {/* Floating Tooltip Card */}
      {hoveredPoint && (
        <div 
          className="chart-tooltip"
          style={{
            left: `${(hoveredPoint.x / chartWidth) * 100}%`,
            top: `${(hoveredPoint.y / chartHeight) * 100}%`,
          }}
        >
          <div className="tooltip-weight">
            <span className="tooltip-val">{hoveredPoint.item.weight}</span>
            <span className="tooltip-unit">kg</span>
          </div>
          <div className="tooltip-date">
            <Calendar size={11} />
            <span>{hoveredPoint.item.recordDate}</span>
          </div>
          {hoveredPoint.item.notes && (
            <div className="tooltip-notes">"{hoveredPoint.item.notes}"</div>
          )}
        </div>
      )}

      <style>{`
        .weight-chart-wrapper {
          position: relative;
          width: 100%;
          border-radius: var(--radius-md);
          background: rgba(15, 23, 42, 0.4);
          padding: 0.5rem 0;
        }

        .weight-svg-chart {
          width: 100%;
          height: auto;
          display: block;
          overflow: visible;
        }

        .chart-dot-group {
          transition: transform 0.2s ease;
        }

        .chart-tooltip {
          position: absolute;
          transform: translate(-50%, -125%);
          background: rgba(17, 24, 39, 0.95);
          backdrop-filter: blur(12px);
          border: 1px solid var(--border-active);
          border-radius: var(--radius-sm);
          padding: 0.6rem 0.85rem;
          pointer-events: none;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.6), 0 0 15px rgba(16, 185, 129, 0.2);
          z-index: 20;
          white-space: nowrap;
          animation: fadeIn 0.15s ease-out;
        }

        .tooltip-weight {
          display: flex;
          align-items: baseline;
          gap: 0.25rem;
        }

        .tooltip-val {
          font-family: var(--font-display);
          font-weight: 800;
          font-size: 1.15rem;
          color: #34d399;
        }

        .tooltip-unit {
          font-size: 0.8rem;
          color: var(--text-muted);
        }

        .tooltip-date {
          display: flex;
          align-items: center;
          gap: 0.3rem;
          font-size: 0.75rem;
          color: var(--text-muted);
          margin-top: 0.2rem;
        }

        .tooltip-notes {
          font-size: 0.75rem;
          color: #93c5fd;
          margin-top: 0.35rem;
          max-width: 180px;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .chart-empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 3rem 1.5rem;
          text-align: center;
          color: var(--text-muted);
          background: rgba(15, 23, 42, 0.4);
          border-radius: var(--radius-md);
          border: 1px dashed var(--border-subtle);
        }

        .empty-icon {
          color: var(--primary-light);
          opacity: 0.6;
          margin-bottom: 1rem;
        }

        .chart-empty-state h4 {
          font-size: 1.1rem;
          color: var(--text-main);
          margin-bottom: 0.35rem;
        }

        .chart-empty-state p {
          font-size: 0.875rem;
          max-width: 380px;
        }
      `}</style>
    </div>
  );
}

function formatDateLabel(dateStr) {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    // format as MM/DD
    return `${parts[1]}/${parts[2]}`;
  }
  return dateStr;
}
