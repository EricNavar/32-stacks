/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import PropTypes, { string } from 'prop-types';
import io from 'socket.io-client';
import { useParams, useNavigate } from "react-router-dom";
//import local stuff later
import { inPlayTemp } from './sampleData.js';
import { placeCard, drawCard, canPlaceCard, checkHand } from './logic/gameLogic';
import { yourCards, otherPlayers } from './sampleData.js';
import { ColorPicker } from './modals/ColorPicker';
import { EndingModal } from './modals/EndingModal';
import { LobbyModal } from './modals/LobbyModal.js';
import Logo from './assets/logo.png';
import { Card, CardButton } from './Cards';

const ENDPOINT = "http://localhost:5000";
let socket;

const PlayScreenMain = styled.main`
  justify-content:center;
  display: grid;
  background: url("${props => props.selectedBackground}");
  height: 100vh;
`;

const PlaceCards = styled.button`
  position: absolute;
  bottom: 120;
  position: absolute;
  border-radius: 6px;
  border-style: solid;
  display: inline-flex;
  height: 30px;
  width: 180px;
  background-color: transparent;
  color: white;
  justify-content: center;
  align-items: center;
  bottom: 140px;
  left: calc(50% - 90px);
`;

const Center = styled.div`
  position: absolute;
  bottom: 50%;
  left: calc(50% - 58px);
  display: flex;
`;

const StyledCard = styled.div`
  border-radius: 6px;
  border-style: solid;
  display: inline-flex;
  width: 64px;
  height: 90px;
  box-shadow: rgba(6, 24, 44, 0.4) 0px 0px 0px 2px, rgba(6, 24, 44, 0.65) 0px 4px 6px -1px, rgba(255, 255, 255, 0.08) 0px 1px 0px inset;
  box-sizing: border-box;
`;

//this is meant to be a button that wraps around a card
const ButtonWrapper = styled.button`
  margin: 0;
  background: transparent;
  border: 0;
`

// Drop cards here
const CardDropper = styled(StyledCard)`
  position: absolute;
  bottom: 200px;
  left: calc(50% - 32px);
  border-style: solid;
  height:
  border-color: black;
  background-color: black;
`;

const HandContainer = styled.div`
  border-width: 2px;
  border-radius: 8px;
  bottom: 2px;
  height: 90px;
  padding-top: 12px;
  padding-bottom: 12px;
  padding-right: 12px;
  padding-left: 32px;
  justify-content: center;
  display: grid;
  margin-left: auto;
  margin-right: auto;
  margin-top: auto;
  background: rgba(255,255,255,.2);
`;

const TopPlayerHandContainer = styled.div`
  margin-top: 8px;
  display:grid;
  justify-content: center;
`;

const HiddenCard = styled(StyledCard)`
  border-color: white;
  background-color: black;
  background-image: url(${Logo});
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
`;

const LeftPlayerHandContainer = styled.div`
  position: absolute;
  top: calc(50% - 40px);
`;

const RightPlayerHandContainer = styled.div`
  position: absolute;
  top: calc(50% - 40px);
  right: 0;
`;

const Username = styled.p`
  margin: 0;
  font-weight: bold;
  font-size: 1.4rem;
  color: white;
  top: calc(50% - 150px);
  position: absolute;
`;

const RightPlayerUsername = styled(Username)`
  right: 16px;
`;

const LeftPlayerUsername = styled(Username)`
  left: 16px;
`;

const TopPlayerUsername = styled(Username)`
  top: 100px;
  left: calc(50% - 50px);
  width: 100px;
`;

const CallUnoButton = styled.button`
  padding: 12px;
  border: 0;
  background-color: #2949e6;
  position: absolute;
  bottom: 8px;
  left: 8px;
  color: white;
  border-radius: 8px;
  font-size: 1.2rem;
`;

function PlayScreen(props) {
  const myId = 2;
  const [players, setPlayers] = React.useState(otherPlayers);
  const otherPlayerIds = players.filter(player => player.id !== myId).map(player => player.playerId);
  const topPlayerId = otherPlayerIds[0];
  const leftPlayerId = otherPlayerIds[1];
  const rightPlayerId = otherPlayerIds[2];

  const [gameObject, setGameObject] = useState();
  const [gameObjectPlayers, setGameObjectPlayers] = useState();
  const [host, setHost] = useState(false);

  useEffect(() => {
    if (gameObject !== undefined) {
      console.log(gameObject);
      setGameObjectPlayers(gameObject.playerList.map(player => player.name));
      if (host === false && gameObject.playerList[0].name === props.name) {
        console.log("I am the host!");
        setHost(true);
      }
      if (lobbyModalOpen && gameObject.gameStart) {
        setLobbyModalOpen(false);
      }
    }
  }, [gameObject]);

  const startGame = () => {
    let temp = { ...gameObject };
    temp.gameStart = true;
    setLobbyModalOpen(false);
  };

  //Socket.io --------------------------------------------------------------------
  const { room } = useParams();
  const navigate = useNavigate();

  //Initial Socket Connection
  useEffect(() => {
    const connectionOptions = {
      "forceNew": true,
      "reconnectionAttempts": "Infinity",
      "timeout": 10000,
      "transports": ["websocket"]
    };
    socket = io.connect(ENDPOINT, connectionOptions);

    socket.emit('join', { room: room, name: props.name }, (error) => {
      if (error) {
        console.log("error");
        navigate('/');
      }
      else {
        console.log("Successfully connected to room");
      }
    });
  }, []);

  //Receiving Messages from Socket Server
  useEffect(() => {
    socket.on("gameObjectUpdate", (newGameObject) => {
      setGameObject(newGameObject);
    });

    socket.on("initialGameObject", (newGameObject) => {
      setGameObject(newGameObject);
    });

    socket.on("playerLeft", (newLobby) => {
      setGameObject(previousGameObject => {
        const newGameObject = { ...previousGameObject };
        const newList = previousGameObject.playerList.filter(player => player.name !== newLobby.leftPlayer);
        newGameObject.playerList = newList;
        return newGameObject;
      });
    });
  }, []);

  //Updating Game Object with Game Actions
  const [lobbyModalOpen, setLobbyModalOpen] = useState(true);

  const updateGame = (newGameObject) => {
    if (newGameObject !== undefined) {
      socket.emit('updateGame', newGameObject);
    }
  };

  useEffect(() => {
    if (gameObject !== undefined && host) {
      let temp = { ...gameObject };
      temp.gameStart = true;
      updateGame(temp);
    }
  }, [lobbyModalOpen]);

  //End of Socket.io ----------------------------------------------------

  const yourUserName = props.name;

  const [hand, setHand] = React.useState(yourCards);
  const [inPlay, setInPlay] = React.useState([]);
  const [topOfStack, setTopOfStack] = React.useState(null);
  // in which direction the streak is going. "none", "increasing", "decreasing"
  const [direction, setDirection] = React.useState("none");

  // if this player has a card available to put down
  //who's turn is it? It stores a number 0 through 4, representing the player ID
  const [turn, setTurn] = React.useState(0);

  const [lastCardPlayed, setLastCardPlayed] = React.useState({
    c: "red",
    v: '3',
    gray: false
  });

  const [colorPickerOpen, setColorPickerOpen] = React.useState(false);
  const [nextColor, setNextColor] = React.useState("red");

  const [endingModalOpen, setEndingModalOpen] = React.useState(false);

  const myHandOffset = (hand.length * 70) / 2;

  const onClickDrawPile = () => {
    // you can only draw a card if you have no available cards, it's your turn,
    // and you haven't placed a first card
    if (!canPlaceCard(hand, lastCardPlayed, inPlay) || turn !== myId || inPlay.length !== 0) {
      return;
    }
    hand.push(drawCard());
  };

  const onClickCardButton = (card, hand, setHand, inPlay, setInPlay, setTopOfStack, lastCardPlayed, direction, setDirection) => {
    placeCard(card, hand, setHand, inPlay, setInPlay, setTopOfStack);
    // If no cards have been placed, consider the last card on the discard pile.
    // Otherwise, the last card in this temporary stack
    const lastCard = inPlay.length === 0 ? lastCardPlayed : inPlay[inPlay.length - 1];
    checkHand(hand, lastCard, inPlay, direction, setDirection);
    if (card.c === "wild") {
      setColorPickerOpen(true);
    }
  }

  const onClickPlaceCards = () => {
    setTopOfStack(inPlay[inPlay.size - 1]);
    setInPlay([]);
  };

  console.log(inPlay.length);

  return (
    <>
      <PlayScreenMain selectedBackground={props.backgrounds[props.selectedBackground]}>
        <TopPlayerHandContainer>
          <div style={{ display: 'max-content' }}>
            {Array.apply(null, { length: players[topPlayerId].cardCount }).map((card, index) => <HiddenCard key={index} />)}
          </div>
        </TopPlayerHandContainer>
        <TopPlayerUsername >{players[topPlayerId].name}</TopPlayerUsername>
        <LeftPlayerUsername >{players[leftPlayerId].name}</LeftPlayerUsername>
        <LeftPlayerHandContainer>
          <div style={{ display: 'max-content', transform: 'rotate(90deg)' }}>
            {Array.apply(null, { length: players[leftPlayerId].cardCount }).map((card, index) => <HiddenCard key={index} />)}
          </div>
        </LeftPlayerHandContainer>
        <RightPlayerUsername >{players[rightPlayerId].name}</RightPlayerUsername>
        <RightPlayerHandContainer>
          <div style={{ display: 'max-content', transform: 'rotate(-90deg)' }}>
            {Array.apply(null, { length: players[rightPlayerId].cardCount }).map((card, index) => <HiddenCard key={index} />)}
          </div>
        </RightPlayerHandContainer>

        {inPlay.length > 0 &&
          <>
            <CardDropper>
              <div style={{ width: 'max-content' }}>
                {topOfStack &&
                  <CardButton onClick={() => { console.log("click"); }} color={topOfStack.c} value={topOfStack.v} gray={topOfStack.gray} />
                }
              </div>
            </CardDropper>
            <PlaceCards onClick={onClickPlaceCards}>
              Place Cards!
            </PlaceCards>
          </>
        }

        <HandContainer style={{ left: `calc(50% - ${myHandOffset}px` }}>
          <div style={{ width: 'max-content' }}>
            {hand.map((card, index) => {
              return <CardButton
                id={`card-button-${index}`}
                key={index}
                onClick={e =>
                  onClickCardButton(card, hand, setHand, inPlay, setInPlay, setTopOfStack, lastCardPlayed, direction, setDirection)
                }
                color={card.c}
                value={card.v}
                gray={card.gray}
              />;
            })}
          </div>
        </HandContainer>
        <Center>
          <Card id="discard-pile" color={setLastCardPlayed.c} value={setLastCardPlayed.v} />
          <CardButton id="draw-pile" onClick={onClickDrawPile} color="wild" gray={false} value="DRAW">
            Draw
          </CardButton>
        </Center>
        <CallUnoButton>
          CALL UNO
        </CallUnoButton>
      </PlayScreenMain>
      <ColorPicker open={colorPickerOpen} setNextColor={setNextColor} setColorPickerOpen={setColorPickerOpen} />
      <EndingModal open={endingModalOpen} />
      <LobbyModal open={lobbyModalOpen} players={gameObjectPlayers} isHost={host} startGame={startGame} />
    </>
  );
}
PlayScreen.propTypes = {
  name: PropTypes.string,
  selectedBackground: PropTypes.string.isRequired,
  backgrounds: PropTypes.object.isRequired
};

export { PlayScreen };
