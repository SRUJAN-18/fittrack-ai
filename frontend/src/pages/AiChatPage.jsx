import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { aiService } from '../api/aiService';
import { 
  Bot, 
  Send, 
  User, 
  Sparkles, 
  RefreshCw, 
  Loader2, 
  Zap, 
  ShieldCheck, 
  Info,
  Clock
} from 'lucide-react';

export default function AiChatPage() {
  const { user, profile } = useAuth();
  const location = useLocation();

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      text: `Hello ${profile?.name || user?.name || 'there'}! I am your **Fit Tracker AI Coach** by Srujan, powered by Google Gemini.

I have synchronized your biometric profile:
* **Current Weight:** ${profile?.weight ? profile.weight + ' kg' : 'Not set'}
* **Height:** ${profile?.height ? profile.height + ' cm' : 'Not set'}
* **BMI:** ${profile?.bmi ? profile.bmi + ' (' + (profile?.bmiCategory || 'N/A') + ')' : 'Not set'}
* **Goal:** ${profile?.fitnessGoal || 'General Fitness'}
* **Activity Level:** ${profile?.activityLevel || 'Moderate'}

Ask me anything about your workout programming, pre/post exercise nutrition, recovery routines, or body transformation!`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
  ]);

  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  // Handle prefilled question from navigation (e.g. from Dashboard)
  useEffect(() => {
    if (location.state?.prefilledQuestion) {
      handleSendMessage(location.state.prefilledQuestion);
    }
  }, [location.state]);

  const handleSendMessage = async (customText = null) => {
    const textToSend = (typeof customText === 'string' ? customText : inputText).trim();
    if (!textToSend || loading) return;

    const userMessage = {
      id: Date.now(),
      sender: 'user',
      text: textToSend,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!customText) {
      setInputText('');
    }

    try {
      setLoading(true);
      const res = await aiService.sendChatMessage(user?.userId, textToSend);

      const aiMessage = {
        id: Date.now() + 1,
        sender: 'ai',
        text: res.reply || 'Here are your personalized recommendations based on your fitness profile.',
        time: res.timestamp || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      console.error('Chat error:', err);
      const errorMessage = {
        id: Date.now() + 1,
        sender: 'ai',
        text: `Sorry, I encountered an issue processing your request: ${err.message || 'Server error'}. Please verify that the Spring Boot backend is running and your Gemini API configuration is valid.`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isError: true,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: Date.now(),
        sender: 'ai',
        text: `Conversation restarted. How can I help you reach your ${profile?.fitnessGoal || 'fitness'} goals today?`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }
    ]);
  };

  const quickPrompts = [
    "What workout is suitable for me?",
    "What should I eat before exercise?",
    "How can I improve my fitness?",
    "Give me hydration and recovery tips."
  ];

  // Helper to format basic markdown-like bold and bullet lists in AI replies
  const renderFormattedText = (text) => {
    const lines = text.split('\n');
    return lines.map((line, idx) => {
      // Bold handling
      let formatted = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      // Quote handling
      if (line.startsWith('> ')) {
        return (
          <blockquote key={idx} className="chat-quote" dangerouslySetInnerHTML={{ __html: formatted.substring(2) }} />
        );
      }
      // Heading handling
      if (line.startsWith('### ')) {
        return <h4 key={idx} className="chat-h3" dangerouslySetInnerHTML={{ __html: formatted.substring(4) }} />;
      }
      if (line.startsWith('## ')) {
        return <h3 key={idx} className="chat-h2" dangerouslySetInnerHTML={{ __html: formatted.substring(3) }} />;
      }
      // Bullet points
      if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
        return (
          <li key={idx} className="chat-li" dangerouslySetInnerHTML={{ __html: formatted.trim().substring(2) }} />
        );
      }
      if (line.trim() === '') {
        return <div key={idx} style={{ height: '0.45rem' }} />;
      }
      return <p key={idx} className="chat-p" dangerouslySetInnerHTML={{ __html: formatted }} />;
    });
  };

  return (
    <div className="page-container ai-chat-page">
      {/* Top Header & Biometric Context Strip */}
      <div className="ai-page-header glass-card">
        <div className="ai-header-left">
          <div className="ai-avatar-glow">
            <Bot size={26} />
          </div>
          <div>
            <div className="ai-title-row">
              <h2>Fit Tracker AI Coach</h2>
              <span className="creator-badge">by Srujan</span>
              <span className="ai-badge-gemini">
                <Sparkles size={12} />
                Gemini Model
              </span>
            </div>
            <p className="ai-header-sub">
              Context-Aware Assistant for personalized workouts, nutrition, and wellness.
            </p>
          </div>
        </div>

        <div className="ai-header-actions">
          <button onClick={clearChat} className="btn btn-secondary btn-sm" title="Clear chat history">
            <RefreshCw size={14} />
            <span>Reset Chat</span>
          </button>
        </div>
      </div>

      {/* Active Profile Context Banner */}
      <div className="profile-context-banner">
        <div className="context-indicator">
          <Info size={15} className="text-cyan" />
          <span className="context-title">Active AI Context:</span>
        </div>
        <div className="context-chips">
          <span className="context-chip"><strong>Age:</strong> {profile?.age || '--'}</span>
          <span className="context-chip"><strong>Height:</strong> {profile?.height ? `${profile.height} cm` : '--'}</span>
          <span className="context-chip"><strong>Weight:</strong> {profile?.weight ? `${profile.weight} kg` : '--'}</span>
          <span className="context-chip"><strong>BMI:</strong> {profile?.bmi || '--'} ({profile?.bmiCategory || 'N/A'})</span>
          <span className="context-chip"><strong>Goal:</strong> {profile?.fitnessGoal || 'General'}</span>
          <span className="context-chip"><strong>Activity:</strong> {profile?.activityLevel || 'Moderate'}</span>
        </div>
      </div>

      {/* Quick Prompt Pill Strip */}
      <div className="quick-prompts-bar">
        <span className="quick-label">⚡ Quick Prompts:</span>
        <div className="quick-scroll-chips">
          {quickPrompts.map((q, idx) => (
            <button
              key={idx}
              className="quick-chip-btn"
              onClick={() => handleSendMessage(q)}
              disabled={loading}
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages Frame */}
      <div className="chat-window-card glass-card">
        <div className="chat-messages-container">
          {messages.map((msg) => {
            const isAi = msg.sender === 'ai';
            return (
              <div 
                key={msg.id} 
                className={`message-row ${isAi ? 'msg-row-ai' : 'msg-row-user'}`}
              >
                {isAi && (
                  <div className="msg-avatar ai-msg-avatar">
                    <Bot size={18} />
                  </div>
                )}

                <div className={`message-bubble ${isAi ? 'bubble-ai' : 'bubble-user'} ${msg.isError ? 'bubble-error' : ''}`}>
                  <div className="bubble-content">
                    {isAi ? renderFormattedText(msg.text) : msg.text}
                  </div>
                  <div className="bubble-meta">
                    <Clock size={11} />
                    <span>{msg.time}</span>
                  </div>
                </div>

                {!isAi && (
                  <div className="msg-avatar user-msg-avatar">
                    <User size={18} />
                  </div>
                )}
              </div>
            );
          })}

          {/* Typing Indicator */}
          {loading && (
            <div className="message-row msg-row-ai">
              <div className="msg-avatar ai-msg-avatar">
                <Bot size={18} />
              </div>
              <div className="message-bubble bubble-ai bubble-typing">
                <span className="typing-dot"></span>
                <span className="typing-dot"></span>
                <span className="typing-dot"></span>
                <span className="typing-text">Fit Tracker AI is formulating your plan...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Chat Input Bar */}
        <div className="chat-input-bar">
          <textarea
            className="chat-textarea"
            rows="2"
            placeholder="Ask your fitness coach anything (e.g. 'How should I structure my leg day workouts?')..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading}
          />
          <button
            className="btn btn-primary btn-send-chat"
            onClick={() => handleSendMessage()}
            disabled={loading || !inputText.trim()}
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
            <span>Send</span>
          </button>
        </div>
      </div>

      <style>{`
        .ai-chat-page {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          max-width: 1000px;
        }

        .ai-page-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem 1.75rem;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .ai-header-left {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .ai-avatar-glow {
          width: 50px;
          height: 50px;
          border-radius: var(--radius-md);
          background: linear-gradient(135deg, rgba(6, 182, 212, 0.2), rgba(16, 185, 129, 0.2));
          border: 1px solid var(--border-active);
          color: #22d3ee;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 0 20px rgba(6, 182, 212, 0.25);
        }

        .ai-title-row {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .ai-title-row h2 {
          font-size: 1.45rem;
        }

        .creator-badge {
          display: inline-flex;
          align-items: center;
          padding: 0.18rem 0.55rem;
          border-radius: var(--radius-full);
          background: rgba(16, 185, 129, 0.15);
          border: 1px solid rgba(16, 185, 129, 0.3);
          color: #34d399;
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }

        .ai-badge-gemini {
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
          padding: 0.2rem 0.55rem;
          border-radius: var(--radius-full);
          background: linear-gradient(135deg, rgba(6, 182, 212, 0.2), rgba(139, 92, 246, 0.2));
          border: 1px solid rgba(6, 182, 212, 0.4);
          color: #22d3ee;
          font-size: 0.72rem;
          font-weight: 700;
          text-transform: uppercase;
        }

        .ai-header-sub {
          font-size: 0.85rem;
          color: var(--text-muted);
          margin-top: 0.15rem;
        }

        /* Profile Context Strip */
        .profile-context-banner {
          display: flex;
          align-items: center;
          gap: 0.85rem;
          background: rgba(15, 23, 42, 0.7);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          padding: 0.65rem 1rem;
          flex-wrap: wrap;
          font-size: 0.825rem;
        }

        .context-indicator {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-weight: 700;
          color: var(--text-muted);
        }

        .context-chips {
          display: flex;
          flex-wrap: wrap;
          gap: 0.4rem;
        }

        .context-chip {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--border-subtle);
          padding: 0.2rem 0.6rem;
          border-radius: var(--radius-full);
          color: #e5e7eb;
          font-size: 0.775rem;
        }

        .context-chip strong {
          color: var(--primary-light);
        }

        /* Quick Prompts Bar */
        .quick-prompts-bar {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          flex-wrap: wrap;
        }

        .quick-label {
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--text-muted);
        }

        .quick-scroll-chips {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .quick-chip-btn {
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-full);
          padding: 0.4rem 0.85rem;
          font-size: 0.8rem;
          color: var(--text-main);
          cursor: pointer;
          transition: var(--transition);
        }

        .quick-chip-btn:hover {
          background: rgba(16, 185, 129, 0.15);
          border-color: var(--border-active);
          color: var(--primary-light);
          transform: translateY(-2px);
        }

        /* Chat Window */
        .chat-window-card {
          padding: 0;
          display: flex;
          flex-direction: column;
          height: 560px;
          border-radius: var(--radius-lg);
          overflow: hidden;
        }

        .chat-messages-container {
          flex: 1;
          overflow-y: auto;
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .message-row {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          max-width: 82%;
          animation: fadeIn 0.2s ease-out;
        }

        .msg-row-ai {
          align-self: flex-start;
        }

        .msg-row-user {
          align-self: flex-end;
          flex-direction: row;
        }

        .msg-avatar {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          margin-top: 2px;
        }

        .ai-msg-avatar {
          background: rgba(6, 182, 212, 0.15);
          color: #22d3ee;
          border: 1px solid rgba(6, 182, 212, 0.3);
        }

        .user-msg-avatar {
          background: var(--primary-gradient);
          color: #042f1a;
        }

        .message-bubble {
          padding: 1rem 1.25rem;
          border-radius: var(--radius-lg);
          font-size: 0.925rem;
          line-height: 1.55;
          position: relative;
        }

        .bubble-ai {
          background: rgba(17, 24, 39, 0.85);
          border: 1px solid rgba(255, 255, 255, 0.08);
          color: #f3f4f6;
          border-top-left-radius: 4px;
        }

        .bubble-user {
          background: linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(5, 150, 105, 0.25) 100%);
          border: 1px solid rgba(16, 185, 129, 0.4);
          color: #ffffff;
          border-top-right-radius: 4px;
        }

        .bubble-error {
          border-color: rgba(244, 63, 94, 0.4);
          background: rgba(244, 63, 94, 0.1);
        }

        .bubble-meta {
          display: flex;
          align-items: center;
          gap: 0.3rem;
          font-size: 0.7rem;
          color: var(--text-dim);
          margin-top: 0.6rem;
          justify-content: flex-end;
        }

        .bubble-typing {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.85rem 1.25rem;
        }

        .typing-dot {
          width: 7px;
          height: 7px;
          background: #22d3ee;
          border-radius: 50%;
          animation: pulseGlow 1.2s infinite ease-in-out;
        }

        .typing-dot:nth-child(2) { animation-delay: 0.2s; }
        .typing-dot:nth-child(3) { animation-delay: 0.4s; }

        .typing-text {
          font-size: 0.825rem;
          color: var(--text-muted);
          margin-left: 0.4rem;
        }

        /* Typography inside AI bubbles */
        .chat-h3 {
          font-size: 1.05rem;
          font-weight: 700;
          color: #34d399;
          margin: 0.75rem 0 0.35rem;
        }

        .chat-h2 {
          font-size: 1.15rem;
          font-weight: 800;
          color: #22d3ee;
          margin: 0.85rem 0 0.4rem;
        }

        .chat-quote {
          border-left: 3px solid var(--primary);
          padding-left: 0.75rem;
          margin: 0.5rem 0;
          color: #93c5fd;
          font-style: italic;
        }

        .chat-li {
          margin-left: 1.25rem;
          margin-bottom: 0.3rem;
          list-style-type: disc;
        }

        .chat-p {
          margin-bottom: 0.45rem;
        }

        /* Chat Input Area */
        .chat-input-bar {
          background: rgba(11, 15, 25, 0.95);
          border-top: 1px solid var(--border-subtle);
          padding: 1rem 1.25rem;
          display: flex;
          gap: 0.85rem;
          align-items: center;
        }

        .chat-textarea {
          flex: 1;
          background: var(--bg-input);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          color: var(--text-main);
          font-family: var(--font-body);
          font-size: 0.925rem;
          padding: 0.75rem 1rem;
          outline: none;
          resize: none;
          transition: var(--transition);
        }

        .chat-textarea:focus {
          border-color: var(--primary);
          box-shadow: 0 0 0 2px var(--primary-glow);
        }

        .btn-send-chat {
          align-self: flex-end;
          padding: 0.75rem 1.4rem;
          height: 48px;
        }
      `}</style>
    </div>
  );
}
