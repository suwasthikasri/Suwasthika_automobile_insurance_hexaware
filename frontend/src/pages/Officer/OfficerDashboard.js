import React, { useEffect, useState } from 'react';
import { getAllProposals, getAllClaims, getAllPayments, getAllUsers, approveProposal, rejectProposal, updateProposalStatus, approveClaim, rejectClaim, sendQuoteEmail, sendPolicyEmail, recordOfficerAction } from '../../api/services';
import { useAuth } from '../../context/AuthContext';

const statusColors = { GENERATED: 'badge-generated', SENT: 'badge-sent', DOWNLOADED: 'badge-downloaded', ACTIVE: 'badge-approved', REJECTED: 'badge-rejected', EXPIRED: 'badge-expired' };

const OfficerDashboard = () => {
  const { user } = useAuth();
  const [proposals, setProposals] = useState([]);
  const [claims, setClaims] = useState([]);
  const [payments, setPayments] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('proposals');
  const [actionModal, setActionModal] = useState(null);
  const [quoteAmount, setQuoteAmount] = useState('');
  const [comments, setComments] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [msg, setMsg] = useState('');

  const load = () => {
    Promise.all([
      getAllProposals().catch(() => ({ data: [] })),
      getAllClaims().catch(() => ({ data: [] })),
      getAllPayments().catch(() => ({ data: [] })),
      getAllUsers().catch(() => ({ data: [] })),
    ]).then(([p, c, pay, u]) => {
      setProposals(p.data || []);
      setClaims(c.data || []);
      setPayments(pay.data || []);
      setUsers(u.data || []);
    }).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const showMsg = (m) => { setMsg(m); setTimeout(() => setMsg(''), 3000); };

  const handleProposalAction = async (action) => {
    setActionLoading(true);
    try {
      const p = actionModal.proposal;
      if (action === 'approve') {
        await approveProposal(p.proposalId);
        await sendQuoteEmail(p.proposalId);
        showMsg('Proposal approved & quote email sent!');
      } else if (action === 'reject') {
        await rejectProposal(p.proposalId);
        showMsg('Proposal rejected.');
      } else if (action === 'activate') {
        await updateProposalStatus(p.proposalId, 'SENT');
        await sendPolicyEmail(p.proposalId);
        showMsg('Policy activated & document emailed!');
      } else if (action === 'request_info') {
        await recordOfficerAction({
          officer: { userId: user.userId },
          proposal: { proposalId: p.proposalId },
          actionType: 'REQUESTED_INFO',
          comments: comments,
          oldStatus: p.status, newStatus: p.status,
        });
        showMsg('Additional info requested from user.');
      }
      setActionModal(null); setComments(''); setQuoteAmount('');
      load();
    } catch (err) {
      showMsg('Action failed: ' + (err.response?.data?.message || 'Please try again'));
    } finally { setActionLoading(false); }
  };

  if (loading) return <div className="loading-screen"><div className="spinner" /></div>;

  const pending = proposals.filter(p => p.status === 'GENERATED').length;
  const active = proposals.filter(p => p.status === 'SENT' || p.status === 'ACTIVE').length;
  const pendingClaims = claims.filter(c => c.claimStatus === 'INITIATED' || c.claimStatus === 'UNDER_REVIEW').length;

  return (
    <div className="page-container">
      <div className="dashboard-hero">
        <div>
          <div className="page-title">Officer Dashboard 👮</div>
          <div className="page-subtitle">Review proposals, manage policies and process claims</div>
        </div>
      </div>

      {msg && <div className="alert alert-success" style={{marginBottom:'1rem'}}>✓ {msg}</div>}

      
      <div className="stats-grid">
        <div className="stat-card"><div className="stat-icon gold">📋</div><div><div className="stat-value">{proposals.length}</div><div className="stat-label">Total Proposals</div></div></div>
        <div className="stat-card"><div className="stat-icon navy">⏳</div><div><div className="stat-value">{pending}</div><div className="stat-label">Pending Review</div></div></div>
        <div className="stat-card"><div className="stat-icon teal">✅</div><div><div className="stat-value">{active}</div><div className="stat-label">Active Policies</div></div></div>
        <div className="stat-card"><div className="stat-icon green">🗂️</div><div><div className="stat-value">{pendingClaims}</div><div className="stat-label">Pending Claims</div></div></div>
      </div>

      <div className="card">
        <div className="tabs" style={{padding:'0 2rem', paddingTop:'0.5rem'}}>
          {[['proposals','📋 Proposals'], ['claims','🗂️ Claims'], ['payments','💳 Payments'], ['users','👥 Users']].map(([k, l]) => (
            <button key={k} className={`tab-btn ${activeTab === k ? 'active' : ''}`} onClick={() => setActiveTab(k)}>{l}</button>
          ))}
        </div>

        <div className="card-body" style={{paddingTop:0}}>
          
          {activeTab === 'proposals' && (
            <div className="table-wrapper">
              <table>
                <thead><tr><th>Proposal ID</th><th>User</th><th>Vehicle</th><th>Policy</th><th>Quote</th><th>Status</th><th>Actions</th></tr></thead>
                <tbody>
                  {proposals.length === 0 && <tr><td colSpan={7}><div className="empty-state"><div className="empty-state-icon">📋</div><div className="empty-state-title">No proposals yet</div></div></td></tr>}
                  {proposals.map(p => (
                    <tr key={p.proposalId}>
                      <td style={{fontFamily:'monospace', fontSize:'0.8rem'}}>{p.proposalUniqueId || `#${p.proposalId}`}</td>
                      <td>{p.userEntity?.fullName || p.userEntity?.username || '—'}</td>
                      <td><strong>{p.vehicleMake} {p.vehicleModel}</strong><br/><span style={{fontSize:'0.75rem', color:'var(--gray-600)'}}>{p.registrationNumber}</span></td>
                      <td style={{fontSize:'0.85rem'}}>{p.policy?.policyName || '—'}</td>
                      <td>{p.quoteAmount ? `₹${p.quoteAmount.toLocaleString()}` : <span style={{color:'var(--gray-400)'}}>—</span>}</td>
                      <td><span className={`badge ${statusColors[p.status] || 'badge-initiated'}`}>{p.status?.replace('_', ' ')}</span></td>
                      <td>
                        <button className="btn btn-sm btn-navy" onClick={() => setActionModal({ proposal: p })}>Manage</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

         
          {activeTab === 'claims' && (
            <div className="table-wrapper">
              <table>
                <thead><tr><th>Claim Ref</th><th>Reason</th><th>Amount</th><th>Status</th><th>Actions</th></tr></thead>
                <tbody>
                  {claims.length === 0 && <tr><td colSpan={5}><div className="empty-state"><div className="empty-state-icon">🗂️</div><div className="empty-state-title">No claims</div></div></td></tr>}
                  {claims.map(c => (
                    <tr key={c.claimId}>
                      <td style={{fontFamily:'monospace', fontSize:'0.8rem'}}>{c.claimReference}</td>
                      <td>{c.claimReason}</td>
                      <td>₹{Number(c.claimAmount).toLocaleString()}</td>
                      <td><span className={`badge badge-${c.claimStatus?.toLowerCase().replace('_','-')}`}>{c.claimStatus?.replace('_', ' ')}</span></td>
                      <td>
                        <div style={{display:'flex', gap:'0.5rem'}}>
                          {(c.claimStatus === 'INITIATED' || c.claimStatus === 'UNDER_REVIEW') && (
                            <>
                              <button className="btn btn-sm btn-teal" onClick={async () => { await approveClaim(c.claimId); showMsg('Claim approved!'); load(); }}>Approve</button>
                              <button className="btn btn-sm btn-danger" onClick={async () => { await rejectClaim(c.claimId); showMsg('Claim rejected.'); load(); }}>Reject</button>
                            </>
                          )}
                          {c.claimStatus === 'APPROVED' && (
                            <button className="btn btn-sm btn-primary" onClick={async () => { const { processClaimPayment } = await import('../../api/services'); await processClaimPayment(c.claimId); showMsg('Payment processed!'); load(); }}>Pay Claim</button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          
          {activeTab === 'payments' && (
  <div className="table-wrapper">
    <table>
      <thead>
        <tr>
          <th>Reference</th>
          <th>Proposal</th>
          <th>Amount</th>
          <th>Method</th>
          <th>Transaction ID</th>
          <th>Status</th>
          <th>Date</th>
        </tr>
      </thead>
      <tbody>
        {payments.length === 0 && (
          <tr><td colSpan={7}>
            <div className="empty-state">
              <div className="empty-state-icon">💳</div>
              <div className="empty-state-title">No payments found</div>
            </div>
          </td></tr>
        )}
        {payments.map(p => {
          const statusBadge = {
            COMPLETED: 'badge-approved',
            PENDING:   'badge-generated',
            FAILED:    'badge-rejected',
            REFUNDED:  'badge-expired',
          }[p.paymentStatus] || 'badge-initiated';

          return (
            <tr key={p.paymentId}>
              <td style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>
                {p.paymentReference || <span style={{ color: 'var(--gray-400)' }}>—</span>}
              </td>
              <td style={{ fontSize: '0.8rem', color: 'var(--gray-600)' }}>
                {p.proposal?.proposalUniqueId || (p.proposal?.proposalId ? `#${p.proposal.proposalId}` : '—')}
              </td>
              <td style={{ fontWeight: 600 }}>
                {p.amount ? `₹${Number(p.amount).toLocaleString()}` : '—'}
              </td>
              <td>
                {p.paymentMethod ? p.paymentMethod.replace('_', ' ') : <span style={{ color: 'var(--gray-400)' }}>—</span>}
              </td>
              <td style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>
                {p.transactionId || '—'}
              </td>
              <td>
                {p.paymentStatus
                  ? <span className={`badge ${statusBadge}`}>{p.paymentStatus}</span>
                  : <span style={{ color: 'var(--gray-400)', fontSize: '0.8rem' }}>—</span>}
              </td>
              <td style={{ fontSize: '0.82rem', color: 'var(--gray-600)' }}>
                {p.paidAt
                  ? new Date(p.paidAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
                  : <span style={{ color: 'var(--gray-400)' }}>—</span>}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  </div>
)}

          
          {activeTab === 'users' && (
            <div className="table-wrapper">
              <table>
                <thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>Role</th><th>Status</th><th>Joined</th></tr></thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.userId}>
                      <td><strong>{u.fullName}</strong><br/><span style={{fontSize:'0.75rem', color:'var(--gray-600)'}}>@{u.username}</span></td>
                      <td>{u.email}</td>
                      <td>{u.phoneNumber}</td>
                      <td><span className={`badge ${u.role === 'OFFICER' ? 'badge-initiated' : 'badge-approved'}`}>{u.role}</span></td>
                      <td><span className={`badge ${u.isActive ? 'badge-approved' : 'badge-rejected'}`}>{u.isActive ? 'Active' : 'Inactive'}</span></td>
                      <td>{u.createdAt ? new Date(u.createdAt).toLocaleDateString('en-IN') : '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

     
      {actionModal && (
        <div className="modal-overlay" onClick={() => setActionModal(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">Manage Proposal #{actionModal.proposal.proposalId}</div>
              <button className="modal-close" onClick={() => setActionModal(null)}>×</button>
            </div>
            <div className="modal-body">
              
              <div style={{background:'var(--gray-100)', borderRadius:'var(--radius)', padding:'1rem', marginBottom:'1.25rem', fontSize:'0.88rem'}}>
                <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.5rem'}}>
                  <div><span style={{color:'var(--gray-600)'}}>Vehicle: </span><strong>{actionModal.proposal.vehicleMake} {actionModal.proposal.vehicleModel} ({actionModal.proposal.vehicleYear})</strong></div>
                  <div><span style={{color:'var(--gray-600)'}}>Reg: </span><strong>{actionModal.proposal.registrationNumber}</strong></div>
                  <div><span style={{color:'var(--gray-600)'}}>Value: </span><strong>₹{actionModal.proposal.vehicleValue?.toLocaleString()}</strong></div>
                  <div><span style={{color:'var(--gray-600)'}}>Status: </span><span className={`badge ${statusColors[actionModal.proposal.status] || ''}`}>{actionModal.proposal.status}</span></div>
                  <div><span style={{color:'var(--gray-600)'}}>Policy: </span><strong>{actionModal.proposal.policy?.policyName}</strong></div>
                  <div><span style={{color:'var(--gray-600)'}}>Add-ons: </span>{actionModal.proposal.selectedAddOns || 'None'}</div>
                </div>
                {actionModal.proposal.quoteAmount && <div style={{marginTop:'0.5rem'}}><span style={{color:'var(--gray-600)'}}>Quote: </span><strong>₹{actionModal.proposal.quoteAmount.toLocaleString()}</strong></div>}
              </div>

              <div className="form-group">
                <label className="form-label">Comments / Notes</label>
                <textarea className="form-control" value={comments} onChange={e => setComments(e.target.value)} rows={3} placeholder="Add comments for the applicant..." />
              </div>
            </div>
            <div className="modal-footer" style={{flexWrap:'wrap', gap:'0.5rem'}}>
              {(actionModal.proposal.status === 'GENERATED' || !actionModal.proposal.status) && (
                <>
                  <button className="btn btn-teal btn-sm" disabled={actionLoading} onClick={() => handleProposalAction('approve')}>✓ Approve & Send Quote</button>
                  <button className="btn btn-danger btn-sm" disabled={actionLoading} onClick={() => handleProposalAction('reject')}>✗ Reject</button>
                  <button className="btn btn-outline btn-sm" disabled={actionLoading} onClick={() => handleProposalAction('request_info')}>📄 Request Info</button>
                </>
              )}
              {actionModal.proposal.status === 'SENT' && (
                <button className="btn btn-primary btn-sm" disabled={actionLoading} onClick={() => handleProposalAction('activate')}>🛡️ Activate Policy</button>
              )}
              <button className="btn btn-outline btn-sm" onClick={() => setActionModal(null)}>Close</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .dashboard-hero { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:2rem; gap:1rem; flex-wrap:wrap; }
      `}</style>
    </div>
  );
};

export default OfficerDashboard;
