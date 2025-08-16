import { Game } from './components/Game';
import { GameContainer } from './components/GameContainer';
import { ErrorBoundary } from './components/ErrorBoundary';
import './styles/globals.css';

function App() {
  return (
    <div className="App">
      <div className="background-gradient"></div>
      <GameContainer>
        <ErrorBoundary>
          <Game />
        </ErrorBoundary>
      </GameContainer>
    </div>
  );
}

export default App;
