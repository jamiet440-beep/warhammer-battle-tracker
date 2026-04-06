import { useState } from 'react';
import type { UnitProfile } from '../utils/battlescribeParser';

interface Props {
  unit: UnitProfile;
}

export function UnitCard({ unit }: Props) {
  const [moved, setMoved] = useState(false);
  const [shot, setShot] = useState(false);
  const [charged, setCharged] = useState(false);

  // Group stats cleanly. Order: M, T, SV, W, LD, OC
  const mainStatsOrder = ['M', 'T', 'SV', 'W', 'LD', 'OC'];
  
  const renderStatBox = (name: string, value: string) => (
    <div key={name} style={{ textAlign: 'center', background: 'var(--bg-dark)', padding: '8px', borderRadius: '4px', border: '1px solid var(--border-color)' }}>
      <div style={{ color: 'var(--primary-gold)', fontSize: '12px', fontWeight: 'bold' }}>{name}</div>
      <div style={{ fontSize: '18px', fontWeight: 'bold' }}>{value}</div>
    </div>
  );

  return (
    <div className="card" style={{ marginBottom: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h3 style={{ margin: 0, fontSize: '20px' }}>{unit.name}</h3>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '8px', marginBottom: '16px' }}>
        {mainStatsOrder.map(statName => {
          const stat = unit.stats.find(s => s.name === statName);
          return renderStatBox(statName, stat ? stat.value : '-');
        })}
      </div>

      {/* Action Trackers */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '16px', background: 'var(--bg-dark)', padding: '12px', borderRadius: '4px' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
          <input type="checkbox" checked={moved} onChange={e => setMoved(e.target.checked)} />
          <span style={{ color: moved ? 'var(--text-muted)' : 'var(--text-main)' }}>Moved</span>
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
          <input type="checkbox" checked={shot} onChange={e => setShot(e.target.checked)} />
          <span style={{ color: shot ? 'var(--text-muted)' : 'var(--text-main)' }}>Shot</span>
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
          <input type="checkbox" checked={charged} onChange={e => setCharged(e.target.checked)} />
          <span style={{ color: charged ? 'var(--text-muted)' : 'var(--text-main)' }}>Charged</span>
        </label>
      </div>

      {unit.weapons && unit.weapons.length > 0 && (
        <div>
          <h4 style={{ marginBottom: '8px', color: 'var(--primary-red)' }}>Weapons</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {unit.weapons.map((w, idx) => (
              <div key={idx} style={{ background: 'var(--bg-dark)', padding: '8px', borderRadius: '4px', borderLeft: w.type === 'Melee' ? '3px solid var(--primary-red)' : '3px solid var(--primary-gold)' }}>
                <div style={{ fontWeight: 'bold', fontSize: '14px', marginBottom: '4px' }}>{w.name} <span style={{fontSize:'10px', color:'var(--text-muted)'}}>({w.type})</span></div>
                <div style={{ display: 'flex', gap: '12px', fontSize: '12px' }}>
                  {w.stats.map(s => (
                    <span key={s.name}><strong>{s.name}:</strong> {s.value}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
