import { useState } from 'react';
import { parseRosz } from '../utils/battlescribeParser';
import { useGameStore } from '../store/gameStore';

export function RosterUpload() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const setArmy = useGameStore(state => state.setArmy);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setError(null);
    try {
      const army = await parseRosz(file);
      setArmy(army);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to parse .rosz file');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card animate-fade-in" style={{ padding: '24px', textAlign: 'center', marginTop: '40px' }}>
      <h2 style={{ marginBottom: '16px' }}>Upload Your Roster</h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>
        Select your Battlescribe .rosz list here.
      </p>
      
      <div>
        <label htmlFor="roster-upload" className="btn-primary" style={{ display: 'inline-block', cursor: 'pointer' }}>
          {loading ? 'Parsing...' : 'Select .rosz File'}
        </label>
        <input 
          id="roster-upload" 
          type="file" 
          accept=".rosz" 
          onChange={handleFileUpload} 
          style={{ display: 'none' }} 
        />
      </div>

      {error && (
        <div style={{ marginTop: '16px', color: 'var(--primary-red)' }}>
          {error}
        </div>
      )}
    </div>
  );
}
