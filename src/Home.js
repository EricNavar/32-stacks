import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import styled, { keyframes } from 'styled-components';
import Logo from './assets/logo.png';
import { Background } from './commonStyles';

const generateRoomCode = () => {
  let characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
  let result = "";
  for (let i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

const expand = keyframes`
  0% {
    box-shadow: blue 0px 0px 0px 2px inset;
  }
  25% {
    box-shadow: blue 0px 0px 0px 2px inset,
                rgb(0, 0, 0) 10px -10px 0px -3px,
                rgb(31, 193, 27) 10px -10px;
  }
  50% {
    box-shadow: blue 0px 0px 0px 2px inset,
                rgb(0, 0, 0) 10px -10px 0px -3px,
                rgb(31, 193, 27) 10px -10px,
                rgb(0, 0, 0) 20px -20px 0px -3px,
                rgb(255, 217, 19) 20px -20px;
  }
  75% {
    box-shadow: blue 0px 0px 0px 2px inset,
                rgb(0, 0, 0) 10px -10px 0px -3px,
                rgb(31, 193, 27) 10px -10px,
                rgb(0, 0, 0) 20px -20px 0px -3px,
                rgb(255, 217, 19) 20px -20px,
                rgb(0, 0, 0) 30px -30px 0px -3px,
                rgb(255, 156, 85) 30px -30px;
  }
  100% {
    box-shadow: blue 0px 0px 0px 2px inset,
                rgb(0, 0, 0) 10px -10px 0px -3px,
                rgb(31, 193, 27) 10px -10px,
                rgb(0, 0, 0) 20px -20px 0px -3px,
                rgb(255, 217, 19) 20px -20px,
                rgb(0, 0, 0) 30px -30px 0px -3px,
                rgb(255, 156, 85) 30px -30px,
                rgb(0, 0, 0) 40px -40px 0px -3px,
                rgb(255, 85, 85) 40px -40px;
  }
`;

const HomeMain = styled.main`
  max-width: 100%;
  text-align: center;
  justify-content: center;
  display: grid;
  background: rgba(0,0,0);
  width: min-content;
  margin: auto;
  margin-top: auto;
  border-radius: 8px;
  margin-top: 50px;

  animation-name: ${expand};
  animation-duration: 1s;
  animation-timing-function: linear;
  animation-delay: 0s;
  animation-direction: normal;
  animation-fill-mode: forwards;
  animation-play-state: running;
  animation-timeline: ;
}
`

const GamesRulesLink = styled(Link)`
  color: white;
  font-size: xx-large;
  text-decoration: none;
  &:hover {
    color: cyan;
  }
`

const CreateNewGame = styled(Link)`
  width: 256px;
  max-width: 100%;
  padding: 12px;
  background-color: #383838;
  color: white;
  border-radius: 8px;
  border-style: none;
  font-size: 1.4rem;
  box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
  height: fit-content;
  text-decoration: none;
  &:hover {
    color: cyan;
  }
`

const JoinExistingGame = styled.button`
  width: 280px;
  max-width: 100%;
  padding: 12px;
  background-color: #383838;
  color: white;
  border-radius: 8px;
  border-style: none;
  font-size: 1.4rem;
  box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
  height: fit-content;
  text-decoration: none;
  cursor: pointer;
  &:hover {
    color: cyan;
  }
`

const TextInput = styled.input`
  background-color: transparent;
  color: white;
  font-size: large;
  border-bottom-color: white;
  border-bottom-width: 2px;
  width: 300px;
  text-align: center;
  margin-bottom: 20px;
  padding: 2px;
  border-radius: 6px;
  background: #fff;
  color: black;
  border-style:solid;
  border-color:#000058;
  width: 200px;
`

const LogoComponent = styled.img`
  width: 400px;
  padding-top: 20px;
  margin: auto;
`

const GameRulesLinkContainer = styled.div`
  padding-top: calc(100vh - 550px);
`

const LinksContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 12px;
  @media (max-width: 600px) {
    display: grid;
  }
`

const RoomCodeInputContainer = styled.div`
  height: ${props => props.visible ? "100px" : "0px"};
  animation: swing 1s ease;
  transition: height 1s;
  overflow: hidden;
`

const SubmitLink = styled(Link)`
  width: 80px;
  padding: 5px;
  background-color: #383838;
  color: white;
  border-radius: 8px;
  border-style: none;
  font-size: 1.4rem;
  box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
  height: fit-content;
  text-decoration: none;
  &:hover {
    color: cyan;
  }
`

function Home(props) {
  const [roomCode, setRoomCode] = useState("");
  const [roomCodeOpen, setRoomCodeOpen] = useState(false);

  const onClickJoin = () => {
    setRoomCodeOpen(!roomCodeOpen);
  }

  return (
    <>
      <HomeMain id="home">
        <LogoComponent id="logo" src={Logo} alt="logo" />

        <p><i>This is literally the best card game that there is.</i></p>
        <div style={{ margin: "2.5rem" }}>

          {/* Username input */}
          <div id="child1">
            <label style={{ textSize: "large" }} htmlFor="name">Set name: </label>
            <TextInput
              onChange={(e) => props.setName(e.target.value)}
              type="text"
              id="name"
              name="name"
              minLength="1"
              maxLength="15"
              size="10"
              placeholder="Name"
            />
          </div>

          <LinksContainer>
            <CreateNewGame to={`/play/${generateRoomCode()}`}>Create a new game!</CreateNewGame>

            <p style={{ margin: 12 }}>or</p>

            <div style={{ width: 'min-content' }}>
              <JoinExistingGame onClick={onClickJoin}>Join an existing game!</JoinExistingGame>
              <RoomCodeInputContainer visible={roomCodeOpen}>
                <TextInput type="text" id="link" name="link" placeholder="Enter room code here" size="10" onChange={(e) => setRoomCode(e.target.value.toUpperCase())} />
                <SubmitLink to={`/play/${roomCode}`}>
                  Submit
                </SubmitLink>
              </RoomCodeInputContainer>
            </div>
          </LinksContainer>

          <GameRulesLinkContainer>
            <GamesRulesLink style={{ fontSize: 24 }} to="/rules">Game Rules!</GamesRulesLink><br />
            <GamesRulesLink style={{ fontSize: 24 }} to="/credits">Credits</GamesRulesLink>
          </GameRulesLinkContainer>
        </div>
      </HomeMain>
      <Background />
    </>
  );
}
Home.propTypes = {
  setName: PropTypes.func.isRequired
};

export { Home };
