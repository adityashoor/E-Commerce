import { useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function InsulatedMaintenance() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <section style={{padding:'56px 0'}}>
      <div className="container">
        <div className="fz-card fz-grid-bg" style={{padding:'28px 24px', borderRadius:14}}>
          <div className="fz-neon" style={{fontSize:14, letterSpacing:1.2}}>INSULATED TOOLS</div>
          <h1 style={{margin:'6px 0 4px'}}>Maintenance & Safe Use</h1>
          <p style={{color:'var(--fz-muted)', maxWidth:860}}>Keep your VDE/insulated tools compliant and dependable. Follow these best practices for inspection, cleaning, storage, and field use.</p>

          <div className="row" style={{marginTop:16}}>
            <div className="col-md-6" style={{marginTop:12}}>
              <div className="fz-card" style={{padding:16}}>
                <h4>Inspection Checklist</h4>
                <ul style={{marginBottom:0}}>
                  <li>Check for cuts, nicks, abrasions, swelling, or discoloration on insulation.</li>
                  <li>Verify markings: voltage rating (e.g. 1000V), standard (IEC/EN 60900), and date codes.</li>
                  <li>Ensure no exposed metal beyond design at handles/collars.</li>
                  <li>Confirm mechanical integrity: jaws, tips, fasteners, and torque features.</li>
                </ul>
              </div>
            </div>
            <div className="col-md-6" style={{marginTop:12}}>
              <div className="fz-card" style={{padding:16}}>
                <h4>Cleaning & Care</h4>
                <ul style={{marginBottom:0}}>
                  <li>Wipe with mild detergent and water; avoid solvents or abrasive pads.</li>
                  <li>Dry completely before use; moisture can reduce insulation effectiveness.</li>
                  <li>Store away from UV/ozone sources; avoid compression or sharp bends.</li>
                  <li>Remove from service if contamination, damage, or doubt exists.</li>
                </ul>
              </div>
            </div>
            <div className="col-md-6" style={{marginTop:12}}>
              <div className="fz-card" style={{padding:16}}>
                <h4>Use Guidelines</h4>
                <ul style={{marginBottom:0}}>
                  <li>Verify the tool’s voltage rating vs. the work environment.</li>
                  <li>Use appropriate PPE: gloves, arc-rated apparel, face protection.</li>
                  <li>Keep tools clean and dry; never alter insulation.</li>
                  <li>Follow lockout/tagout and live-working procedures per site policy.</li>
                </ul>
              </div>
            </div>
            <div className="col-md-6" style={{marginTop:12}}>
              <div className="fz-card" style={{padding:16}}>
                <h4>Re-Testing & Retirement</h4>
                <ul style={{marginBottom:0}}>
                  <li>Implement periodic dielectric testing based on policy/standards.</li>
                  <li>Retire tools on failed test, physical damage, or expired service life.</li>
                  <li>Maintain asset logs: serials, dates, test results, and owners.</li>
                </ul>
              </div>
            </div>
          </div>

          <div style={{display:'flex', gap:12, marginTop:20, flexWrap:'wrap'}}>
            <Link to="/showcategory" className="btn btn-primary">Shop Insulated Tools</Link>
            <Link to="/contact" className="btn" style={{background:'transparent', border:'1px solid var(--fz-border)', color:'var(--fz-text)'}}>Book Re-Testing</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
