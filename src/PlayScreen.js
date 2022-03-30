/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import PropTypes, { string } from 'prop-types';
import io from 'socket.io-client';
import { useParams, useNavigate } from "react-router-dom";
//import local stuff later
import { placeCard, drawCard, calculateCanPlaceCard, checkHand, isValidFirstCard, chooseRandomNumberCard } from './logic/gameLogic';
import { yourCards, otherPlayers, inPlayTemp } from './sampleData.js';
import { ColorPicker } from './modals/ColorPicker';
import { EndingModal } from './modals/EndingModal';
import { LobbyModal } from './modals/LobbyModal.js';
import { Modal } from './modals/Modal.js';
import Logo from './assets/logo.png';
import { Card, CardButton } from './Cards';

const ENDPOINT = "https://myrpgstats.com";

//Development endpoint
// const ENDPOINT = "http://localhost:8080";

let socket;

const PlayScreenMain = styled.main`
  justify-content:center;
  display: grid;
  background: url("${props => props.selectedBackground}");
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
  const playerID = props.playerID;
  const myId = 0;
  const [players, setPlayers] = React.useState(otherPlayers);
  const otherPlayerIds = players.filter(player => player.id !== myId).map(player => player.playerId);
  //TODO: fix the next 3 statements
  const topPlayerId = otherPlayerIds[0];
  const leftPlayerId = otherPlayerIds[1];
  const rightPlayerId = otherPlayerIds[2];

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
  const [hand, setHand] = React.useState(
    yourCards.map(card => {
      card.gray = !isValidFirstCard(card, lastCardPlayed);
      return card;
    })
  );

  const [colorPickerOpen, setColorPickerOpen] = React.useState(false);
  const [endingModalOpen, setEndingModalOpen] = React.useState(false);
  const [nextColor, setNextColor] = React.useState(lastCardPlayed.color);
  const [canPlaceCard, setCanPlaceCard] = React.useState();


  useEffect(() => {
    if (gameObject !== undefined) {
      setGameObjectPlayerNames(gameObject.playerList.map(player => player.name));
      if (host === false && gameObject.playerList[0].id === playerID) {
        console.log("I am the host!");
        setHost(true);
      }
      if (lobbyModalOpen && gameObject.gameStart) {
        setLobbyModalOpen(false);
        randomizeHand();
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
    let temp = { ...gameObject };
    temp.winner = 'restart';
    randomizeHand();
    updateGame(temp);
  }

  const setPlayerName = (start) => {
    const players = gameObjectPlayerNames.filter(player => player !== props.name)
    let player = players.length > start ? players[start] : "greg's dad";
    return player
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
        updateGame(temp)
      }
      else {
        console.log("Game is over!")
        setCenterText(`Winner: ${gameObject.winner[0].name}!`);
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
        newHand.push(drawCard()); newHand.push(drawCard());
        setHand(checkHand(newHand, gameObject.lastCardPlayed, [], gameObject.direction))
      }
      if (gameObject.lastCardPlayed.value === 'draw4') {
        let newHand = [...hand];
        newHand.push(drawCard()); newHand.push(drawCard()); newHand.push(drawCard()); newHand.push(drawCard());
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
    setHand(checkHand(hand, lastCardPlayed, inPlay, direction));
    if (gameObject !== undefined && gameObject.winner === 0) {
      setCenterText(`Player ${turn}'s turn: ${gameObjectPlayerNames[turn - 1]}`);
    }
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
    if (inPlay.length > 1) {
      const previousStackCard = inPlay[inPlay.length - 2];
      let newDirection = direction;
      if (!isNaN(previousStackCard.value) && !isNaN(card.value) && direction === 'none') {
        if (Number(previousStackCard.value) < Number(card.value)) {
          newDirection = "increasing"
        }
        if (Number(previousStackCard.value) > Number(card.value)) {
          newDirection = "decreasing"
        }
      }
      setDirection(newDirection)
    }

    const checkedHand = checkHand(hand, lastCard, inPlay, direction);
    setHand(checkedHand);
    if (card.color === "rainbow") {
      setColorPickerOpen(true);
    }
  }

  //Place card stack, end turn, and update game object
  const onClickPlaceCards = () => {
    setTopOfStack(inPlay[inPlay.size - 1]);

    let newGameObject = { ...gameObject };
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
        newGameObject.direction = !newGameObject.direction;
      }
      //Updates turn and check skip
      if (newGameObject.direction) {
        newGameObject.turn -= 1;
        if (newGameObject.turn < 1) { newGameObject.turn = 4 }
        if (newGameObject.lastCardPlayed.value === 'skip') { newGameObject.turn -= 1; if (newGameObject.turn < 1) { newGameObject.turn = gameObjectPlayerNames.length } }
      }
      else {
        newGameObject.turn += 1;
        if (newGameObject.turn > gameObjectPlayerNames.length) { newGameObject.turn = 1 }
        if (newGameObject.lastCardPlayed.value === 'skip') { newGameObject.turn += 1; if (newGameObject.turn > gameObjectPlayerNames.length) { newGameObject.turn = 1 } }
      }
    }

    setInPlay([]);
    setDirection("none");
    updateGame(newGameObject);
  };

  return (
    <>
      <PlayScreenMain selectedBackground={props.backgrounds[props.selectedBackground]}>
        <TopPlayerUsername >{setPlayerName(1)}</TopPlayerUsername>
        <TopPlayerHandContainer>
          <div style={{ display: 'max-content' }}>
            {Array.apply(null, { length: players[topPlayerId].cardCount }).map((card, index) => <HiddenCard key={index} />)}
          </div>
        </TopPlayerHandContainer>
        <LeftPlayerUsername >{setPlayerName(0)}</LeftPlayerUsername>
        <LeftPlayerHandContainer style={{ width: 'min-content' }}>
          {Array.apply(null, { length: players[leftPlayerId].cardCount }).map((card, index) => <HiddenCard key={index} />)}
        </LeftPlayerHandContainer>
        <RightPlayerUsername >{setPlayerName(2)}</RightPlayerUsername>
        <RightPlayerHandContainer style={{ width: 'min-content' }}>
          {Array.apply(null, { length: players[rightPlayerId].cardCount }).map((card, index) => <HiddenCard key={index} />)}
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
          <p>{centerText}</p>
          <div style={{ display: 'flex' }}>
            <Card id="discard-pile" color={lastCardPlayed.color} value={lastCardPlayed.value} />
            <CardButton id="draw-pile" onClick={onClickDrawPile} color="rainbow" gray={false} value="wild" myTurn={true}>
              Draw
            </CardButton>
          </div>
        </Center>
        <CallUnoButton>
          CALL UNO
        </CallUnoButton>
      </PlayScreenMain>
      <Modal open={colorPickerOpen} setOpen={setColorPickerOpen} setNextColor={setNextColor} ModalComponent={ColorPicker} />
      <Modal open={endingModalOpen} setOpen={setEndingModalOpen} ModalComponent={EndingModal} isHost={host} restartGame={restartGame} />
      <Modal open={lobbyModalOpen} setOpen={setLobbyModalOpen} ModalComponent={LobbyModal} players={gameObjectPlayerNames} isHost={host} startGame={startGame} />
    </>
  );
}
PlayScreen.propTypes = {
  name: PropTypes.string,
  playerID: PropTypes.string,
  selectedBackground: PropTypes.string.isRequired,
  backgrounds: PropTypes.object.isRequired
};

export { PlayScreen };
