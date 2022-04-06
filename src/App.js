import React, { useState } from 'react';
import {
  Routes,
  Route,
  BrowserRouter
} from "react-router-dom";
import { v4 as uuid } from "uuid";
import { Home } from './Home.js';
import { GameRules } from './GameRules.js';
import { PlayScreen } from './PlayScreen.js';
import { ServerTest } from './ServerTest.js';

function App() {
  const [name, setName] = useState("sus");
  const playerID = uuid();
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home setName={setName} />} />
          <Route path="/rules" element={<GameRules />} />
          <Route path="/play" element={<PlayScreen />} />
          <Route path="/play/:room" element={<PlayScreen name={name} playerID={playerID} />} />
          <Route path="/server-test/:room" element={<ServerTest />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
