import { Game } from './components/Game';
import { GameContainer } from './components/GameContainer';
import './styles/globals.css';

function App() {
  return (
    <div className="App">
      <div className="background-gradient"></div>
      <GameContainer>
        <Game />
      </GameContainer>
    </div>
  );
}

export default App;
