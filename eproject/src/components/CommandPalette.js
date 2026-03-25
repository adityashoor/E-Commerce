import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const routes = [
  { label: 'Home', path: '/homepage' },
  { label: 'Categories', path: '/showcategory' },
  { label: 'Insulated Tools Maintenance', path: '/insulated-tools-maintenance' },
  { label: 'Cart', path: '/cart' },
  { label: 'Contact', path: '/contact' },
  { label: 'Login', path: '/login' },
  { label: 'Signup', path: '/signup' },
  { label: 'Track Orders', path: '/trackorders' },
  { label: 'Weather', path: '/weather' },
];

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const onKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((v) => !v);
      }
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    if (open && inputRef.current) {
      // Slight delay to ensure focus after mount
      setTimeout(() => inputRef.current && inputRef.current.focus(), 50);
    } else {
      setQ('');
    }
  }, [open]);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return routes;
    return routes.filter(r => r.label.toLowerCase().includes(s));
  }, [q]);

  const go = (path) => {
    setOpen(false);
    navigate(path);
  };

  if (!open) return null;

  return (
    <div style={{position:'fixed', inset:0, background:'rgba(0,0,0,0.55)', backdropFilter:'blur(4px)', zIndex:2000}} onClick={() => setOpen(false)}>
      <div className="fz-card fz-grid-bg" style={{maxWidth:720, margin:'10vh auto 0', padding:16, borderRadius:12}} onClick={(e)=>e.stopPropagation()}>
        <div style={{display:'flex', alignItems:'center', gap:8, border:'1px solid var(--fz-border)', borderRadius:10, padding:'10px 12px', background:'var(--fz-surface)'}}>
          <span className="fz-neon" style={{fontWeight:700}}>⌘K</span>
          <input ref={inputRef} value={q} onChange={(e)=>setQ(e.target.value)} placeholder="Search pages…" style={{flex:1, background:'transparent', border:'none', outline:'none', color:'var(--fz-text)'}}/>
        </div>
        <div style={{marginTop:8, maxHeight:300, overflow:'auto'}}>
          {filtered.length === 0 && (
            <div style={{padding:12, color:'var(--fz-muted)'}}>No matches</div>
          )}
          {filtered.map((r) => (
            <div key={r.path} onClick={() => go(r.path)}
                 style={{padding:'10px 12px', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'space-between', borderBottom:'1px solid var(--fz-border)'}}
                 onMouseDown={(e)=> e.preventDefault()}>
              <div>
                <div style={{color:'var(--fz-text)'}}>{r.label}</div>
                <div style={{color:'var(--fz-muted)', fontSize:12}}>{r.path}</div>
              </div>
              <span className="fz-neon">↵</span>
            </div>
          ))}
        </div>
        <div style={{display:'flex', justifyContent:'space-between', color:'var(--fz-muted)', fontSize:12, marginTop:8}}>
          <div>Press Esc to close</div>
          <div>Ctrl+K to toggle</div>
        </div>
      </div>
    </div>
  );
}
