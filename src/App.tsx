import { RosterUpload } from './components/RosterUpload';
import { GameHUD } from './components/GameHUD';
import { useGameStore } from './store/gameStore';

function App() {
  const army = useGameStore(state => state.army);

  return (
    <div className="container">
      <header style={{ marginBottom: '32px', textAlign: 'center', paddingTop: '40px' }}>
        <h1>Warhammer 40k</h1>
        <h2 style={{ color: 'var(--text-main)', marginTop: '8px' }}>Battle Tracker</h2>
        <p style={{ color: 'var(--primary-gold)', marginTop: '8px', letterSpacing: '2px', textTransform: 'uppercase', fontSize: '12px' }}>
          Tenth Edition
        </p>
      </header>
      
      {!army ? (
        <RosterUpload />
      ) : (
        <GameHUD />
      )}
    </div>
  );
}

export default App;
