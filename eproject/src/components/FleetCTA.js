import { Link } from 'react-router-dom';

export default function FleetCTA() {
  return (
    <section style={{padding:'56px 0'}}>
      <div className="container">
        <div className="fz-card fz-grid-bg" style={{padding:'28px 24px', display:'flex', alignItems:'center', justifyContent:'space-between', gap:16}}>
          <div>
            <div className="fz-neon" style={{fontSize:14, letterSpacing:1.2}}>FLEETZERO AI</div>
            <h2 style={{margin:'6px 0 8px'}}>Faster, smarter, greener commerce</h2>
            <p style={{color:'var(--fz-muted)', maxWidth:640}}>Explore products and experiences powered by a sleek, high-contrast design and subtle AI motion. Built for speed and clarity.</p>
          </div>
          <div style={{display:'flex', gap:12}}>
            <Link to="/showcategory" className="btn btn-primary">Explore Products</Link>
            <a href="#contact" className="btn" style={{background:'transparent', border:'1px solid var(--fz-border)', color:'var(--fz-text)'}}>Contact Us</a>
          </div>
        </div>
      </div>
    </section>
  );
}
