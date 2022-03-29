import React from "react";
import {
  Routes,
  Route,
  BrowserRouter
} from "react-router-dom";
import {Home} from './Home.js';
import {GameRules} from './GameRules.js';
import {PlayScreen} from './PlayScreen.js';
import {ServerTest} from './ServerTest.js';


function App() {

  // Constructor for game object
  //
  const [GameObject, SetGetObject] = React.useState({
    user:"",
    hand:[],
    inPlay:[], // Cards that player is currently placing down
    players:[],
    lastCardPlayed: null,
    currTurn:""
  });


  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/rules" element={<GameRules />} />
        <Route path="/play" element={<PlayScreen />} />
        <Route path="/play/:room" element={<PlayScreen />} />
        <Route path="/server-test/:room" element={<ServerTest />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
