import React from 'react';
import { Activity, ShieldCheck, Zap, Database, Cpu } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="footer-root">
      <div className="footer-container">
        <div className="footer-top">
          <div className="footer-brand">
            <div className="footer-brand-header">
              <Activity className="footer-icon" size={20} />
              <div className="footer-title-group">
                <span className="footer-title">Fit Tracker <span className="brand-ai">AI</span></span>
                <span className="footer-by-badge">by Srujan</span>
              </div>
            </div>
            <p className="footer-desc">
              Your personalized fitness companion created by Srujan. Built with Java Spring Boot, React, MySQL, and Google Gemini API.
            </p>
          </div>

          <div className="footer-badges">
            <div className="stack-pill">
              <Zap size={14} className="pill-icon text-emerald" />
              <span>React.js</span>
            </div>
            <div className="stack-pill">
              <Cpu size={14} className="pill-icon text-cyan" />
              <span>Spring Boot 3</span>
            </div>
            <div className="stack-pill">
              <Database size={14} className="pill-icon text-amber" />
              <span>MySQL JPA</span>
            </div>
            <div className="stack-pill">
              <ShieldCheck size={14} className="pill-icon text-purple" />
              <span>Gemini AI</span>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="copyright">
            © {new Date().getFullYear()} Fit Tracker by Srujan. All rights reserved.
          </p>
          <p className="disclaimer">
            Disclaimer: AI recommendations are for general fitness awareness and guidance. Always consult a healthcare professional.
          </p>
        </div>
      </div>

      <style>{`
        .footer-root {
          background: rgba(9, 13, 22, 0.95);
          border-top: 1px solid var(--border-subtle);
          padding: 2.5rem 1.5rem 1.5rem;
          margin-top: auto;
        }

        .footer-container {
          max-width: 1200px;
          margin: 0 auto;
        }

        .footer-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 1.5rem;
          padding-bottom: 2rem;
          border-bottom: 1px solid var(--border-subtle);
        }

        .footer-brand {
          max-width: 480px;
        }

        .footer-brand-header {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          margin-bottom: 0.5rem;
        }

        .footer-title-group {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .footer-icon {
          color: var(--primary-light);
        }

        .footer-title {
          font-family: var(--font-display);
          font-weight: 800;
          font-size: 1.15rem;
          color: #ffffff;
        }

        .footer-by-badge {
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          background: rgba(16, 185, 129, 0.15);
          color: #34d399;
          border: 1px solid rgba(16, 185, 129, 0.3);
          padding: 0.15rem 0.5rem;
          border-radius: var(--radius-full);
        }

        .footer-desc {
          font-size: 0.875rem;
          color: var(--text-muted);
          line-height: 1.5;
        }

        .footer-badges {
          display: flex;
          flex-wrap: wrap;
          gap: 0.6rem;
        }

        .stack-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid var(--border-subtle);
          padding: 0.35rem 0.75rem;
          border-radius: var(--radius-full);
          font-size: 0.775rem;
          color: var(--text-muted);
          font-weight: 500;
        }

        .text-emerald { color: #34d399; }
        .text-cyan { color: #22d3ee; }
        .text-amber { color: #fbbf24; }
        .text-purple { color: #a78bfa; }

        .footer-bottom {
          padding-top: 1.5rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 1rem;
          font-size: 0.8rem;
          color: var(--text-dim);
        }

        .disclaimer {
          font-style: italic;
        }
      `}</style>
    </footer>
  );
}
