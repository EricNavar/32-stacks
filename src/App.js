import {
  Routes,
  Route,
  BrowserRouter
} from "react-router-dom";
import {Home} from './Home.js';
import {GameRules} from './GameRules.js';
import {PlayScreen} from './PlayScreen.js';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/rules" element={<GameRules />} />
        <Route path="/play" element={<PlayScreen />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
