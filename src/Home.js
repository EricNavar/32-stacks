import React from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from './assets/logo.png';
import Background from './assets/background.png';

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
    <div id="parent">  

      <img id="logo" src={Logo} alt=""/> 

      <p><i>This is literally the best card game that there is.</i></p>
      <div style={{margin:"2.5rem"}}>
        
        {/* Username input */}
        <div id="child1">
          <label style={{textSize:"large"}} for="name">Set nickname: </label>
          <input style={{width:"200px"}} type="text" id="name" name="name" required minlength="1" maxlength="15" size="10"/>
        </div>

        <p></p>

        <div>
            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid*/}
            <a href="#">Create a new game!</a>
        </div>

        <p>
          <a style={{fontSize:"24px"}} href="https://www.youtube.com/watch?v=a3Z7zEc7AXQ">or</a>
        </p>

        <div>
            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid*/}
            <a href="#">Join an existing game!</a>
          <p></p>
          <input type="text" id="link" name="link" placeholder="Enter link here" size="10"/>
        </div>

        <div id="child2">
          <a style={{fontSize:"24px"}} href="rules">Game Rules!</a>
        </div>
      </div>


    </div>
  );
}

export { Home };
