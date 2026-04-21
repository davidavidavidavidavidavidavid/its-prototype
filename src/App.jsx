import { useState, useCallback } from 'react';
import { SessionProvider } from './context/SessionContext';
import EntryCard from './screens/EntryCard';
import ComicScreen from './screens/ComicScreen';
import PracticeScreen from './screens/PracticeScreen';
import ExitScreen from './screens/ExitScreen';

const SCREENS = ['entry', 'comic', 'practice', 'exit'];

function DevNav({ screen, onNav, outcome }) {
  return (
    <div className="dev-nav">
      <span>DEV</span>
      {[
        { id: 'entry', label: 'Entry' },
        { id: 'comic', label: 'Comic' },
        { id: 'practice', label: 'Practice' },
        { id: 'exit-mastery', label: 'Exit: mastery' },
        { id: 'exit-needs-help', label: 'Exit: needs-help' },
      ].map(({ id, label }) => (
        <button
          key={id}
          className={screen === id || (screen === 'exit' && id === `exit-${outcome}`) ? 'active' : ''}
          onClick={() => onNav(id)}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

export default function App() {
  const [screen, setScreen] = useState('entry');
  const [outcome, setOutcome] = useState(null);

  const navigate = useCallback((target) => {
    if (target === 'exit-mastery') { setScreen('exit'); setOutcome('mastery'); return; }
    if (target === 'exit-needs-help') { setScreen('exit'); setOutcome('needs-help'); return; }
    setScreen(target);
  }, []);

  function handleComplete(result) {
    setOutcome(result);
    setScreen('exit');
  }

  return (
    <SessionProvider>
      <div style={{ paddingTop: 26 }}>
        <DevNav screen={screen} onNav={navigate} outcome={outcome} />

        {screen === 'entry' && (
          <EntryCard onStart={() => setScreen('comic')} />
        )}
        {screen === 'comic' && (
          <ComicScreen onComplete={() => setScreen('practice')} />
        )}
        {screen === 'practice' && (
          <PracticeScreen onComplete={handleComplete} />
        )}
        {screen === 'exit' && (
          <ExitScreen outcome={outcome} onDone={() => setScreen('entry')} />
        )}
      </div>
    </SessionProvider>
  );
}
