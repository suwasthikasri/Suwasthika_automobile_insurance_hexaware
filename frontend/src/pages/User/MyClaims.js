import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProposalsByUser, fileClaim, getClaimsByUser } from '../../api/services';
import { useAuth } from '../../context/AuthContext';

const MyClaims = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [proposals, setProposals] = useState([]);
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState('');
  const [apiError, setApiError] = useState('');
  const [form, setForm] = useState({ proposalId: '', claimReason: '', claimAmount: '', claimReference: '' });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    if (!user?.userId) return;
    Promise.all([
      getProposalsByUser(user.userId).catch(() => ({ data: [] })),
      getClaimsByUser(user.userId).catch(() => ({ data: [] })),
    ]).then(([p, c]) => {
      setProposals((p.data || []).filter(pr => pr.status === 'SENT' || pr.status === 'ACTIVE'));
      setClaims(c.data || []);
    }).finally(() => setLoading(false));
  }, [user]);

  const validate = () => {
    const e = {};
    if (!form.proposalId) e.proposalId = 'Select a policy proposal';
    if (!form.claimReference || form.claimReference.length < 5) e.claimReference = 'Claim reference min 5 chars';
    if (!form.claimReason || form.claimReason.length < 5) e.claimReason = 'Claim reason min 5 chars';
    if (!form.claimAmount || form.claimAmount <= 0) e.claimAmount = 'Enter a valid amount';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setFormErrors(errs); return; }
    setSubmitting(true); setApiError('');
    try {
      await fileClaim({
        proposal: { proposalId: parseInt(form.proposalId) },
        claimReference: form.claimReference,
        claimReason: form.claimReason,
        claimAmount: parseFloat(form.claimAmount),
      });
      setMsg('Claim filed successfully!');
      setShowModal(false);
      setForm({ proposalId: '', claimReason: '', claimAmount: '', claimReference: '' });
      
      getClaimsByUser(user.userId).then(r => setClaims(r.data || []));
    } catch (err) {
      setApiError(err.response?.data?.message || 'Failed to file claim.');
    } finally { setSubmitting(false); }
  };

  const statusColor = { INITIATED: 'badge-initiated', UNDER_REVIEW: 'badge-under_review', APPROVED: 'badge-approved', REJECTED: 'badge-rejected', PAID: 'badge-sent' };

  if (loading) return <div className="loading-screen"><div className="spinner" /></div>;

  return (
    <div className="page-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <button className="btn btn-outline btn-sm" onClick={() => navigate('/dashboard')} style={{ marginBottom: '0.75rem' }}>← Dashboard</button>
          <div className="page-title">My Claims</div>
          <div className="page-subtitle">Track and manage your insurance claims</div>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ File New Claim</button>
      </div>

      {msg && <div className="alert alert-success">✓ {msg}</div>}

      {claims.length === 0 ? (
        <div className="card">
          <div className="card-body">
            <div className="empty-state">
              <div className="empty-state-icon">🗂️</div>
              <div className="empty-state-title">No claims filed yet</div>
              <p style={{ color: 'var(--gray-400)', marginBottom: '1.5rem' }}>File a claim against any of your active policies</p>
              <button className="btn btn-primary" onClick={() => setShowModal(true)}>File a Claim</button>
            </div>
          </div>
        </div>
      ) : (
        <div className="card">
          <div className="card-body" style={{ padding: 0 }}>
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Claim Reference</th>
                    <th>Reason</th>
                    <th>Amount Claimed</th>
                    <th>Status</th>
                    <th>Officer Comments</th>
                    <th>Filed On</th>
                  </tr>
                </thead>
                <tbody>
                  {claims.map(c => (
                    <tr key={c.claimId}>
                      <td style={{ fontFamily: 'monospace', fontSize: '0.85rem', fontWeight: 600 }}>{c.claimReference}</td>
                      <td style={{ maxWidth: 200 }}>{c.claimReason}</td>
                      <td style={{ fontWeight: 600 }}>₹{Number(c.claimAmount).toLocaleString()}</td>
                      <td><span className={`badge ${statusColor[c.claimStatus] || 'badge-initiated'}`}>{c.claimStatus?.replace('_', ' ')}</span></td>
                      <td style={{ color: 'var(--gray-600)', fontSize: '0.85rem' }}>{c.officerComments || <span style={{ color: 'var(--gray-400)' }}>—</span>}</td>
                      <td style={{ fontSize: '0.82rem', color: 'var(--gray-600)' }}>{c.createdAt ? new Date(c.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

     
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginTop: '2rem' }}>
        {[
          { icon: '📝', step: '01', title: 'File Claim', desc: 'Submit your claim with all required details and reference number.' },
          { icon: '🔍', step: '02', title: 'Under Review', desc: 'Our officer reviews your claim and supporting documents.' },
          { icon: '✅', step: '03', title: 'Approval', desc: 'Claim is approved or rejected based on policy terms.' },
          { icon: '💰', step: '04', title: 'Settlement', desc: 'Approved claim amount is settled directly to your account.' },
        ].map(s => (
          <div key={s.step} style={{ background: 'var(--white)', border: '1px solid var(--gray-200)', borderRadius: 'var(--radius-lg)', padding: '1.5rem', textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', color: 'rgba(201,168,76,0.25)', fontWeight: 700 }}>{s.step}</div>
            <div style={{ fontSize: '1.8rem', margin: '0.25rem 0' }}>{s.icon}</div>
            <div style={{ fontWeight: 700, color: 'var(--navy)', marginBottom: '0.4rem' }}>{s.title}</div>
            <div style={{ fontSize: '0.82rem', color: 'var(--gray-600)', lineHeight: 1.6 }}>{s.desc}</div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">🗂️ File a New Claim</div>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>
            <div className="modal-body">
              {apiError && <div className="alert alert-error">⚠️ {apiError}</div>}
              {proposals.length === 0 && (
                <div className="alert alert-info">ℹ️ You need an active policy before filing a claim.</div>
              )}
              <form onSubmit={handleSubmit} noValidate>
                <div className="form-group">
                  <label className="form-label">Select Policy *</label>
                  <select className={`form-control ${formErrors.proposalId ? 'error' : ''}`}
                    value={form.proposalId} onChange={e => setForm(f => ({ ...f, proposalId: e.target.value }))}>
                    <option value="">-- Select an active policy --</option>
                    {proposals.map(p => (
                      <option key={p.proposalId} value={p.proposalId}>
                        {p.vehicleMake} {p.vehicleModel} — {p.registrationNumber}
                      </option>
                    ))}
                  </select>
                  {formErrors.proposalId && <div className="error-msg">⚠ {formErrors.proposalId}</div>}
                </div>
                <div className="form-group">
                  <label className="form-label">Claim Reference *</label>
                  <input className={`form-control ${formErrors.claimReference ? 'error' : ''}`}
                    value={form.claimReference}
                    onChange={e => { setForm(f => ({ ...f, claimReference: e.target.value })); setFormErrors(p => ({ ...p, claimReference: '' })); }}
                    placeholder="e.g. CLM-TN47-2025-001 (min 5 chars)" />
                  {formErrors.claimReference && <div className="error-msg">⚠ {formErrors.claimReference}</div>}
                </div>
                <div className="form-group">
                  <label className="form-label">Claim Reason *</label>
                  <textarea className={`form-control ${formErrors.claimReason ? 'error' : ''}`}
                    value={form.claimReason}
                    onChange={e => { setForm(f => ({ ...f, claimReason: e.target.value })); setFormErrors(p => ({ ...p, claimReason: '' })); }}
                    rows={3} placeholder="Describe the incident in detail (min 5 chars)..." />
                  {formErrors.claimReason && <div className="error-msg">⚠ {formErrors.claimReason}</div>}
                </div>
                <div className="form-group">
                  <label className="form-label">Claim Amount (₹) *</label>
                  <input className={`form-control ${formErrors.claimAmount ? 'error' : ''}`}
                    type="number" value={form.claimAmount}
                    onChange={e => { setForm(f => ({ ...f, claimAmount: e.target.value })); setFormErrors(p => ({ ...p, claimAmount: '' })); }}
                    placeholder="e.g. 25000" />
                  {formErrors.claimAmount && <div className="error-msg">⚠ {formErrors.claimAmount}</div>}
                </div>
                <div style={{ background: 'rgba(29,184,168,0.08)', border: '1px solid rgba(29,184,168,0.2)', borderRadius: 'var(--radius)', padding: '0.85rem 1rem', fontSize: '0.83rem', color: 'var(--teal-dark)', marginBottom: '1rem' }}>
                  ℹ️ Claims are subject to policy terms and conditions. Our officer will review within 2–3 business days.
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                  <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary" disabled={submitting || proposals.length === 0}>
                    {submitting ? 'Filing...' : '📤 Submit Claim'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyClaims;
