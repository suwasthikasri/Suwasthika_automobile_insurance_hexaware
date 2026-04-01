import React, { useState, useEffect } from 'react';
import { getAllPolicies, addPolicy, activatePolicy, deactivatePolicy } from '../../api/services';

const OfficerPolicies = () => {
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');
  const [form, setForm] = useState({ policyName: '', vehicleCategory: 'CAR', description: '', basePremium: '', coverageDetails: '', addOns: '' });
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const load = () => getAllPolicies().then(r => setPolicies(r.data || [])).catch(() => {}).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const showMsg = (m, isError) => { if (isError) setError(m); else setMsg(m); setTimeout(() => { setMsg(''); setError(''); }, 3000); };

  const validate = () => {
    const e = {};
    if (!form.policyName.trim()) e.policyName = 'Policy name required';
    if (!form.description.trim()) e.description = 'Description required';
    if (!form.basePremium || form.basePremium <= 0) e.basePremium = 'Enter valid premium';
    if (!form.coverageDetails.trim()) e.coverageDetails = 'Coverage details required';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setFormErrors(errs); return; }
    setSubmitting(true);
    try {
      await addPolicy({ ...form, basePremium: parseFloat(form.basePremium), isActive: true });
      showMsg('Policy added successfully!');
      setShowModal(false);
      setForm({ policyName: '', vehicleCategory: 'CAR', description: '', basePremium: '', coverageDetails: '', addOns: '' });
      load();
    } catch (err) {
      showMsg(err.response?.data?.message || 'Failed to add policy', true);
    } finally { setSubmitting(false); }
  };

  return (
    <div className="page-container">
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'2rem', flexWrap:'wrap', gap:'1rem'}}>
        <div>
          <div className="page-title">Insurance Policies</div>
          <div className="page-subtitle">Manage available vehicle insurance plans</div>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ Add Policy</button>
      </div>

      {msg && <div className="alert alert-success">✓ {msg}</div>}
      {error && <div className="alert alert-error">⚠️ {error}</div>}

      {loading ? <div style={{textAlign:'center', padding:'3rem'}}><div className="spinner" style={{margin:'0 auto'}}/></div> : (
        <div className="policies-manage-grid">
          {policies.map(p => (
            <div className="manage-policy-card" key={p.policyId}>
              <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'1rem'}}>
                <div>
                  <div style={{fontFamily:'var(--font-display)', fontSize:'1.1rem', fontWeight:700, color:'var(--navy)'}}>{p.policyName}</div>
                  <span className={`badge badge-initiated`} style={{marginTop:'0.3rem', display:'inline-flex'}}>{p.vehicleCategory?.replace('_', ' ')}</span>
                </div>
                <span className={`badge ${p.isActive ? 'badge-approved' : 'badge-rejected'}`}>{p.isActive ? 'Active' : 'Inactive'}</span>
              </div>
              <p style={{fontSize:'0.85rem', color:'var(--gray-600)', marginBottom:'0.75rem', lineHeight:1.6}}>{p.description}</p>
              <div style={{background:'var(--gray-100)', borderRadius:'var(--radius)', padding:'0.75rem', marginBottom:'0.75rem', display:'flex', justifyContent:'space-between'}}>
                <span style={{fontSize:'0.75rem', color:'var(--gray-600)', fontWeight:600}}>BASE PREMIUM</span>
                <span style={{fontFamily:'var(--font-display)', fontWeight:700, color:'var(--navy)'}}>₹{p.basePremium?.toLocaleString()}/yr</span>
              </div>
              <div style={{fontSize:'0.82rem', color:'var(--gray-600)', marginBottom:'0.5rem'}}><strong>Coverage:</strong> {p.coverageDetails}</div>
              {p.addOns && <div style={{fontSize:'0.82rem', color:'var(--teal-dark)'}}><strong>Add-ons:</strong> {p.addOns}</div>}
              <div style={{display:'flex', gap:'0.5rem', marginTop:'1rem'}}>
                {p.isActive
                  ? <button className="btn btn-sm btn-danger" onClick={async () => { await deactivatePolicy(p.policyId); showMsg('Policy deactivated'); load(); }}>Deactivate</button>
                  : <button className="btn btn-sm btn-teal" onClick={async () => { await activatePolicy(p.policyId); showMsg('Policy activated'); load(); }}>Activate</button>
                }
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">Add New Insurance Policy</div>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmit} noValidate>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Policy Name *</label>
                    <input className={`form-control ${formErrors.policyName ? 'error' : ''}`} value={form.policyName} onChange={e => setForm(f => ({ ...f, policyName: e.target.value }))} placeholder="e.g. Comprehensive Car Plan" />
                    {formErrors.policyName && <div className="error-msg">⚠ {formErrors.policyName}</div>}
                  </div>
                  <div className="form-group">
                    <label className="form-label">Vehicle Category *</label>
                    <select className="form-control" value={form.vehicleCategory} onChange={e => setForm(f => ({ ...f, vehicleCategory: e.target.value }))}>
                      {['CAR', 'BIKE', 'TRUCK', 'CAMPER_VAN'].map(c => <option key={c} value={c}>{c.replace('_', ' ')}</option>)}
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Base Premium (₹/yr) *</label>
                  <input className={`form-control ${formErrors.basePremium ? 'error' : ''}`} type="number" value={form.basePremium} onChange={e => setForm(f => ({ ...f, basePremium: e.target.value }))} placeholder="e.g. 8000" />
                  {formErrors.basePremium && <div className="error-msg">⚠ {formErrors.basePremium}</div>}
                </div>
                <div className="form-group">
                  <label className="form-label">Description *</label>
                  <textarea className={`form-control ${formErrors.description ? 'error' : ''}`} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={2} placeholder="Brief description..." />
                  {formErrors.description && <div className="error-msg">⚠ {formErrors.description}</div>}
                </div>
                <div className="form-group">
                  <label className="form-label">Coverage Details *</label>
                  <textarea className={`form-control ${formErrors.coverageDetails ? 'error' : ''}`} value={form.coverageDetails} onChange={e => setForm(f => ({ ...f, coverageDetails: e.target.value }))} rows={2} placeholder="e.g. Third-party liability, Own damage, Fire & theft..." />
                  {formErrors.coverageDetails && <div className="error-msg">⚠ {formErrors.coverageDetails}</div>}
                </div>
                <div className="form-group">
                  <label className="form-label">Add-ons (comma separated)</label>
                  <input className="form-control" value={form.addOns} onChange={e => setForm(f => ({ ...f, addOns: e.target.value }))} placeholder="e.g. Zero Depreciation, Engine Protection, Roadside Assistance" />
                </div>
                <div className="modal-footer" style={{padding:'0', justifyContent:'flex-end', display:'flex', gap:'0.75rem'}}>
                  <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary" disabled={submitting}>{submitting ? 'Adding...' : 'Add Policy'}</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .policies-manage-grid { display:grid; grid-template-columns:repeat(auto-fill, minmax(320px, 1fr)); gap:1.5rem; }
        .manage-policy-card { background:var(--white); border-radius:var(--radius-lg); border:1.5px solid var(--gray-200); padding:1.75rem; transition:var(--transition); }
        .manage-policy-card:hover { border-color:var(--gold); box-shadow:var(--shadow-md); }
      `}</style>
    </div>
  );
};

export default OfficerPolicies;
