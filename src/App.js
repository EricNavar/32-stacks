import React from 'react';
import {
  Routes,
  Route,
  BrowserRouter
} from "react-router-dom";
import {Home} from './Home.js';
import {GameRules} from './GameRules.js';
import {PlayScreen} from './PlayScreen.js';
import {ServerTest} from './ServerTest.js';
import {SettingsPage} from './SettingsPage.js';
import { useState } from 'react';

function App() {
  const [name, setName] = useState("sus");
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home setName={setName}/>} />
          <Route path="/rules" element={<GameRules />} />
          <Route path="/play" element={<PlayScreen />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/play/:room" element={<PlayScreen name={name}/>} />
          <Route path="/server-test/:room" element={<ServerTest />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
