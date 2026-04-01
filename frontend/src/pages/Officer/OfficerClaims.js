import React, { useState, useEffect } from 'react';
import { getAllClaims, approveClaim, rejectClaim, processClaimPayment, getClaimsByStatus } from '../../api/services';

const statusColor = {
  INITIATED: 'badge-initiated', UNDER_REVIEW: 'badge-under_review',
  APPROVED: 'badge-approved', REJECTED: 'badge-rejected', PAID: 'badge-sent',
};

const OfficerClaims = () => {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');
  const [selectedClaim, setSelectedClaim] = useState(null);

  const load = () => {
    getAllClaims()
      .then(r => setClaims(r.data || []))
      .catch(() => setClaims([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const showMsg = (m, isErr) => {
    if (isErr) setError(m); else setMsg(m);
    setTimeout(() => { setMsg(''); setError(''); }, 3000);
  };

  const handleAction = async (action, claimId) => {
    try {
      if (action === 'approve') { await approveClaim(claimId); showMsg('Claim approved!'); }
      else if (action === 'reject') { await rejectClaim(claimId); showMsg('Claim rejected.'); }
      else if (action === 'pay') { await processClaimPayment(claimId); showMsg('Claim payment processed!'); }
      setSelectedClaim(null);
      load();
    } catch (err) {
      showMsg(err.response?.data?.message || 'Action failed', true);
    }
  };

  const statuses = ['ALL', 'INITIATED', 'UNDER_REVIEW', 'APPROVED', 'REJECTED', 'PAID'];
  const filtered = filter === 'ALL' ? claims : claims.filter(c => c.claimStatus === filter);

  const stats = {
    total: claims.length,
    pending: claims.filter(c => c.claimStatus === 'INITIATED' || c.claimStatus === 'UNDER_REVIEW').length,
    approved: claims.filter(c => c.claimStatus === 'APPROVED').length,
    paid: claims.filter(c => c.claimStatus === 'PAID').length,
  };

  if (loading) return <div className="loading-screen"><div className="spinner" /></div>;

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-title">🗂️ Claims Management</div>
        <div className="page-subtitle">Review and process insurance claims</div>
      </div>

      {msg && <div className="alert alert-success">✓ {msg}</div>}
      {error && <div className="alert alert-error">⚠️ {error}</div>}

      <div className="stats-grid" style={{ marginBottom: '2rem' }}>
        <div className="stat-card"><div className="stat-icon gold">🗂️</div><div><div className="stat-value">{stats.total}</div><div className="stat-label">Total Claims</div></div></div>
        <div className="stat-card"><div className="stat-icon navy">⏳</div><div><div className="stat-value">{stats.pending}</div><div className="stat-label">Pending Review</div></div></div>
        <div className="stat-card"><div className="stat-icon teal">✅</div><div><div className="stat-value">{stats.approved}</div><div className="stat-label">Approved</div></div></div>
        <div className="stat-card"><div className="stat-icon green">💰</div><div><div className="stat-value">{stats.paid}</div><div className="stat-label">Paid Out</div></div></div>
      </div>

      
      <div className="tabs" style={{ marginBottom: '1.5rem' }}>
        {statuses.map(s => (
          <button key={s} className={`tab-btn ${filter === s ? 'active' : ''}`} onClick={() => setFilter(s)}>
            {s === 'ALL' ? `All (${claims.length})` : `${s.replace('_', ' ')} (${claims.filter(c => c.claimStatus === s).length})`}
          </button>
        ))}
      </div>

      <div className="card">
        <div className="card-body" style={{ padding: 0 }}>
          {filtered.length === 0 ? (
            <div className="empty-state"><div className="empty-state-icon">🗂️</div><div className="empty-state-title">No claims found</div></div>
          ) : (
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr><th>Claim Reference</th><th>Reason</th><th>Amount</th><th>Status</th><th>Filed On</th><th>Actions</th></tr>
                </thead>
                <tbody>
                  {filtered.map(c => (
                    <tr key={c.claimId}>
                      <td>
                        <div style={{ fontFamily: 'monospace', fontSize: '0.85rem', fontWeight: 600, color: 'var(--navy)' }}>{c.claimReference}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--gray-600)' }}>Proposal #{c.proposal?.proposalId}</div>
                      </td>
                      <td style={{ maxWidth: 220 }}>
                        <div style={{ fontSize: '0.88rem', lineHeight: 1.5 }}>{c.claimReason}</div>
                        {c.officerComments && <div style={{ fontSize: '0.75rem', color: 'var(--teal-dark)', marginTop: '0.2rem' }}>Note: {c.officerComments}</div>}
                      </td>
                      <td style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', fontWeight: 700 }}>₹{Number(c.claimAmount).toLocaleString()}</td>
                      <td><span className={`badge ${statusColor[c.claimStatus] || ''}`}>{c.claimStatus?.replace('_', ' ')}</span></td>
                      <td style={{ fontSize: '0.82rem', color: 'var(--gray-600)' }}>{c.createdAt ? new Date(c.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}</td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                          {(c.claimStatus === 'INITIATED' || c.claimStatus === 'UNDER_REVIEW') && (
                            <>
                              <button className="btn btn-sm btn-teal" onClick={() => handleAction('approve', c.claimId)}>Approve</button>
                              <button className="btn btn-sm btn-danger" onClick={() => handleAction('reject', c.claimId)}>Reject</button>
                            </>
                          )}
                          {c.claimStatus === 'APPROVED' && (
                            <button className="btn btn-sm btn-primary" onClick={() => handleAction('pay', c.claimId)}>Process Payment</button>
                          )}
                          {(c.claimStatus === 'REJECTED' || c.claimStatus === 'PAID') && (
                            <span style={{ fontSize: '0.8rem', color: 'var(--gray-400)' }}>Closed</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OfficerClaims;
