import { Game } from './components/Game';
import { GameContainer } from './components/GameContainer';
import { ErrorBoundary } from './components/ErrorBoundary';
import AppProviders from './providers/AppProviders';
import './styles/globals.css';

function App() {
  return (
    <AppProviders>
      <div className="App">
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
