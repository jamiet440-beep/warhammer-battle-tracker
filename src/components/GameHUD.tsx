import { useGameStore } from '../store/gameStore';
import { UnitCard } from './UnitCard';

export function GameHUD() {
  const { army, commandPoints, victoryPoints, incrementCP, decrementCP, incrementVP, decrementVP, setArmy } = useGameStore();

  if (!army) return null;

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', background: 'var(--bg-card)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '24px' }}>{army.name}</h2>
          <div style={{ color: 'var(--primary-gold)', fontSize: '14px' }}>{army.faction}</div>
        </div>
        <button className="btn-outline" onClick={() => setArmy(null as any)}>Clear Roster</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
        <div className="card" style={{ textAlign: 'center' }}>
          <h3 style={{ marginBottom: '12px' }}>Command Points</h3>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px' }}>
            <button className="btn-primary" onClick={decrementCP}>-</button>
            <span style={{ fontSize: '24px', fontWeight: 'bold' }}>{commandPoints}</span>
            <button className="btn-primary" onClick={incrementCP}>+</button>
          </div>
        </div>
        
        <div className="card" style={{ textAlign: 'center' }}>
          <h3 style={{ marginBottom: '12px' }}>Victory Points</h3>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px' }}>
            <button className="btn-primary" onClick={decrementVP}>-</button>
            <span style={{ fontSize: '24px', fontWeight: 'bold' }}>{victoryPoints}</span>
            <button className="btn-primary" onClick={incrementVP}>+</button>
          </div>
        </div>
      </div>

      <div>
        <h3 style={{ marginBottom: '16px', color: 'var(--primary-gold)' }}>Units List</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {army.units.map(unit => (
            <UnitCard key={unit.id} unit={unit} />
          ))}
        </div>
      </div>
    </div>
  );
}
