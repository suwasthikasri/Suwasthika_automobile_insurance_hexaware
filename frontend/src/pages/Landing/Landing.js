import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllPolicies } from '../../api/services';
import '../../styles/landing.css';

const reviews = [
  { name: 'Rajesh Kumar', rating: 5, text: 'Seamless process from proposal to policy activation. Highly recommend AutoShield!', vehicle: 'Car Owner' },
  { name: 'Priya Sharma', rating: 5, text: 'Got my bike insured within 24 hours. The officer was very responsive and professional.', vehicle: 'Bike Owner' },
  { name: 'Anand Venkat', rating: 4, text: 'Great coverage options for my camper van. The premium calculation was transparent.', vehicle: 'Camper Van Owner' },
  { name: 'Meena Iyer', rating: 5, text: 'Claim was processed quickly. Got my payment within 3 working days. Excellent service!', vehicle: 'Truck Owner' },
];

const Landing = () => {
  const [policies, setPolicies] = useState([]);
  const [stats] = useState({ activePolicies: 12480, claimsServed: 8340, customers: 15200, satisfaction: 98 });
  const [filter, setFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllPolicies()
      .then(r => setPolicies(r.data || []))
      .catch(() => setPolicies([]))
      .finally(() => setLoading(false));
  }, []);

  const categories = ['ALL', 'CAR', 'BIKE', 'TRUCK', 'CAMPER_VAN'];
  const filtered = filter === 'ALL' ? policies : policies.filter(p => p.vehicleCategory === filter);

  const categoryIcon = (cat) => ({ CAR: '🚗', BIKE: '🏍️', TRUCK: '🚛', CAMPER_VAN: '🚐' }[cat] || '🚗');

  return (
    <div className="landing">
      
      <section className="hero">
        <div className="hero-bg">
          <div className="hero-overlay" />
          <div className="hero-shapes">
            <div className="shape shape-1" />
            <div className="shape shape-2" />
            <div className="shape shape-3" />
          </div>
        </div>
        <div className="hero-content">
          <div className="hero-badge">🏆 India's Most Trusted Vehicle Insurance</div>
          <h1 className="hero-title">
            Drive with <span className="hero-gold">Confidence</span>,<br />
            Protected at Every Mile
          </h1>
          <p className="hero-subtitle">
            Comprehensive vehicle insurance for cars, bikes, trucks, and camper vans.
            Fast claims. Transparent pricing. Expert support.
          </p>
          <div className="hero-actions">
            <Link to="/register" className="btn btn-primary btn-lg">Get Insured Today</Link>
            <Link to="/login" className="btn btn-outline-white btn-lg">View My Policy</Link>
          </div>
          <div className="hero-trust">
            <span>✓ No hidden charges</span>
            <span>✓ 24/7 claim support</span>
            <span>✓ Instant policy document</span>
          </div>
        </div>
        <div className="hero-image-side">
          <div className="hero-card-float">
            <div className="float-icon">🚗</div>
            <div>
              <div className="float-title">Policy Active</div>
              <div className="float-sub">TN47AB1234 · Premium Paid</div>
            </div>
            <div className="float-badge">✓</div>
          </div>
          <div className="hero-stat-float">
            <span className="float-num">98%</span>
            <span className="float-label">Claim Settlement Rate</span>
          </div>
        </div>
      </section>

      
      <section className="stats-section">
        <div className="stats-inner">
          {[
            { icon: '📋', value: stats.activePolicies.toLocaleString(), label: 'Active Policies' },
            { icon: '✅', value: stats.claimsServed.toLocaleString(), label: 'Claims Served' },
            { icon: '👥', value: stats.customers.toLocaleString(), label: 'Happy Customers' },
            { icon: '⭐', value: `${stats.satisfaction}%`, label: 'Satisfaction Rate' },
          ].map((s, i) => (
            <div className="landing-stat" key={i}>
              <div className="landing-stat-icon">{s.icon}</div>
              <div className="landing-stat-value">{s.value}</div>
              <div className="landing-stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      
      <section className="about-section">
        <div className="page-container">
          <div className="about-grid">
            <div className="about-text">
              <div className="section-tag">About AutoShield</div>
              <h2 className="section-title">Protecting What Matters Most Since 2010</h2>
              <p>AutoShield Insurance has been at the forefront of vehicle insurance innovation in India. We combine technology with human expertise to deliver insurance that truly protects you.</p>
              <p style={{marginTop:'1rem'}}>Our dedicated team of insurance officers reviews every proposal with care, ensuring you get the right coverage at the right premium.</p>
              <div className="about-features">
                {['Instant online proposals', 'Quote in 24 hours', 'Cashless claims', 'Dedicated support officer'].map(f => (
                  <div className="about-feature" key={f}><span className="feature-check">✓</span>{f}</div>
                ))}
              </div>
            </div>
            <div className="about-visual">
              <div className="about-card-stack">
                <div className="about-card ac-1">🛡️ Comprehensive Cover</div>
                <div className="about-card ac-2">⚡ Quick Claims</div>
                <div className="about-card ac-3">📱 Digital First</div>
              </div>
            </div>
          </div>
        </div>
      </section>

     
      <section className="policies-section">
        <div className="page-container">
          <div className="section-header">
            <div className="section-tag">Our Plans</div>
            <h2 className="section-title">Vehicle Insurance Policies</h2>
            <p className="section-sub">Choose the perfect coverage plan for your vehicle</p>
          </div>

          <div className="category-filters">
            {categories.map(c => (
              <button key={c} className={`cat-btn ${filter === c ? 'active' : ''}`} onClick={() => setFilter(c)}>
                {c === 'ALL' ? '🔍 All' : `${categoryIcon(c)} ${c.replace('_', ' ')}`}
              </button>
            ))}
          </div>

          {loading ? (
            <div style={{textAlign:'center', padding:'3rem'}}><div className="spinner" style={{margin:'0 auto', borderTopColor: 'var(--gold)'}}/></div>
          ) : filtered.length === 0 ? (
            <div className="empty-state"><div className="empty-state-icon">📋</div><div className="empty-state-title">No policies available</div></div>
          ) : (
            <div className="policies-grid">
              {filtered.map(policy => (
                <div className="policy-card" key={policy.policyId}>
                  <div className="policy-card-top">
                    <div className="policy-icon">{categoryIcon(policy.vehicleCategory)}</div>
                    <span className={`badge badge-${policy.isActive ? 'approved' : 'rejected'}`}>
                      {policy.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <h3 className="policy-name">{policy.policyName}</h3>
                  <p className="policy-desc">{policy.description}</p>
                  <div className="policy-premium">
                    <span className="premium-label">Base Premium</span>
                    <span className="premium-value">₹{policy.basePremium?.toLocaleString()}/yr</span>
                  </div>
                  <div className="policy-coverage">
                    <div className="coverage-title">Coverage</div>
                    <div className="coverage-text">{policy.coverageDetails}</div>
                  </div>
                  {policy.addOns && (
                    <div className="policy-addons">
                      <span className="addons-label">Add-ons:</span> {policy.addOns}
                    </div>
                  )}
                  <Link to="/register" className="btn btn-primary btn-full" style={{marginTop:'1.25rem'}}>
                    Apply Now →
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      
      <section className="how-section">
        <div className="page-container">
          <div className="section-header">
            <div className="section-tag">Process</div>
            <h2 className="section-title">How It Works</h2>
          </div>
          <div className="steps-grid">
            {[
              { step: '01', icon: '📝', title: 'Submit Proposal', desc: 'Register and fill in your vehicle details to submit an insurance proposal.' },
              { step: '02', icon: '🔍', title: 'Officer Review', desc: 'Our insurance officer reviews your proposal and generates a personalized quote.' },
              { step: '03', icon: '💳', title: 'Make Payment', desc: 'Pay your premium securely via UPI, card, or net banking.' },
              { step: '04', icon: '🛡️', title: 'Policy Active', desc: 'Your policy is activated instantly. Download your certificate anytime.' },
            ].map((s, i) => (
              <div className="step-card" key={i}>
                <div className="step-number">{s.step}</div>
                <div className="step-icon">{s.icon}</div>
                <h3 className="step-title">{s.title}</h3>
                <p className="step-desc">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      
      <section className="reviews-section">
        <div className="page-container">
          <div className="section-header">
            <div className="section-tag">Testimonials</div>
            <h2 className="section-title">What Our Customers Say</h2>
          </div>
          <div className="reviews-grid">
            {reviews.map((r, i) => (
              <div className="review-card" key={i}>
                <div className="review-stars">{'⭐'.repeat(r.rating)}</div>
                <p className="review-text">"{r.text}"</p>
                <div className="review-author">
                  <div className="review-avatar">{r.name[0]}</div>
                  <div>
                    <div className="review-name">{r.name}</div>
                    <div className="review-vehicle">{r.vehicle}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      
      <section className="cta-section">
        <div className="cta-inner">
          <h2 className="cta-title">Ready to Protect Your Vehicle?</h2>
          <p className="cta-sub">Join over 15,000 satisfied customers. Get insured in minutes.</p>
          <div style={{display:'flex', gap:'1rem', justifyContent:'center', flexWrap:'wrap'}}>
            <Link to="/register" className="btn btn-primary btn-lg">Start Your Proposal</Link>
            <Link to="/login" className="btn btn-outline-white btn-lg">Login to Dashboard</Link>
          </div>
        </div>
      </section>

      
      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-brand">
            <span>🛡️ AutoShield Insurance</span>
            <p>Comprehensive vehicle insurance solutions for every Indian road.</p>
          </div>
          <div className="footer-links">
            <div className="footer-col">
              <div className="footer-col-title">Products</div>
              <a href="#">Car Insurance</a>
              <a href="#">Bike Insurance</a>
              <a href="#">Truck Insurance</a>
              <a href="#">Camper Van Insurance</a>
            </div>
            <div className="footer-col">
              <div className="footer-col-title">Company</div>
              <a href="#">About Us</a>
              <a href="#">Careers</a>
              <a href="#">Press</a>
              <a href="#">Contact</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2025 AutoShield Insurance. All rights reserved.</span>
          <span>IRDAI Reg. No. 1234 · CIN: U66010MH2010PLC123456</span>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
