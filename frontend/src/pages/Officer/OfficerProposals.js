import React, { useState, useEffect } from 'react';
import {
  getAllProposals, approveProposal, rejectProposal, updateProposalStatus,
  sendQuoteEmail, sendPolicyEmail, sendPremiumReminder,
  recordOfficerAction, getActionsByProposal
} from '../../api/services';
import { useAuth } from '../../context/AuthContext';

const statusColor = {
  GENERATED: 'badge-generated', SENT: 'badge-sent', DOWNLOADED: 'badge-downloaded',
  ACTIVE: 'badge-approved', REJECTED: 'badge-rejected', EXPIRED: 'badge-expired',
};

const OfficerProposals = () => {
  const { user } = useAuth();
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const [selected, setSelected] = useState(null);
  const [actions, setActions] = useState([]);
  const [comments, setComments] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  const load = () => getAllProposals().then(r => setProposals(r.data || [])).catch(() => {}).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const openModal = async (p) => {
    setSelected(p); setComments('');
    getActionsByProposal(p.proposalId).then(r => setActions(r.data || [])).catch(() => setActions([]));
  };

  const showMsg = (m, isErr) => {
    if (isErr) setError(m); else setMsg(m);
    setTimeout(() => { setMsg(''); setError(''); }, 3500);
  };

  const handleAction = async (action) => {
    setActionLoading(true);
    try {
      switch (action) {
        case 'approve':
          await approveProposal(selected.proposalId);
          await sendQuoteEmail(selected.proposalId);
          showMsg('✓ Proposal approved & quote email sent to customer!');
          break;
        case 'reject':
          await rejectProposal(selected.proposalId);
          showMsg('Proposal rejected.');
          break;
        case 'activate':
          await updateProposalStatus(selected.proposalId, 'ACTIVE');
          await sendPolicyEmail(selected.proposalId);
          showMsg('✓ Policy activated! Policy document emailed to customer.');
          break;
        case 'request_info':
          if (!comments.trim()) { showMsg('Please add a comment before requesting info.', true); setActionLoading(false); return; }
          await recordOfficerAction({
            officer: { userId: user?.userId },
            proposal: { proposalId: selected.proposalId },
            actionType: 'REQUESTED_INFO',
            comments,
            oldStatus: selected.status,
            newStatus: selected.status,
          });
          showMsg('Additional info request sent to customer.');
          break;
        case 'reminder':
          await sendPremiumReminder(selected.proposalId);
          showMsg('Premium renewal reminder sent!');
          break;
        default: break;
      }
      setSelected(null);
      load();
    } catch (err) {
      showMsg(err.response?.data?.message || 'Action failed. Please try again.', true);
    } finally { setActionLoading(false); }
  };

  const statuses = ['ALL', 'GENERATED', 'SENT', 'ACTIVE', 'REJECTED', 'EXPIRED'];
  const filtered = proposals
    .filter(p => filter === 'ALL' || p.status === filter)
    .filter(p => {
      if (!search) return true;
      const q = search.toLowerCase();
      return (
        p.vehicleMake?.toLowerCase().includes(q) ||
        p.vehicleModel?.toLowerCase().includes(q) ||
        p.registrationNumber?.toLowerCase().includes(q) ||
        p.proposalUniqueId?.toLowerCase().includes(q) ||
        p.userEntity?.fullName?.toLowerCase().includes(q)
      );
    });

  if (loading) return <div className="loading-screen"><div className="spinner" /></div>;

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-title">📋 Proposals Management</div>
        <div className="page-subtitle">Review, approve and manage all insurance proposals</div>
      </div>

      {msg && <div className="alert alert-success">{msg}</div>}
      {error && <div className="alert alert-error">⚠️ {error}</div>}

    
      <div className="stats-grid" style={{ marginBottom: '2rem' }}>
        {[
          { icon: '📋', label: 'Total', value: proposals.length, cls: 'gold' },
          { icon: '⏳', label: 'Pending', value: proposals.filter(p => p.status === 'GENERATED').length, cls: 'navy' },
          { icon: '✅', label: 'Active', value: proposals.filter(p => p.status === 'ACTIVE' || p.status === 'SENT').length, cls: 'teal' },
          { icon: '❌', label: 'Rejected', value: proposals.filter(p => p.status === 'REJECTED').length, cls: 'green' },
        ].map(s => (
          <div key={s.label} className="stat-card">
            <div className={`stat-icon ${s.cls}`}>{s.icon}</div>
            <div><div className="stat-value">{s.value}</div><div className="stat-label">{s.label}</div></div>
          </div>
        ))}
      </div>

      
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <input
          className="form-control" style={{ maxWidth: 280, marginBottom: 0 }}
          placeholder="🔍 Search by name, reg no, vehicle..."
          value={search} onChange={e => setSearch(e.target.value)}
        />
        <div className="tabs" style={{ borderBottom: 'none', marginBottom: 0 }}>
          {statuses.map(s => (
            <button key={s} className={`tab-btn ${filter === s ? 'active' : ''}`} onClick={() => setFilter(s)}
              style={{ padding: '0.5rem 0.9rem', fontSize: '0.82rem' }}>
              {s === 'ALL' ? 'All' : s}
            </button>
          ))}
        </div>
      </div>

      <div className="card">
        <div className="card-body" style={{ padding: 0 }}>
          {filtered.length === 0 ? (
            <div className="empty-state"><div className="empty-state-icon">📋</div><div className="empty-state-title">No proposals found</div></div>
          ) : (
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr><th>Proposal ID</th><th>Customer</th><th>Vehicle</th><th>Policy</th><th>Value</th><th>Quote</th><th>Status</th><th>Date</th><th>Action</th></tr>
                </thead>
                <tbody>
                  {filtered.map(p => (
                    <tr key={p.proposalId}>
                      <td style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>{p.proposalUniqueId || `#${p.proposalId}`}</td>
                      <td>
                        <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>{p.userEntity?.fullName || '—'}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--gray-600)' }}>{p.userEntity?.email}</div>
                      </td>
                      <td>
                        <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>{p.vehicleMake} {p.vehicleModel}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--gray-600)' }}>{p.registrationNumber} · {p.vehicleYear}</div>
                      </td>
                      <td style={{ fontSize: '0.85rem' }}>{p.policy?.policyName || '—'}</td>
                      <td style={{ fontSize: '0.85rem' }}>₹{p.vehicleValue?.toLocaleString() || '—'}</td>
                      <td style={{ fontWeight: 600 }}>{p.quoteAmount ? `₹${p.quoteAmount.toLocaleString()}` : <span style={{ color: 'var(--gray-400)' }}>—</span>}</td>
                      <td><span className={`badge ${statusColor[p.status] || 'badge-initiated'}`}>{p.status?.replace('_', ' ')}</span></td>
                      <td style={{ fontSize: '0.8rem', color: 'var(--gray-600)' }}>{p.createdAt ? new Date(p.createdAt).toLocaleDateString('en-IN') : '—'}</td>
                      <td><button className="btn btn-sm btn-navy" onClick={() => openModal(p)}>Manage</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      
      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal" style={{ maxWidth: 640 }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">Manage Proposal — {selected.proposalUniqueId || `#${selected.proposalId}`}</div>
              <button className="modal-close" onClick={() => setSelected(null)}>×</button>
            </div>
            <div className="modal-body">
             
              <div style={{ background: 'var(--gray-100)', borderRadius: 'var(--radius)', padding: '1.25rem', marginBottom: '1.25rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', fontSize: '0.88rem' }}>
                  {[
                    ['Customer', selected.userEntity?.fullName],
                    ['Email', selected.userEntity?.email],
                    ['Vehicle', `${selected.vehicleMake} ${selected.vehicleModel} (${selected.vehicleYear})`],
                    ['Reg No.', selected.registrationNumber],
                    ['Vehicle Value', `₹${selected.vehicleValue?.toLocaleString()}`],
                    ['Policy', selected.policy?.policyName],
                    ['Add-ons', selected.selectedAddOns || 'None'],
                    ['Status', <span className={`badge ${statusColor[selected.status] || ''}`}>{selected.status}</span>],
                  ].map(([label, value]) => (
                    <div key={label}>
                      <span style={{ color: 'var(--gray-600)', fontWeight: 600 }}>{label}: </span>
                      <span style={{ color: 'var(--navy)' }}>{value || '—'}</span>
                    </div>
                  ))}
                </div>
                {selected.quoteAmount && (
                  <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid var(--gray-200)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 600, color: 'var(--gray-600)' }}>Quote Amount:</span>
                    <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 700, color: 'var(--navy)' }}>₹{selected.quoteAmount.toLocaleString()}</span>
                  </div>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Comments (required for Request Info)</label>
                <textarea className="form-control" rows={3} value={comments}
                  onChange={e => setComments(e.target.value)}
                  placeholder="Add your comments, notes, or information request here..." />
              </div>

             
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
                {(selected.status === 'GENERATED' || !selected.status) && (
                  <>
                    <button className="btn btn-teal btn-sm" disabled={actionLoading} onClick={() => handleAction('approve')}>✓ Approve & Send Quote</button>
                    <button className="btn btn-danger btn-sm" disabled={actionLoading} onClick={() => handleAction('reject')}>✗ Reject</button>
                    <button className="btn btn-outline btn-sm" disabled={actionLoading} onClick={() => handleAction('request_info')}>📄 Request Info</button>
                  </>
                )}
                {selected.status === 'SENT' && (
                  <>
                    <button className="btn btn-primary btn-sm" disabled={actionLoading} onClick={() => handleAction('activate')}>🛡️ Activate Policy</button>
                    <button className="btn btn-outline btn-sm" disabled={actionLoading} onClick={() => handleAction('request_info')}>📄 Request Info</button>
                  </>
                )}
                {selected.status === 'ACTIVE' && (
                  <button className="btn btn-outline btn-sm" disabled={actionLoading} onClick={() => handleAction('reminder')}>🔔 Send Renewal Reminder</button>
                )}
              </div>

              
              {actions.length > 0 && (
                <div style={{ marginTop: '1.5rem' }}>
                  <div style={{ fontWeight: 700, color: 'var(--navy)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.75rem' }}>Activity Log</div>
                  <div style={{ maxHeight: 200, overflowY: 'auto', border: '1px solid var(--gray-200)', borderRadius: 'var(--radius)' }}>
                    {actions.map((a, i) => (
                      <div key={a.actionId} style={{ padding: '0.75rem 1rem', borderBottom: i < actions.length - 1 ? '1px solid var(--gray-100)' : 'none', fontSize: '0.82rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ fontWeight: 600, color: 'var(--navy)' }}>{a.actionType?.replace('_', ' ')}</span>
                          <span style={{ color: 'var(--gray-400)' }}>{a.createdAt ? new Date(a.createdAt).toLocaleDateString('en-IN') : ''}</span>
                        </div>
                        {a.comments && <div style={{ color: 'var(--gray-600)', marginTop: '0.2rem' }}>{a.comments}</div>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline btn-sm" onClick={() => setSelected(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OfficerProposals;
