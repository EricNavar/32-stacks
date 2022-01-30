import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import Logo from './assets/logo.png';

const generateRoomCode = () => {
  let characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
  let result = "";
  for (let i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length))
  }
  return result;
}

function Home(props) {

  const [roomCode, setRoomCode] = useState("");
  const [name, setName] = useState("");
  
  return (
    <div>
      <h1>32Stacks</h1>
      <p>This is literally the best card game that there is.</p>
      <div style={{margin:"2.5rem"}}>
        <div>
          <label for="name">Create a username:</label>
          <input type="text" id="name" name="name" required minlength="4" maxlength="8" size="10"/>
          <button>set</button>
            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid*/}
            <a href={`/play/${generateRoomCode()}`}>Create a new game!</a>
        </div>
        <p>
          <a style={{fontSize:"24px"}} href="https://www.youtube.com/watch?v=a3Z7zEc7AXQ" target="_blank">or</a>
        </p>
        <div>
            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid*/}
            <a href={`/play/${roomCode}`}>Join an existing game!</a>
          <p></p>
          <input type="text" id="link" name="link" placeholder="Enter room code here" size="10" onChange={(e) => setRoomCode(e.target.value.toUpperCase())}/>
        </div>

        <div id="child2">
          <a style={{fontSize:"24px"}} href="rules">Game Rules!</a>
        </div>
      </div>
    </div>
  );
}

export { Home };
