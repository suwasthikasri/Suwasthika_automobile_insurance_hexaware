import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getProposalsByUser, getDocumentsByUser, getClaimsByUser, getUserById } from '../../api/services';

const statusColors = {
  GENERATED: 'badge-generated', SENT: 'badge-sent', DOWNLOADED: 'badge-downloaded',
  PROPOSAL_SUBMITTED: 'badge-initiated', QUOTE_GENERATED: 'badge-generated',
  ACTIVE: 'badge-approved', EXPIRED: 'badge-expired', REJECTED: 'badge-rejected',
};

const UserDashboard = () => {
  const { user } = useAuth();
  const [proposals, setProposals] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [claims, setClaims] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('proposals');

    
  const [debugErrors, setDebugErrors] = useState([]);

  useEffect(() => {
    if (!user?.userId) { setLoading(false); return; }

    const loadProposals = getProposalsByUser(user.userId)
      .then(r => r.data || [])
      .catch(err => {
        const msg = 'Proposals: ' + (err.response?.data?.message || err.message);
        setDebugErrors(prev => [...prev, msg]);
        return [];
      });

    const loadDocuments = getDocumentsByUser(user.userId)
      .then(r => r.data || [])
      .catch(err => {
        const msg = 'Documents: ' + (err.response?.data?.message || err.message);
        setDebugErrors(prev => [...prev, msg]);
        return [];
      });

    const loadClaims = getClaimsByUser(user.userId)
      .then(r => r.data || [])
      .catch(err => {
        const msg = 'Claims: ' + (err.response?.data?.message || err.message);
        setDebugErrors(prev => [...prev, msg]);
        return [];
      });

    const loadProfile = getUserById(user.userId)
      .then(r => r.data || null)
      .catch(err => {
        const msg = 'Profile: ' + (err.response?.data?.message || err.message);
        setDebugErrors(prev => [...prev, msg]);
        return null;
      });

    Promise.all([loadProposals, loadDocuments, loadClaims, loadProfile])
      .then(([p, d, c, u]) => {
        setProposals(p);
        setDocuments(d);
        setClaims(c);
        setProfile(u);
      })
      .finally(() => setLoading(false));
  }, [user]);

  if (loading) return <div className="loading-screen"><div className="spinner" /></div>;

  const activeProposals = proposals.filter(p => p.status === 'ACTIVE' || p.status === 'SENT').length;
  const pendingProposals = proposals.filter(p => p.status === 'GENERATED').length;

  return (
    <div className="page-container">
      
      <div className="dashboard-hero">
        <div>
          <div className="page-title">Welcome back, {profile?.fullName?.split(' ')[0] || 'User'} 👋</div>
          <div className="page-subtitle">Manage your vehicle insurance policies and claims</div>
        </div>
        <Link to="/proposals/new" className="btn btn-primary">+ New Proposal</Link>
      </div>

     
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon gold">📋</div>
          <div><div className="stat-value">{proposals.length}</div><div className="stat-label">Total Proposals</div></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon teal">✅</div>
          <div><div className="stat-value">{activeProposals}</div><div className="stat-label">Active Policies</div></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon navy">⏳</div>
          <div><div className="stat-value">{pendingProposals}</div><div className="stat-label">Pending Review</div></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green">🗂️</div>
          <div><div className="stat-value">{claims.length}</div><div className="stat-label">Claims Filed</div></div>
        </div>
      </div>

      
      <div className="card">
        <div className="tabs" style={{padding:'0 2rem', paddingTop:'0.5rem'}}>
          {[['proposals','📋 Proposals'], ['documents','📄 Documents'], ['claims','🗂️ Claims'], ['profile','👤 Profile']].map(([key, label]) => (
            <button key={key} className={`tab-btn ${activeTab === key ? 'active' : ''}`} onClick={() => setActiveTab(key)}>{label}</button>
          ))}
        </div>

        <div className="card-body" style={{paddingTop:'0'}}>
          
          {activeTab === 'proposals' && (
            proposals.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">📋</div>
                <div className="empty-state-title">No proposals yet</div>
                <p style={{color:'var(--gray-400)', marginBottom:'1.5rem'}}>Submit your first vehicle insurance proposal to get started</p>
                <Link to="/proposals/new" className="btn btn-primary">Submit Proposal</Link>
              </div>
            ) : (
              <div className="table-wrapper">
                <table>
                  <thead><tr><th>Proposal ID</th><th>Vehicle</th><th>Policy</th><th>Quote</th><th>Status</th><th>Action</th></tr></thead>
                  <tbody>
                    {proposals.map(p => (
                      <tr key={p.proposalId}>
                        <td><span style={{fontFamily:'monospace', fontSize:'0.8rem', color:'var(--navy-mid)'}}>{p.proposalUniqueId || `#${p.proposalId}`}</span></td>
                        <td><strong>{p.vehicleMake} {p.vehicleModel}</strong><br/><span style={{fontSize:'0.78rem', color:'var(--gray-600)'}}>{p.registrationNumber}</span></td>
                        <td>{p.policy?.policyName || '—'}</td>
                        <td>{p.quoteAmount ? `₹${p.quoteAmount.toLocaleString()}` : '—'}</td>
                        <td><span className={`badge ${statusColors[p.status] || 'badge-initiated'}`}>{p.status?.replace('_', ' ')}</span></td>
                        <td>
                          <div style={{display:'flex', gap:'0.5rem', flexWrap:'wrap'}}>
                            <Link to={`/proposals/${p.proposalId}`} className="btn btn-sm btn-navy">View</Link>
                            {p.quoteAmount && p.status === 'SENT' && (
                              <Link to={`/proposals/${p.proposalId}/pay`} className="btn btn-sm btn-primary">Pay Now</Link>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          )}

          
          {activeTab === 'documents' && (
            documents.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">📄</div>
                <div className="empty-state-title">No documents yet</div>
                <p style={{color:'var(--gray-400)'}}>Your policy documents will appear here once your policy is active</p>
              </div>
            ) : (
              <div className="table-wrapper">
                <table>
                  <thead><tr><th>Document ID</th><th>Type</th><th>Proposal</th><th>Status</th><th>Created</th></tr></thead>
                  <tbody>
                    {documents.map(d => (
                      <tr key={d.documentId}>
                        <td style={{fontFamily:'monospace', fontSize:'0.8rem'}}>{d.documentUniqueId}</td>
                        <td><span className="badge badge-initiated">{d.documentType?.replace('_', ' ')}</span></td>
                        <td>#{d.proposal?.proposalId}</td>
                        <td><span className={`badge ${statusColors[d.status] || ''}`}>{d.status}</span></td>
                        <td>{d.createdAt ? new Date(d.createdAt).toLocaleDateString('en-IN') : '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          )}

          
          {activeTab === 'claims' && (
            <div>
              <div style={{display:'flex', justifyContent:'flex-end', marginBottom:'1rem'}}>
                <Link to="/my-claims/new" className="btn btn-teal btn-sm">+ File Claim</Link>
              </div>
              {claims.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-state-icon">🗂️</div>
                  <div className="empty-state-title">No claims filed</div>
                </div>
              ) : (
                <div className="table-wrapper">
                  <table>
                    <thead><tr><th>Claim Ref</th><th>Reason</th><th>Amount</th><th>Status</th><th>Filed On</th></tr></thead>
                    <tbody>
                      {claims.map(c => (
                        <tr key={c.claimId}>
                          <td style={{fontFamily:'monospace', fontSize:'0.8rem'}}>{c.claimReference}</td>
                          <td>{c.claimReason}</td>
                          <td>₹{Number(c.claimAmount).toLocaleString()}</td>
                          <td><span className={`badge badge-${c.claimStatus?.toLowerCase()}`}>{c.claimStatus?.replace('_', ' ')}</span></td>
                          <td>{c.createdAt ? new Date(c.createdAt).toLocaleDateString('en-IN') : '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          
          {activeTab === 'profile' && profile && (
            <div style={{maxWidth:'600px'}}>
              <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1.5rem'}}>
                {[
                  ['Full Name', profile.fullName],
                  ['Username', profile.username],
                  ['Email', profile.email],
                  ['Phone', profile.phoneNumber],
                  ['Date of Birth', profile.dateOfBirth],
                  ['Aadhaar', profile.aadhaarNumber ? `****${profile.aadhaarNumber.slice(-4)}` : '—'],
                  ['PAN', profile.panNumber],
                  ['Role', profile.role],
                ].map(([label, value]) => (
                  <div key={label} style={{borderBottom:'1px solid var(--gray-100)', paddingBottom:'0.75rem'}}>
                    <div style={{fontSize:'0.75rem', color:'var(--gray-400)', textTransform:'uppercase', letterSpacing:'0.06em', fontWeight:700}}>{label}</div>
                    <div style={{fontWeight:500, color:'var(--navy)', marginTop:'0.2rem'}}>{value || '—'}</div>
                  </div>
                ))}
              </div>
              <div style={{gridColumn:'1/-1', marginTop:'0.75rem', paddingBottom:'0.75rem', borderBottom:'1px solid var(--gray-100)'}}>
                <div style={{fontSize:'0.75rem', color:'var(--gray-400)', textTransform:'uppercase', letterSpacing:'0.06em', fontWeight:700}}>Address</div>
                <div style={{fontWeight:500, color:'var(--navy)', marginTop:'0.2rem'}}>{profile.address || '—'}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
