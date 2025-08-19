import { Game } from './components/Game';
import { GameContainer } from './components/GameContainer';
import { ErrorBoundary } from './components/ErrorBoundary';
import { NetworkSwitcher } from './components/NetworkSwitcher';
import AppProviders from './providers/AppProviders';
import './styles/globals.css';

function App() {
  return (
    <AppProviders>
      <div className="App">
        <NetworkSwitcher />
        <div className="background-gradient"></div>
        <GameContainer>
          <ErrorBoundary>
            <Game />
          </ErrorBoundary>
        </GameContainer>
      </div>
    </AppProviders>
  );
}

export default App;
