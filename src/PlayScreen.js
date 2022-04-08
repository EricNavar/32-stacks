/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import io from 'socket.io-client';
import { useParams, useNavigate } from "react-router-dom";
//import local stuff later
import { placeCard, drawCard, calculateCanPlaceCard, checkHand, chooseRandomNumberCard } from './logic/gameLogic';
import { ColorPicker } from './modals/ColorPicker';
import { EndingModal } from './modals/EndingModal';
import { LobbyModal } from './modals/LobbyModal.js';
import { Modal } from './modals/Modal.js';
import Logo from './assets/logo.png';
import { Card, CardButton } from './Cards';
// Uncomment this to start game w/ sample cards:
// import { yourCards } from './sampleData';
import { SettingsButton } from './SettingsButton';

const ENDPOINT = "https://myrpgstats.com";

//Development endpoint
// const ENDPOINT = "http://localhost:8080";

let socket;

const PlayScreenMain = styled.main`
  justify-content:center;
  display: grid;
  background: url("${props => props.background}");
  background-size: cover;
  background-position: center;
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
  border-width: 1px;
  border-radius: 8px;
  bottom: 2px;
  height: 90px;
  padding-top: 12px;
  padding-bottom: 12px;
  padding-right: 12px;
  padding-left: 12px;
  justify-content: center;
  display: grid;
  margin-left: auto;
  margin-right: auto;
  margin-top: auto;
  background: rgba(255,255,255,.2);
  minWidth: 72px;
`;

const TopPlayerHandContainer = styled.div`
  margin-top: 8px;
  display:grid;
  justify-content: center;
`;

const HiddenCard = styled(StyledCard)`
  border-color: white;
  border-width: 1px;
  background-color: black;
  background-image: url(${Logo});
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
`;

const LeftPlayerHandContainer = styled.div`
  position: absolute;
  top: calc(25%);
  left: 25px;
  & > div {
    transform: rotate(90deg);
    margin-top: -50px;
  }
`;

const RightPlayerHandContainer = styled.div`
  position: absolute;
  top: calc(25%);
  right: 25px;
  & > div {
    transform: rotate(-90deg);
    margin-top: -50px;
  }
`;

const Username = styled.p`
  margin: 0;
  font-weight: bold;
  font-size: 1.4rem;
  color: white;
  top: calc(15%);
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

function PlayScreen(props) {
  const playerID = props.playerID;
  const [gameObject, setGameObject] = useState();
  const [gameObjectPlayerNames, setGameObjectPlayerNames] = useState([]);
  const [host, setHost] = useState(false);
  const [myTurn, setMyTurn] = useState(false);
  const [centerText, setCenterText] = useState("");

  //inPlay is the stack
  const [inPlay, setInPlay] = React.useState([]);
  const [topOfStack, setTopOfStack] = React.useState(null);
  // in which direction the streak is going. "none", "increasing", "decreasing"
  const [direction, setDirection] = React.useState("none");

  // if this player has a card available to put down
  //who's turn is it? It stores a number 1 through 4, representing the player ID and initially starts at 0 until game object is loaded
  const [turn, setTurn] = React.useState(0);

  const [lastCardPlayed, setLastCardPlayed] = React.useState({
    color: "red",
    value: '3',
    gray: false
  });
  const [hand, setHand] = React.useState(() => {
    let newHand = [];
    for (let i = 0; i < 8; i++) {
      newHand.push(drawCard());
    }

    // let newHand = yourCards;              // Uncomment this line to start game w/ sample cards
    return checkHand(newHand, lastCardPlayed, inPlay, direction);
  });

  const [colorPickerOpen, setColorPickerOpen] = React.useState(false);
  const [endingModalOpen, setEndingModalOpen] = React.useState(false);
  const [nextColor, setNextColor] = React.useState(lastCardPlayed.color);

  let [shouldTransition, setShouldTransition] = useState(true);
  let [color, setColor] = useState('red');

  function handleClick() {
    setShouldTransition(false);
    setColor('red');
  }

  useEffect(() => {
    if (color === 'red') {
      setShouldTransition(true);
      setColor('black');
    }
  }, [color]);

  useEffect(() => {
    if (gameObject !== undefined) {
      setGameObjectPlayerNames(gameObject.playerList.map(player => player.name));
      if (host === false && gameObject.playerList[0].id === playerID) {
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
    temp.lastCardPlayed = chooseRandomNumberCard();
    updateGame(temp);
  };

  const randomizeHand = () => {
    let newHand = [];
    for (let i = 0; i < 8; i++) {
      newHand.push(drawCard());
    }
    const lastCard = inPlay.length === 0 ? lastCardPlayed : inPlay[inPlay.length - 1];
    setHand(checkHand(newHand, lastCard, inPlay, direction));
  }

  const restartGame = () => {
    let newGameObject = { ...gameObject };
    newGameObject.winner = 'restart';
    randomizeHand();
    for (let i = 0; i < gameObjectPlayerNames.length; i++) {
      newGameObject.playerList[i].cardCount = 8;
    }
    updateGame(newGameObject);
  }

  //Socket.io --------------------------------------------------------------------
  const { room } = useParams();
  const navigate = useNavigate();

  //Initial Socket Connection
  useEffect(() => {
    const connectionOptions = {
      "forceNew": true,
      "reconnectionAttempts": "Infinity",
      "timeout": 10000,
      "transports": ["websocket"],
    };
    socket = io.connect(ENDPOINT, connectionOptions);

    socket.emit('join', { room: room, name: props.name, playerID: playerID }, (error) => {
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
        const newList = previousGameObject.playerList.filter(player => player.id !== newLobby.leftPlayer);
        newGameObject.playerList = newList;
        return newGameObject;
      });
    });
  }, []);
  //End of Socket.io ----------------------------------------------------

  //Updating Game Object with Game Actions
  const updateGame = (newGameObject) => {
    if (newGameObject !== undefined) {
      socket.emit('updateGame', newGameObject);
    }
  };

  useEffect(() => {
    if (!endingModalOpen) {
      randomizeHand();
    }
  }, [endingModalOpen])

  //Check if game object updates
  useEffect(() => {
    //Check if game object is undefinded
    if (gameObject === undefined) {
      return;
    }
    //Check if game is over
    if (gameObject.winner !== 0) {
      if (gameObject.winner === 'restart') {
        let temp = { ...gameObject }
        temp.winner = 0;
        setEndingModalOpen(false);
        setCenterText(`Player ${turn}'s turn: ${gameObjectPlayerNames[turn - 1]}`);
        setShouldTransition(false);
        updateGame(temp)
      }
      else {
        console.log("Game is over!")
        setCenterText(`Winner: ${gameObject.winner[0].name}!`);
        setShouldTransition(false);
        setEndingModalOpen(true);
      }
    }
    //Check if it is your turn and set turn, then check if draw cards were played
    if (turn === gameObject.turn && gameObject.lastCardPlayed !== 'empty') { setHand(checkHand(hand, gameObject.lastCardPlayed, [], direction)); }
    setTurn(gameObject.turn)
    if (gameObject.turn === gameObject.playerList.findIndex(player => playerID === player.id) + 1) {
      setMyTurn(true);
      if (gameObject.lastCardPlayed.value === 'draw2') {
        let newHand = [...hand];
        for (let i = 0; i < 2 * gameObject.lastPlaySize; i++) { newHand.push(drawCard()); }
        setHand(checkHand(newHand, gameObject.lastCardPlayed, [], gameObject.direction))
      }
      if (gameObject.lastCardPlayed.value === 'draw4') {
        let newHand = [...hand];
        for (let i = 0; i < 4 * gameObject.lastPlaySize; i++) { newHand.push(drawCard()); }
        setHand(checkHand(newHand, gameObject.lastCardPlayed, [], gameObject.direction))
      }
    }
    else {
      setMyTurn(false);
    }
    //Check last card played
    if (gameObject.lastCardPlayed !== "empty") {
      setLastCardPlayed(gameObject.lastCardPlayed);
    }
  }, [gameObject])

  //When host starts the game by closing the lobby modal
  const [lobbyModalOpen, setLobbyModalOpen] = useState(true);

  useEffect(() => {
    if (gameObject !== undefined && host) {
      let temp = { ...gameObject };
      temp.gameStart = true;
      updateGame(temp);
    }
  }, [lobbyModalOpen]);

  //check hand when the turn changes
  useEffect(() => {
    setCenterText(`Player ${turn}'s turn: ${gameObjectPlayerNames[turn - 1]}`);
    setHand(checkHand(hand, lastCardPlayed, inPlay, direction));
  }, [turn]);

  const myHandOffset = (hand.length * 70) / 2;

  const onClickDrawPile = () => {
    // you can only draw a card if you have no available cards, it's your turn,
    // and you haven't placed a first card
    if (!calculateCanPlaceCard(hand) && inPlay.length === 0 && myTurn) {
      let newHand = [...hand];
      newHand.push(drawCard())
      const lastCard = inPlay.length === 0 ? lastCardPlayed : inPlay[inPlay.length - 1];
      setHand(checkHand(newHand, lastCard, inPlay, direction))
    }
  };

  const onClickCardButton = (card, hand, setHand, inPlay, setInPlay, setTopOfStack, lastCardPlayed, direction) => {
    placeCard(card, hand, setHand, inPlay, setInPlay, setTopOfStack);
    // If no cards have been placed, consider the last card on the discard pile.
    // Otherwise, the last card in this temporary stack
    const lastCard = inPlay.length === 0 ? lastCardPlayed : inPlay[inPlay.length - 1];

    //Check direction if at least one card has been placed
    let newDirection = direction;
    if (inPlay.length > 1) {
      const previousStackCard = inPlay[inPlay.length - 2];
      if (!isNaN(previousStackCard.value) && !isNaN(card.value) && direction === 'none') {
        if (Number(previousStackCard.value) < Number(card.value) || (Number(previousStackCard.value) == 9 && Number(card.value) == 0)) {
          newDirection = "increasing"
        }
        else if (Number(previousStackCard.value) > Number(card.value) || (Number(previousStackCard.value) == 0 && Number(card.value) == 9)) {
          newDirection = "decreasing"
        }
      }
      setDirection(newDirection)
    }

    const checkedHand = checkHand(hand, lastCard, inPlay, newDirection);
    setHand(checkedHand);
    if (card.color === "rainbow") {
      setColorPickerOpen(true);
    }
  }

  //Place card stack, end turn, and update game object
  const onClickPlaceCards = () => {
    setTopOfStack(inPlay[inPlay.size - 1]);

    let newGameObject = { ...gameObject };
    newGameObject.lastPlaySize = inPlay.length;               // Stores number of cards placed in the last play.
    //Sends last card played
    newGameObject.lastCardPlayed = inPlay.slice(-1).pop();
    if (newGameObject.lastCardPlayed.color === 'rainbow') {
      newGameObject.lastCardPlayed.color = nextColor;
    }
    //Check if no more cards are in player's hand and they win
    if (hand.length === 0) {
      newGameObject.winner = newGameObject.playerList.filter(player => player.id === playerID);
      newGameObject.direction = false;
      newGameObject.turn = 1;
      newGameObject.lastCardPlayed = chooseRandomNumberCard();
    }
    //Check if reverse card
    else {
      if (newGameObject.lastCardPlayed.value === "reverse") {
        if (newGameObject.lastPlaySize % 2 === 1) {
          newGameObject.direction = !newGameObject.direction;
        }
      }
      //Updates turn and check skip
      if (newGameObject.direction) {
        newGameObject.turn -= 1;
        if (newGameObject.turn < 1) {
          newGameObject.turn = newGameObject.turn = gameObjectPlayerNames.length  // If turn underflows
        }
        if (newGameObject.lastCardPlayed.value === 'skip') {
          newGameObject.turn -= newGameObject.lastPlaySize;
          if (newGameObject.turn < 1) {
            newGameObject.turn += gameObjectPlayerNames.length;
          }
        }
      }
      else {
        newGameObject.turn += 1;
        if (newGameObject.turn > gameObjectPlayerNames.length) {  // If turn overflows
          newGameObject.turn = 1
        }
        if (newGameObject.lastCardPlayed.value === 'skip') {
          newGameObject.turn += newGameObject.lastPlaySize;
          if (newGameObject.turn > gameObjectPlayerNames.length) {
            newGameObject.turn -= gameObjectPlayerNames.length;
          }
        }
      }
    }
    const thisPlayer = newGameObject.playerList.filter(player => player.id === playerID);
    const playerIndex = (newGameObject.playerList.indexOf(thisPlayer[0]));
    newGameObject.playerList[playerIndex].cardCount = hand.length;
    if (newGameObject.lastCardPlayed.value === 'draw2') {
      newGameObject.playerList[newGameObject.turn - 1].cardCount += (2 * newGameObject.lastPlaySize);
    }
    else if (newGameObject.lastCardPlayed.value === 'draw4') {
      newGameObject.playerList[newGameObject.turn - 1].cardCount += (4 * newGameObject.lastPlaySize);
    }

    setInPlay([]);
    setDirection("none");
    updateGame(newGameObject);
  };

  const getHandLength = (index) => {
    if (gameObject === undefined) {
      return 8;
    }
    let otherPlayers = [...gameObject.playerList];
    while (otherPlayers[0].id !== playerID) {
      let temp = otherPlayers.shift();
      otherPlayers.push(temp);
    }
    otherPlayers.shift();

    if (otherPlayers.length === 1) {
      if (index === 1) {
        return otherPlayers[0].cardCount;
      }
      return 0;
    }

    if (otherPlayers.length <= index) {
      return 0;
    }
    else {
      return otherPlayers[index].cardCount;
    }
  }

  const setPlayerName = (index) => {
    if (gameObject === undefined) {
      return "";
    }
    let otherPlayers = [...gameObject.playerList];
    while (otherPlayers[0].id !== playerID) {
      let temp = otherPlayers.shift();
      otherPlayers.push(temp);
    }
    otherPlayers.shift();

    if (otherPlayers.length === 1) {
      if (index === 1) {
        return otherPlayers[0].name;
      }
      return "";
    }

    if (otherPlayers.length <= index) {
      return "";
    }
    else {
      return otherPlayers[index].name;
    }
  }

  const backgrounds = {
    "Black wood": "https://github.com/EricNavar/among-us-2-2/blob/master/Wood.png?raw=true",
    "Among Us": "https://cdn1.epicgames.com/salesEvent/salesEvent/amoguslandscape_2560x1440-3fac17e8bb45d81ec9b2c24655758075",
    "Sand": "https://images.unsplash.com/photo-1550684376-efcbd6e3f031?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxleHBsb3JlLWZlZWR8MTJ8fHxlbnwwfHx8fA%3D%3D&w=1000&q=80",
    "Dancing": "https://raw.githubusercontent.com/EricNavar/among-us-2-2/master/among-us.gif",
    "SSD": "https://raw.githubusercontent.com/EricNavar/among-us-2-2/master/ssdpng.png",
  }
  const [selectedBackground, setSelectedBackground] = useState("Black wood");

  return (
    <>
      <PlayScreenMain background={backgrounds[selectedBackground]}>
        <TopPlayerUsername hidden={setPlayerName(1) === 0}>{setPlayerName(1)}</TopPlayerUsername>
        <TopPlayerHandContainer>
          <div hidden={setPlayerName(1) === 0} style={{ display: 'max-content' }}>
            {Array.apply(null, { length: getHandLength(1) }).map((card, index) => <HiddenCard key={index} />)}
          </div>
        </TopPlayerHandContainer>
        <LeftPlayerUsername hidden={setPlayerName(0) === 0}>{setPlayerName(0)}</LeftPlayerUsername>
        <LeftPlayerHandContainer hidden={setPlayerName(0) === 0} style={{ width: 'min-content' }}>
          {Array.apply(null, { length: getHandLength(0) }).map((card, index) => <HiddenCard key={index} />)}
        </LeftPlayerHandContainer>
        <RightPlayerUsername hidden={setPlayerName(2) === 0}>{setPlayerName(2)}</RightPlayerUsername>
        <RightPlayerHandContainer hidden={setPlayerName(2) === 0} style={{ width: 'min-content' }}>
          {Array.apply(null, { length: getHandLength(2) }).map((card, index) => <HiddenCard key={index} />)}
        </RightPlayerHandContainer>

        {inPlay.length > 0 &&
          <>
            <CardDropper>
              <div style={{ width: 'max-content' }}>
                {topOfStack &&
                  <CardButton onClick={() => { console.log("click"); }} {...topOfStack} />
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
                onClick={() =>
                  onClickCardButton(card, hand, setHand, inPlay, setInPlay, setTopOfStack, lastCardPlayed, direction)
                }
                {...card}
                myTurn={myTurn}
              />;
            })}
          </div>
        </HandContainer>
        <Center>
          <p style={{
            transition: shouldTransition ? "all 1s" : "",
            backgroundColor: `${color}`,
          }}>{centerText}</p>
          <div style={{ display: 'flex' }}>
            <Card id="discard-pile" color={lastCardPlayed.color} value={lastCardPlayed.value} />
            <CardButton id="draw-pile" onClick={onClickDrawPile} color="rainbow" gray={false} value="wild" myTurn={true}>
              Draw
            </CardButton>
          </div>
        </Center>
      </PlayScreenMain>
      <Modal open={colorPickerOpen} setOpen={setColorPickerOpen} setNextColor={setNextColor} ModalComponent={ColorPicker} />
      <Modal open={endingModalOpen} setOpen={setEndingModalOpen} ModalComponent={EndingModal} isHost={host} restartGame={restartGame} />
      <Modal
        open={lobbyModalOpen}
        setOpen={setLobbyModalOpen}
        ModalComponent={LobbyModal}
        players={gameObjectPlayerNames}
        isHost={host}
        startGame={startGame}
        room={room}
      />
      <SettingsButton selectedBackground={selectedBackground} setSelectedBackground={setSelectedBackground} backgrounds={backgrounds} />
    </>
  );
}
PlayScreen.propTypes = {
  name: PropTypes.string,
  playerID: PropTypes.string
};

export { PlayScreen };
