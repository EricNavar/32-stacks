import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import Logo from './assets/logo.png';

const generateRoomCode = () => {
  let characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
  let result = "";
  for (let i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

function Home(props) {
  const [roomCode, setRoomCode] = useState("");

  return (
    <div id="parent">  

      <img id="logo" src={Logo} alt="logo"/> 

      <p><i>This is literally the best card game that there is.</i></p>
      <div style={{margin:"2.5rem"}}>
        
        {/* Username input */}
        <div id="child1">
          <label style={{textSize:"large"}} htmlFor="name">Set name: </label>
          <input style={{width:"200px"}} onChange={(e) => props.setName(e.target.value)} type="text" id="name" name="name" required minLength="1" maxLength="15" size="10"/>
        </div>

        <br/>

        <div>
            <Link to={`/play/${generateRoomCode()}`}>Create a new game!</Link>
        </div>

        <p>
          or
        </p>

        <div>
          <Link to={`/play/${roomCode}`}>Join an existing game!</Link>
          <p></p>
          <input type="text" id="link" name="link" placeholder="Enter room code here" size="10" onChange={(e) => setRoomCode(e.target.value.toUpperCase())}/>
        </div>

        <div className="gameRulesLink">
          <a style={{fontSize:24}} href="/rules">Game Rules!</a>
        </div>
      </div>
    </div>
  );
}
Home.propTypes = {
  setName: PropTypes.func.isRequired
};

export { Home };
