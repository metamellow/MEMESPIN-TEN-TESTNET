import { useState } from 'react';
import { Game } from './components/Game';
import { GameContainer } from './components/GameContainer';
import { ErrorBoundary } from './components/ErrorBoundary';
import { NetworkSwitcher } from './components/NetworkSwitcher';
import AppProviders from './providers/AppProviders';
import './styles/globals.css';

function App() {
  const [networkMessage, setNetworkMessage] = useState<string | null>(null);

  return (
    <AppProviders>
      <div className="App">
        <NetworkSwitcher onNetworkMessage={setNetworkMessage} />
        <div className="background-gradient"></div>
        <GameContainer>
          <ErrorBoundary>
            <Game networkMessage={networkMessage} />
          </ErrorBoundary>
        </GameContainer>
      </div>
    </AppProviders>
  );
}

export default App;
