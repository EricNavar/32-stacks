import React, { useState } from 'react';
import {
  Routes,
  Route,
  BrowserRouter
} from "react-router-dom";
import {Home} from './Home.js';
import {GameRules} from './GameRules.js';
import {PlayScreen} from './PlayScreen.js';
import {ServerTest} from './ServerTest.js';
import { SettingsButton } from './SettingsButton'; 

const backgrounds = {
  "Black wood": "https://github.com/EricNavar/among-us-2-2/blob/master/Wood.png?raw=true",
  "Among Us": "https://cdn1.epicgames.com/salesEvent/salesEvent/amoguslandscape_2560x1440-3fac17e8bb45d81ec9b2c24655758075",
  "Sand": "https://images.unsplash.com/photo-1550684376-efcbd6e3f031?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxleHBsb3JlLWZlZWR8MTJ8fHxlbnwwfHx8fA%3D%3D&w=1000&q=80"
}

function App() {
  const [name, setName] = useState("sus");
  const [selectedBackground, setSelectedBackground] = useState("Black wood");
  return (
    <>
      <SettingsButton selectedBackground={selectedBackground} setSelectedBackground={setSelectedBackground} backgrounds={backgrounds}/>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home setName={setName}/>} />
          <Route path="/rules" element={<GameRules />} />
          <Route path="/play" element={<PlayScreen selectedBackground={selectedBackground} backgrounds={backgrounds}/>} />
          <Route path="/play/:room" element={<PlayScreen name={name} selectedBackground={selectedBackground} backgrounds={backgrounds}/>} />
          <Route path="/server-test/:room" element={<ServerTest />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
