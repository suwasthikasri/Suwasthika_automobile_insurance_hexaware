
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProposalById, makePayment } from '../../api/services';
import { useAuth } from '../../context/AuthContext';

const COUNTDOWN_SECONDS = 30;

const PaymentPage = () => {
  const { proposalId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [proposal, setProposal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ paymentMethod: 'UPI', transactionId: '' });
  const [formError, setFormError] = useState('');

  
  const [showSuccess, setShowSuccess] = useState(false);
  const [countdown, setCountdown] = useState(COUNTDOWN_SECONDS);
  const timerRef = useRef(null);

  useEffect(() => {
    getProposalById(proposalId)
      .then(r => setProposal(r.data))
      .catch(() => setError('Failed to load proposal'))
      .finally(() => setLoading(false));
  }, [proposalId]);

  
  useEffect(() => {
    if (!showSuccess) return;

    setCountdown(COUNTDOWN_SECONDS);
    timerRef.current = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          navigate('/dashboard');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [showSuccess, navigate]);

  const handleGoNow = () => {
    clearInterval(timerRef.current);
    navigate('/dashboard');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!/^[A-Z0-9]{6,20}$/.test(form.transactionId)) {
      setFormError('Transaction ID must be 6–20 uppercase letters or numbers');
      return;
    }
    setSubmitting(true);
    const payload = {
      proposal: { proposalId: parseInt(proposalId) },
      amount: proposal.quoteAmount,
      paymentMethod: form.paymentMethod,
      transactionId: form.transactionId,
      paymentReference: `REF-${Date.now()}`,
    };
    try {
      await makePayment(payload);
      setShowSuccess(true); 
    } catch (err) {
      setError(err.response?.data?.message || 'Payment failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="loading-screen"><div className="spinner" /></div>;
  if (error && !showSuccess) return <div className="page-container"><div className="alert alert-error">{error}</div></div>;

  return (
    <div className="page-container" style={{ maxWidth: '600px' }}>

      
      {showSuccess && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            
            <div style={styles.iconCircle}>
              <svg viewBox="0 0 52 52" style={styles.checkSvg}>
                <circle cx="26" cy="26" r="25" fill="none" stroke="#22c55e" strokeWidth="2" />
                <path fill="none" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
                  d="M14 27l8 8 16-16" style={styles.checkPath} />
              </svg>
            </div>

            <h2 style={styles.successTitle}>Payment Successful! 🎉</h2>
            <p style={styles.successSub}>
              Your premium of <strong>₹{proposal?.quoteAmount?.toLocaleString()}</strong> has been received.
            </p>

            <div style={styles.detailBox}>
              <div style={styles.detailRow}>
                <span style={styles.detailLabel}>Transaction ID</span>
                <span style={styles.detailValue}>{form.transactionId}</span>
              </div>
              <div style={styles.detailRow}>
                <span style={styles.detailLabel}>Payment Method</span>
                <span style={styles.detailValue}>{form.paymentMethod.replace('_', ' ')}</span>
              </div>
              <div style={styles.detailRow}>
                <span style={styles.detailLabel}>Vehicle</span>
                <span style={styles.detailValue}>{proposal?.vehicleMake} {proposal?.vehicleModel}</span>
              </div>
              <div style={styles.detailRow}>
                <span style={styles.detailLabel}>Reg. No.</span>
                <span style={styles.detailValue}>{proposal?.registrationNumber}</span>
              </div>
              <div style={styles.detailRow}>
                <span style={styles.detailLabel}>Proposal ID</span>
                <span style={styles.detailValue}>{proposal?.proposalUniqueId || `#${proposal?.proposalId}`}</span>
              </div>
            </div>

            <p style={styles.emailNote}>
              📧 A copy of your policy document will be sent to your registered email shortly.
            </p>

            
            <div style={styles.countdownWrap}>
              <div
                style={{
                  ...styles.countdownBar,
                  width: `${(countdown / COUNTDOWN_SECONDS) * 100}%`,
                }}
              />
            </div>
            <p style={styles.countdownText}>
              Redirecting to dashboard in <strong>{countdown}s</strong>…
            </p>

            <button onClick={handleGoNow} style={styles.goBtn}>
              Go to Dashboard Now →
            </button>
          </div>
        </div>
      )}

      
      <div style={{ opacity: showSuccess ? 0.2 : 1, pointerEvents: showSuccess ? 'none' : 'auto', transition: 'opacity 0.3s' }}>
        <div className="page-header">
          <div className="page-title">💳 Premium Payment</div>
          <div className="page-subtitle">Complete your payment to activate the policy</div>
        </div>

        <div className="card" style={{ marginBottom: '1.5rem', background: 'linear-gradient(135deg, var(--navy), var(--navy-light))' }}>
          <div className="card-body">
            <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>Amount Due</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '2.8rem', color: 'var(--gold)', fontWeight: 700 }}>₹{proposal?.quoteAmount?.toLocaleString()}</div>
            <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', marginTop: '0.5rem' }}>
              {proposal?.vehicleMake} {proposal?.vehicleModel} · {proposal?.registrationNumber}
            </div>
            <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1rem', flexWrap: 'wrap' }}>
              <div><div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem' }}>Policy</div><div style={{ color: 'white', fontWeight: 600, fontSize: '0.9rem' }}>{proposal?.policy?.policyName || '—'}</div></div>
              <div><div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem' }}>Proposal ID</div><div style={{ color: 'white', fontWeight: 600, fontSize: '0.9rem' }}>{proposal?.proposalUniqueId || `#${proposal?.proposalId}`}</div></div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header"><div className="card-title">Payment Details</div></div>
          <div className="card-body">
            <form onSubmit={handleSubmit} noValidate>
              <div className="form-group">
                <label className="form-label">Payment Method *</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  {['UPI', 'CARD', 'NET_BANKING', 'WALLET'].map(method => (
                    <label key={method} className={`payment-method-option ${form.paymentMethod === method ? 'selected' : ''}`}>
                      <input type="radio" name="paymentMethod" value={method} checked={form.paymentMethod === method}
                        onChange={e => setForm(f => ({ ...f, paymentMethod: e.target.value }))} style={{ display: 'none' }} />
                      <span className="method-icon">{{ UPI: '📱', CARD: '💳', NET_BANKING: '🏦', WALLET: '👛' }[method]}</span>
                      <span>{method.replace('_', ' ')}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Transaction ID *</label>
                <input className={`form-control ${formError ? 'error' : ''}`}
                  value={form.transactionId}
                  onChange={e => { setForm(f => ({ ...f, transactionId: e.target.value.toUpperCase() })); setFormError(''); }}
                  placeholder="e.g. TXN123ABC456" maxLength={20} style={{ textTransform: 'uppercase' }} />
                {formError && <div className="error-msg">⚠ {formError}</div>}
                <div style={{ fontSize: '0.76rem', color: 'var(--gray-400)', marginTop: '0.2rem' }}>6–20 uppercase letters or numbers</div>
              </div>

              {error && <div className="alert alert-error">⚠️ {error}</div>}

              <div style={{ background: 'var(--gray-100)', borderRadius: 'var(--radius)', padding: '1rem', marginBottom: '1.25rem', fontSize: '0.85rem', color: 'var(--gray-600)' }}>
                🔒 Your payment is secured with 256-bit SSL encryption. AutoShield does not store card details.
              </div>

              <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={submitting}>
                {submitting ? 'Processing...' : `Pay ₹${proposal?.quoteAmount?.toLocaleString()} →`}
              </button>
            </form>
          </div>
        </div>
      </div>

      <style>{`
        .payment-method-option { display:flex; align-items:center; gap:0.5rem; padding:0.85rem 1rem; border:2px solid var(--gray-200); border-radius:var(--radius); cursor:pointer; font-size:0.88rem; font-weight:600; color:var(--navy); transition:var(--transition); }
        .payment-method-option:hover { border-color:var(--gold); }
        .payment-method-option.selected { border-color:var(--gold); background:rgba(201,168,76,0.08); }
        .method-icon { font-size:1.25rem; }

        @keyframes popIn {
          0%   { transform: scale(0.7); opacity: 0; }
          70%  { transform: scale(1.05); }
          100% { transform: scale(1);   opacity: 1; }
        }
        @keyframes drawCheck {
          from { stroke-dashoffset: 50; }
          to   { stroke-dashoffset: 0;  }
        }
      `}</style>
    </div>
  );
};


const styles = {
  overlay: {
    position: 'fixed', inset: 0,
    background: 'rgba(0,0,0,0.55)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    zIndex: 9999,
    padding: '1rem',
  },
  modal: {
    background: '#fff',
    borderRadius: '20px',
    padding: '2.5rem 2rem',
    maxWidth: '460px',
    width: '100%',
    textAlign: 'center',
    boxShadow: '0 25px 60px rgba(0,0,0,0.25)',
    animation: 'popIn 0.4s ease forwards',
  },
  iconCircle: {
    width: '80px', height: '80px',
    margin: '0 auto 1.25rem',
  },
  checkSvg: {
    width: '80px', height: '80px',
  },
  checkPath: {
    strokeDasharray: 50,
    strokeDashoffset: 0,
    animation: 'drawCheck 0.5s ease 0.3s both',
  },
  successTitle: {
    fontSize: '1.6rem',
    fontWeight: 700,
    color: '#0f2044',
    margin: '0 0 0.5rem',
  },
  successSub: {
    fontSize: '1rem',
    color: '#555',
    marginBottom: '1.5rem',
  },
  detailBox: {
    background: '#f8f9fb',
    borderRadius: '12px',
    padding: '1rem 1.25rem',
    textAlign: 'left',
    marginBottom: '1.25rem',
  },
  detailRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '0.35rem 0',
    borderBottom: '1px solid #eee',
    fontSize: '0.88rem',
  },
  detailLabel: { color: '#888', fontWeight: 500 },
  detailValue: { color: '#0f2044', fontWeight: 600 },
  emailNote: {
    fontSize: '0.83rem',
    color: '#666',
    marginBottom: '1.5rem',
    lineHeight: 1.5,
  },
  countdownWrap: {
    height: '6px',
    background: '#e5e7eb',
    borderRadius: '99px',
    overflow: 'hidden',
    marginBottom: '0.5rem',
  },
  countdownBar: {
    height: '100%',
    background: 'linear-gradient(90deg, #c9a84c, #f0c040)',
    borderRadius: '99px',
    transition: 'width 1s linear',
  },
  countdownText: {
    fontSize: '0.82rem',
    color: '#888',
    marginBottom: '1.25rem',
  },
  goBtn: {
    background: 'linear-gradient(135deg, #0f2044, #1a3a6e)',
    color: '#fff',
    border: 'none',
    borderRadius: '10px',
    padding: '0.75rem 2rem',
    fontSize: '0.95rem',
    fontWeight: 600,
    cursor: 'pointer',
    width: '100%',
  },
};

export default PaymentPage;