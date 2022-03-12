import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Logo from './assets/logo.png';

const generateRoomCode = () => {
  let characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
  let result = "";
  for (let i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

const StyledLink = styled(Link)`
  color: white;
  font-size: xx-large;
  text-decoration: none;
  &:hover {
    color: cyan;
  }
`

const TextInput = styled.input`
  background-color: transparent;
  color: white;
  font-size: large;
  outline: 0;
  border-bottom-color: white;
  border-bottom-width: 2px;
  width: 300px;
  text-align: center;
  border-top: 0;
  border-left: 0;
  border-right: 0;
  margin-bottom: 20px;
`

const LogoComponent = styled.img`
  width: 400px;
  padding-top: 20px;
`

const GameRulesLinkContainer = styled.div`
  padding-top: calc(100vh - 550px);
`

function Home(props) {
  const [roomCode, setRoomCode] = useState("");

  return (
    <div id="parent">  

      <LogoComponent id="logo" src={Logo} alt="logo"/> 

      <p><i>This is literally the best card game that there is.</i></p>
      <div style={{margin:"2.5rem"}}>
        
        {/* Username input */}
        <div id="child1">
          <label style={{textSize:"large"}} htmlFor="name">Set name: </label>
          <TextInput style={{width:"200px"}} onChange={(e) => props.setName(e.target.value)} type="text" id="name" name="name" required minLength="1" maxLength="15" size="10"/>
        </div>

        <div>
            <StyledLink to={`/play/${generateRoomCode()}`}>Create a new game!</StyledLink>
        </div>

        <p>
          or
        </p>

        <div>
          <StyledLink to={`/play/${roomCode}`}>Join an existing game!</StyledLink>
          <p></p>
          <TextInput type="text" id="link" name="link" placeholder="Enter room code here" size="10" onChange={(e) => setRoomCode(e.target.value.toUpperCase())}/>
        </div>

        <GameRulesLinkContainer>
          <StyledLink style={{fontSize:24}} to="/rules">Game Rules!</StyledLink>
        </GameRulesLinkContainer>
      </div>
    </div>
  );
}
Home.propTypes = {
  setName: PropTypes.func.isRequired
};

export { Home };
