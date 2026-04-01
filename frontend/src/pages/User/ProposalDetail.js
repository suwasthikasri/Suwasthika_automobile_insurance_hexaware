import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getProposalById, getActionsByProposal, getDocumentByProposal, getPaymentByProposal } from '../../api/services';

const STATUS_STEPS = [
  { key: 'GENERATED', label: 'Proposal Submitted', icon: '📝', desc: 'Your proposal has been submitted and is awaiting review.' },
  { key: 'SENT', label: 'Quote Generated', icon: '💰', desc: 'A quote has been generated. Please proceed with payment.' },
  { key: 'ACTIVE', label: 'Policy Active', icon: '🛡️', desc: 'Payment confirmed. Your policy is now active.' },
  { key: 'EXPIRED', label: 'Expired', icon: '⏰', desc: 'Your policy has expired. Please renew.' },
];

const ProposalDetail = () => {
  const { proposalId } = useParams();
  const navigate = useNavigate();
  const [proposal, setProposal] = useState(null);
  const [actions, setActions] = useState([]);
  const [document, setDocument] = useState(null);
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([
      getProposalById(proposalId),
      getActionsByProposal(proposalId).catch(() => ({ data: [] })),
      getDocumentByProposal(proposalId).catch(() => ({ data: null })),
      getPaymentByProposal(proposalId).catch(() => ({ data: null })),
    ]).then(([p, a, d, pay]) => {
      setProposal(p.data);
      setActions(a.data || []);
      setDocument(d.data);
      setPayment(pay.data);
    }).catch(() => setError('Failed to load proposal details.'))
      .finally(() => setLoading(false));
  }, [proposalId]);

  if (loading) return <div className="loading-screen"><div className="spinner" /></div>;
  if (error) return <div className="page-container"><div className="alert alert-error">{error}</div></div>;
  if (!proposal) return null;

  const currentStepIndex = STATUS_STEPS.findIndex(s => s.key === proposal.status);

  return (
    <div className="page-container" style={{ maxWidth: '900px' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <button className="btn btn-outline btn-sm" onClick={() => navigate('/dashboard')} style={{ marginBottom: '0.75rem' }}>← Back to Dashboard</button>
          <div className="page-title">Proposal Detail</div>
          <div style={{ fontFamily: 'monospace', color: 'var(--gray-600)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            {proposal.proposalUniqueId || `#${proposal.proposalId}`}
          </div>
        </div>
        {proposal.status === 'SENT' && proposal.quoteAmount && (
          <Link to={`/proposals/${proposalId}/pay`} className="btn btn-primary btn-lg">
            💳 Pay ₹{proposal.quoteAmount?.toLocaleString()}
          </Link>
        )}
      </div>

      
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div className="card-header"><div className="card-title">📊 Policy Status</div></div>
        <div className="card-body">
          <div className="status-timeline">
            {STATUS_STEPS.map((step, idx) => {
              const isCompleted = idx < currentStepIndex;
              const isCurrent = idx === currentStepIndex;
              const isRejected = proposal.status === 'REJECTED';
              return (
                <div key={step.key} className={`timeline-step ${isCompleted ? 'completed' : ''} ${isCurrent ? 'current' : ''} ${isRejected && isCurrent ? 'rejected-step' : ''}`}>
                  <div className="timeline-icon-wrap">
                    <div className="timeline-icon">
                      {isCompleted ? '✓' : isCurrent && isRejected ? '✗' : step.icon}
                    </div>
                    {idx < STATUS_STEPS.length - 1 && <div className="timeline-line" />}
                  </div>
                  <div className="timeline-content">
                    <div className="timeline-label">{step.label}</div>
                    {isCurrent && <div className="timeline-desc">{isRejected ? 'Your proposal was rejected.' : step.desc}</div>}
                  </div>
                </div>
              );
            })}
            {proposal.status === 'REJECTED' && (
              <div className="timeline-step rejected-step current">
                <div className="timeline-icon-wrap">
                  <div className="timeline-icon" style={{ background: 'var(--red)', color: 'white' }}>✗</div>
                </div>
                <div className="timeline-content">
                  <div className="timeline-label">Rejected</div>
                  <div className="timeline-desc">Your proposal was rejected by the officer.</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      
      {proposal.additionalInfoRequested && (
        <div className="alert alert-info" style={{ marginBottom: '1.5rem' }}>
          📄 <strong>Officer has requested additional information:</strong> {proposal.additionalInfoRequested}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        
        <div className="card">
          <div className="card-header"><div className="card-title">🚗 Vehicle Information</div></div>
          <div className="card-body">
            <div className="detail-grid">
              {[
                ['Make & Model', `${proposal.vehicleMake} ${proposal.vehicleModel}`],
                ['Year', proposal.vehicleYear],
                ['Registration No.', proposal.registrationNumber],
                ['Chassis No.', proposal.chassisNumber],
                ['Engine No.', proposal.engineNumber],
                ['Vehicle Value', `₹${proposal.vehicleValue?.toLocaleString()}`],
                ['Selected Add-ons', proposal.selectedAddOns || 'None'],
              ].map(([label, value]) => (
                <div key={label} className="detail-item">
                  <div className="detail-label">{label}</div>
                  <div className="detail-value">{value || '—'}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

      
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="card">
            <div className="card-header"><div className="card-title">🛡️ Policy Details</div></div>
            <div className="card-body">
              <div className="detail-grid">
                {[
                  ['Policy Name', proposal.policy?.policyName],
                  ['Vehicle Category', proposal.policy?.vehicleCategory],
                  ['Base Premium', proposal.policy?.basePremium ? `₹${proposal.policy.basePremium.toLocaleString()}/yr` : '—'],
                  ['Submitted', proposal.createdAt ? new Date(proposal.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'],
                  ['Expires At', proposal.expiresAt ? new Date(proposal.expiresAt).toLocaleDateString('en-IN') : '—'],
                ].map(([label, value]) => (
                  <div key={label} className="detail-item">
                    <div className="detail-label">{label}</div>
                    <div className="detail-value">{value || '—'}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {proposal.quoteAmount && (
            <div className="card" style={{ background: 'linear-gradient(135deg, var(--navy), var(--navy-light))', border: 'none' }}>
              <div className="card-body" style={{ textAlign: 'center' }}>
                <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>Quote Amount</div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', color: 'var(--gold)', fontWeight: 700 }}>
                  ₹{proposal.quoteAmount.toLocaleString()}
                </div>
                <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.82rem', marginTop: '0.25rem' }}>Annual Premium</div>
              </div>
            </div>
          )}
        </div>
      </div>

      
      {payment && (
        <div className="card" style={{ marginTop: '1.5rem' }}>
          <div className="card-header"><div className="card-title">💳 Payment Details</div></div>
          <div className="card-body">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
              {[
                ['Amount Paid', `₹${payment.amount?.toLocaleString()}`],
                ['Payment Method', payment.paymentMethod?.replace('_', ' ')],
                ['Transaction ID', payment.transactionId],
                ['Reference', payment.paymentReference],
                ['Status', payment.paymentStatus],
                ['Paid On', payment.paidAt ? new Date(payment.paidAt).toLocaleDateString('en-IN') : '—'],
              ].map(([label, value]) => (
                <div key={label} style={{ borderBottom: '1px solid var(--gray-100)', paddingBottom: '0.75rem' }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--gray-400)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.06em' }}>{label}</div>
                  <div style={{ fontWeight: 600, color: 'var(--navy)', marginTop: '0.2rem' }}>{value || '—'}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      
      {document && (
        <div className="card" style={{ marginTop: '1.5rem' }}>
          <div className="card-header">
            <div className="card-title">📄 Policy Document</div>
            <span className={`badge badge-${document.status?.toLowerCase()}`}>{document.status}</span>
          </div>
          <div className="card-body" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ fontWeight: 600, color: 'var(--navy)' }}>{document.fileName}</div>
              <div style={{ fontSize: '0.82rem', color: 'var(--gray-600)', marginTop: '0.25rem' }}>ID: {document.documentUniqueId} · {document.documentType?.replace('_', ' ')}</div>
            </div>
            <a href={document.filePath} target="_blank" rel="noreferrer" className="btn btn-primary btn-sm">⬇ Download</a>
          </div>
        </div>
      )}

      
      {actions.length > 0 && (
        <div className="card" style={{ marginTop: '1.5rem' }}>
          <div className="card-header"><div className="card-title">📋 Officer Activity Log</div></div>
          <div className="card-body" style={{ padding: '0' }}>
            {actions.map((action, i) => (
              <div key={action.actionId} style={{ padding: '1rem 2rem', borderBottom: i < actions.length - 1 ? '1px solid var(--gray-100)' : 'none', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--gray-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', flexShrink: 0 }}>
                  {{ REVIEWED: '🔍', REQUESTED_INFO: '📄', QUOTE_GENERATED: '💰', APPROVED: '✅', REJECTED: '❌', STATUS_CHANGED: '🔄' }[action.actionType] || '⚙️'}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <span style={{ fontWeight: 600, color: 'var(--navy)', fontSize: '0.9rem' }}>{action.actionType?.replace('_', ' ')}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--gray-400)' }}>{action.createdAt ? new Date(action.createdAt).toLocaleString('en-IN') : ''}</span>
                  </div>
                  {action.comments && <div style={{ color: 'var(--gray-600)', fontSize: '0.85rem', marginTop: '0.25rem' }}>{action.comments}</div>}
                  {action.oldStatus && action.newStatus && (
                    <div style={{ fontSize: '0.78rem', color: 'var(--gray-400)', marginTop: '0.25rem' }}>
                      {action.oldStatus} → {action.newStatus}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <style>{`
        .status-timeline { display: flex; gap: 0; flex-direction: column; }
        .timeline-step { display: flex; gap: 1rem; align-items: flex-start; }
        .timeline-icon-wrap { display: flex; flex-direction: column; align-items: center; flex-shrink: 0; }
        .timeline-icon {
          width: 40px; height: 40px; border-radius: 50%;
          background: var(--gray-200); color: var(--gray-600);
          display: flex; align-items: center; justify-content: center;
          font-size: 1.1rem; font-weight: 700; z-index: 1;
          border: 2px solid var(--gray-200);
        }
        .timeline-step.completed .timeline-icon { background: var(--green); color: white; border-color: var(--green); }
        .timeline-step.current .timeline-icon { background: var(--gold); color: var(--navy); border-color: var(--gold); }
        .timeline-step.rejected-step .timeline-icon { background: var(--red); color: white; border-color: var(--red); }
        .timeline-line { width: 2px; height: 40px; background: var(--gray-200); margin: 4px 0; }
        .timeline-step.completed .timeline-line { background: var(--green); }
        .timeline-content { padding-bottom: 1.5rem; padding-top: 0.5rem; }
        .timeline-label { font-weight: 600; color: var(--navy); font-size: 0.95rem; }
        .timeline-step.current .timeline-label { color: var(--gold); }
        .timeline-desc { color: var(--gray-600); font-size: 0.83rem; margin-top: 0.2rem; }
        .detail-grid { display: flex; flex-direction: column; gap: 0.6rem; }
        .detail-item { display: flex; justify-content: space-between; align-items: flex-start; padding-bottom: 0.6rem; border-bottom: 1px solid var(--gray-100); gap: 1rem; }
        .detail-item:last-child { border-bottom: none; padding-bottom: 0; }
        .detail-label { font-size: 0.78rem; color: var(--gray-400); font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; flex-shrink: 0; }
        .detail-value { font-weight: 500; color: var(--navy); font-size: 0.88rem; text-align: right; }
        @media (max-width: 700px) {
          div[style*="grid-template-columns: 1fr 1fr"] { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
};

export default ProposalDetail;
