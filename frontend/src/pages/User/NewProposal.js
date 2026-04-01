import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllPolicies, createProposal } from '../../api/services';
import { useAuth } from '../../context/AuthContext';

const NewProposal = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    policyId: '', vehicleMake: '', vehicleModel: '', vehicleYear: '',
    registrationNumber: '', chassisNumber: '', engineNumber: '',
    vehicleValue: '', selectedAddOns: '',
  });

  useEffect(() => {
    getAllPolicies().then(r => setPolicies(r.data || [])).catch(() => {});
  }, []);

  const validate = () => {
    const e = {};
    if (!form.policyId) e.policyId = 'Please select a policy';
    if (!form.vehicleMake || form.vehicleMake.length < 2) e.vehicleMake = 'Vehicle make is required (min 2 chars)';
    if (!form.vehicleModel || form.vehicleModel.length < 2) e.vehicleModel = 'Vehicle model is required (min 2 chars)';
    if (!form.vehicleYear || form.vehicleYear < 1990 || form.vehicleYear > 2100) e.vehicleYear = 'Enter a valid year (1990–2100)';
    if (!/^[A-Z]{2}[0-9]{2}[A-Z]{2}[0-9]{4}$/.test(form.registrationNumber)) e.registrationNumber = 'Format: TN47AB1234';
    if (!form.chassisNumber || form.chassisNumber.length < 5) e.chassisNumber = 'Chassis number (min 5 chars)';
    if (!form.engineNumber || form.engineNumber.length < 5) e.engineNumber = 'Engine number (min 5 chars)';
    if (!form.vehicleValue || form.vehicleValue <= 0) e.vehicleValue = 'Enter vehicle value';
    return e;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true); setApiError('');
    const payload = {
      user: { userId: user.userId },
      policy: { policyId: parseInt(form.policyId) },
      vehicleMake: form.vehicleMake,
      vehicleModel: form.vehicleModel,
      vehicleYear: parseInt(form.vehicleYear),
      registrationNumber: form.registrationNumber.toUpperCase(),
      chassisNumber: form.chassisNumber,
      engineNumber: form.engineNumber,
      vehicleValue: parseFloat(form.vehicleValue),
      selectedAddOns: form.selectedAddOns,
    };
    try {
      await createProposal(payload);
      navigate('/dashboard', { state: { success: 'Proposal submitted successfully!' } });
    } catch (err) {
      setApiError(err.response?.data?.message || err.response?.data || 'Failed to submit proposal. Please try again.');
    } finally { setLoading(false); }
  };

  const selectedPolicy = policies.find(p => p.policyId === parseInt(form.policyId));
  const addOnList = selectedPolicy?.addOns?.split(',').map(a => a.trim()).filter(Boolean) || [];

  return (
    <div className="page-container" style={{maxWidth:'800px'}}>
      <div className="page-header">
        <div className="page-title">Submit New Proposal</div>
        <div className="page-subtitle">Fill in your vehicle details to get an insurance quote</div>
      </div>

      
      <div className="proposal-steps">
        {['Select Policy', 'Vehicle Details', 'Submit'].map((s, i) => (
          <div key={i} className="proposal-step">
            <div className="pstep-num">{i + 1}</div>
            <div className="pstep-label">{s}</div>
          </div>
        ))}
      </div>

      {apiError && <div className="alert alert-error">⚠️ {apiError}</div>}

      <form onSubmit={handleSubmit} noValidate>
        
        <div className="card" style={{marginBottom:'1.5rem'}}>
          <div className="card-header"><div className="card-title">🛡️ Select Insurance Policy</div></div>
          <div className="card-body">
            <div className="form-group">
              <label className="form-label">Insurance Policy *</label>
              <select className={`form-control ${errors.policyId ? 'error' : ''}`} name="policyId" value={form.policyId} onChange={handleChange}>
                <option value="">-- Choose a policy --</option>
                {policies.map(p => (
                  <option key={p.policyId} value={p.policyId}>
                    {p.policyName} ({p.vehicleCategory}) — ₹{p.basePremium?.toLocaleString()}/yr
                  </option>
                ))}
              </select>
              {errors.policyId && <div className="error-msg">⚠ {errors.policyId}</div>}
            </div>

            {selectedPolicy && (
              <div className="selected-policy-info">
                <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:'1rem'}}>
                  <div>
                    <div style={{fontWeight:700, color:'var(--navy)', marginBottom:'0.3rem'}}>{selectedPolicy.policyName}</div>
                    <div style={{fontSize:'0.85rem', color:'var(--gray-600)'}}>{selectedPolicy.description}</div>
                    <div style={{fontSize:'0.82rem', color:'var(--teal-dark)', marginTop:'0.5rem'}}>📋 {selectedPolicy.coverageDetails}</div>
                  </div>
                  <div style={{textAlign:'right', flexShrink:0}}>
                    <div style={{fontSize:'0.75rem', color:'var(--gray-600)'}}>Base Premium</div>
                    <div style={{fontFamily:'var(--font-display)', fontSize:'1.5rem', color:'var(--navy)', fontWeight:700}}>₹{selectedPolicy.basePremium?.toLocaleString()}</div>
                    <div style={{fontSize:'0.72rem', color:'var(--gray-400)'}}>per year</div>
                  </div>
                </div>
              </div>
            )}

            {addOnList.length > 0 && (
              <div className="form-group" style={{marginTop:'1rem'}}>
                <label className="form-label">Select Add-ons</label>
                <div className="addons-grid">
                  {addOnList.map(addon => (
                    <label key={addon} className={`addon-item ${form.selectedAddOns.includes(addon) ? 'selected' : ''}`}>
                      <input type="checkbox" checked={form.selectedAddOns.includes(addon)}
                        onChange={e => {
                          const current = form.selectedAddOns ? form.selectedAddOns.split(',').filter(Boolean) : [];
                          const updated = e.target.checked ? [...current, addon] : current.filter(a => a !== addon);
                          setForm(f => ({ ...f, selectedAddOns: updated.join(',') }));
                        }} style={{display:'none'}} />
                      <span className="addon-check">{form.selectedAddOns.includes(addon) ? '✓' : '+'}</span>
                      {addon}
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        
        <div className="card" style={{marginBottom:'1.5rem'}}>
          <div className="card-header"><div className="card-title">🚗 Vehicle Information</div></div>
          <div className="card-body">
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Vehicle Make *</label>
                <input className={`form-control ${errors.vehicleMake ? 'error' : ''}`} name="vehicleMake" value={form.vehicleMake} onChange={handleChange} placeholder="e.g. Maruti, Honda" />
                {errors.vehicleMake && <div className="error-msg">⚠ {errors.vehicleMake}</div>}
              </div>
              <div className="form-group">
                <label className="form-label">Vehicle Model *</label>
                <input className={`form-control ${errors.vehicleModel ? 'error' : ''}`} name="vehicleModel" value={form.vehicleModel} onChange={handleChange} placeholder="e.g. Swift, Activa" />
                {errors.vehicleModel && <div className="error-msg">⚠ {errors.vehicleModel}</div>}
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Year of Manufacture *</label>
                <input className={`form-control ${errors.vehicleYear ? 'error' : ''}`} type="number" name="vehicleYear" value={form.vehicleYear} onChange={handleChange} placeholder="e.g. 2020" min={1990} max={2100} />
                {errors.vehicleYear && <div className="error-msg">⚠ {errors.vehicleYear}</div>}
              </div>
              <div className="form-group">
                <label className="form-label">Vehicle Value (₹) *</label>
                <input className={`form-control ${errors.vehicleValue ? 'error' : ''}`} type="number" name="vehicleValue" value={form.vehicleValue} onChange={handleChange} placeholder="e.g. 600000" />
                {errors.vehicleValue && <div className="error-msg">⚠ {errors.vehicleValue}</div>}
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Registration Number *</label>
              <input className={`form-control ${errors.registrationNumber ? 'error' : ''}`} name="registrationNumber" value={form.registrationNumber} onChange={handleChange} placeholder="TN47AB1234" maxLength={10} style={{textTransform:'uppercase'}} />
              {errors.registrationNumber && <div className="error-msg">⚠ {errors.registrationNumber}</div>}
              <div style={{fontSize:'0.76rem', color:'var(--gray-400)', marginTop:'0.2rem'}}>Format: State(2) + District(2) + Series(2) + Number(4) — e.g. TN47AB1234</div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Chassis Number *</label>
                <input className={`form-control ${errors.chassisNumber ? 'error' : ''}`} name="chassisNumber" value={form.chassisNumber} onChange={handleChange} placeholder="Min 5 characters" />
                {errors.chassisNumber && <div className="error-msg">⚠ {errors.chassisNumber}</div>}
              </div>
              <div className="form-group">
                <label className="form-label">Engine Number *</label>
                <input className={`form-control ${errors.engineNumber ? 'error' : ''}`} name="engineNumber" value={form.engineNumber} onChange={handleChange} placeholder="Min 5 characters" />
                {errors.engineNumber && <div className="error-msg">⚠ {errors.engineNumber}</div>}
              </div>
            </div>
          </div>
        </div>

        <div style={{display:'flex', gap:'1rem', justifyContent:'flex-end'}}>
          <button type="button" className="btn btn-outline" onClick={() => navigate('/dashboard')}>Cancel</button>
          <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
            {loading ? 'Submitting...' : '📤 Submit Proposal'}
          </button>
        </div>
      </form>

      <style>{`
        .proposal-steps { display:flex; gap:0; margin-bottom:2rem; background:var(--white); border-radius:var(--radius-lg); padding:1.25rem 2rem; border:1px solid var(--gray-200); justify-content:space-around; }
        .proposal-step { display:flex; flex-direction:column; align-items:center; gap:0.4rem; }
        .pstep-num { width:32px; height:32px; border-radius:50%; background:var(--gold); color:var(--navy); display:flex; align-items:center; justify-content:center; font-weight:700; font-size:0.9rem; }
        .pstep-label { font-size:0.82rem; font-weight:600; color:var(--navy); }
        .selected-policy-info { background:var(--gray-100); border-radius:var(--radius); padding:1.25rem; border-left:4px solid var(--gold); margin-top:0.5rem; }
        .addons-grid { display:flex; flex-wrap:wrap; gap:0.5rem; }
        .addon-item { display:flex; align-items:center; gap:0.4rem; padding:0.4rem 0.9rem; border:2px solid var(--gray-200); border-radius:100px; cursor:pointer; font-size:0.85rem; font-weight:500; color:var(--navy); transition:var(--transition); user-select:none; }
        .addon-item:hover, .addon-item.selected { border-color:var(--gold); background:rgba(201,168,76,0.1); }
        .addon-check { font-weight:700; color:var(--gold); }
      `}</style>
    </div>
  );
};

export default NewProposal;
