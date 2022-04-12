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
import { Credits } from './Credits';

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
          <Route path="/credits" element={<Credits />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
