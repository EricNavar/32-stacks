import React from 'react';
import { useNavigate } from 'react-router-dom';

const generateRoomCode = () => {
  let characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
  let result = "";
  for (let i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length))
  }
  return result;
}

function Home(props) {
  const navigate = useNavigate();

  const testOnClick = () => {
    const roomCode = generateRoomCode();
    navigate(`/server-test/${roomCode}`)
  }
  
  return (
    <div>
      <h1>32Stacks</h1>
      <p>This is literally the best card game that there is.</p>
      <div style={{margin:"2.5rem"}}>
        <div>
          <label for="name">Create a username:</label>
          <input type="text" id="name" name="name" required minlength="4" maxlength="8" size="10"/>
          <button>set</button>
        </div>
        <p>
          or
        </p>
        <div>
          <button>Join a game</button>
          <button onClick={testOnClick}>Click me!</button>
        </div>
      </div>
    </div>
  );
}

export { Home };
