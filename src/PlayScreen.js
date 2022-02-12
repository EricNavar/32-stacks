/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import styled from 'styled-components'
import PropTypes from 'prop-types';
import io from 'socket.io-client';
import { useParams, useNavigate } from "react-router-dom";
//import local stuff later
import { inPlayTemp } from './sampleData.js';
import { placeCard, drawCard, canPlaceCard } from './logic/gameLogic';
import { yourCards, otherPlayers } from './sampleData.js';
import { ColorPicker } from './modals/ColorPicker';
import { EndingModal } from './modals/EndingModal';
import { LobbyModal } from './modals/LobbyModal.js';
import Logo from './assets/logo.png';

const ENDPOINT = "http://localhost:5000";
let socket;

const PlayScreenMain = styled.main`
  justify-content:center;
  display: grid;
  background-color: #222;
  height: 100vh;
`

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
  margin-left: -20px; /* fix later? */
  justify-content: center;
  align-items: center;
  bottom: 140px;
  left: calc(50% - 90px);
`

const Center = styled.div`
  position: absolute;
  bottom: 50%;
  left: calc(50% - 58px);
  display: flex;
`

const StyledCard = styled.div`
  border-radius: 6px;
  border-style: solid;
  display: inline-flex;
  width: 64px;
  height: 90px;
  box-shadow: rgba(6, 24, 44, 0.4) 0px 0px 0px 2px, rgba(6, 24, 44, 0.65) 0px 4px 6px -1px, rgba(255, 255, 255, 0.08) 0px 1px 0px inset;
  margin-left: -20px;
  box-sizing: border-box;
`

const StyledCardButton = styled.button`
  border-radius: 6px;
  border-style: solid;
  display: inline-flex;
  width: 64px;
  height: 90px;
  box-shadow: rgba(6, 24, 44, 0.4) 0px 0px 0px 2px, rgba(6, 24, 44, 0.65) 0px 4px 6px -1px, rgba(255, 255, 255, 0.08) 0px 1px 0px inset;
  margin-left: -20px;
  box-sizing: border-box;
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
`

const CardComponent = styled(StyledCard)`
  padding: 12px;
  border-style: solid;
  border-color: ${props => props.color};
  color: black;
  background-color: white;
`

const CardButtonStyledComponent = styled(StyledCardButton)`
  padding: 12px;
  border-style: solid;
  border-color: ${props => props.color};
  color: black;
  background-color: white;
  position: relative;
`

const CardText = styled.p`
  font-size: 2rem;
  margin: 0;
`

const HandContainer = styled.div`
  border-style: dashed;
  border-width: 2px;
  border-color: green;
  border-radius: 8px;
  position: absolute;
  bottom: 2px;
  height: 90px;
  padding-top: 12px;
  padding-bottom: 12px;
  padding-right: 12px;
  padding-left: 32px;
  justify-content: center;
  display: grid;
`

const TopPlayerHandContainer = styled.div`
  margin-top: 8px;
  display:grid;
  justify-content: center;
`

const HiddenCard = styled(StyledCard)`
  border-color: white;
  background-color: black;
  background-image: url(${Logo});
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
`

const LeftPlayerHandContainer = styled.div`
  position: absolute;
  top: calc(50% - 40px);
`

const RightPlayerHandContainer = styled.div`
  position: absolute;
  top: calc(50% - 40px);
  right: 0;
`

const Username = styled.p`
  margin: 0;
  font-weight: bold;
  font-size: 1.4rem;
  color: white;
  top: calc(50% - 150px);
  position: absolute;
`

const RightPlayerUsername = styled(Username)`
  right: 16px;
`

const LeftPlayerUsername = styled(Username)`
  left: 16px;
`

const TopPlayerUsername = styled(Username)`
  top: 100px;
  left: calc(50% - 50px);
  width: 100px;
`

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
`
const BlackBox = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  opacity: ${props => props.gray ? "50%" : "0%"};
  background-color: black;
  top: 0;
  left: 0;
`

const Pile = styled(StyledCard)`
  box-shadow: rgba(255, 0, 0, 0.4) 5px 5px, rgba(255, 255, 0, 0.3) 10px 10px, rgba(0, 255, 0, 0.2) 15px 15px, rgba(0, 0, 255, 0.1) 20px 20px, rgba(255, 255, 255, 0.05) 25px 25px;
`

const DrawPile = styled(Pile)`
  margin-left: 8px;
`

function Card(props) {
  const {color, value} = props
  return (
    <CardComponent color={color} >
      <CardText>{value}</CardText>
    </CardComponent>
  );
}
Card.propTypes = {
  color: PropTypes.string,
  value: PropTypes.string
}

function CardButton(props) {
  const {color, value, gray} = props;
  return (
    <CardButtonStyledComponent onClick={props.onClick} color={color} disabled={gray}>
      <CardText>{value}</CardText>
      <BlackBox gray={gray}></BlackBox>
    </CardButtonStyledComponent>
  );
}
CardButton.propTypes = {
  color: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  gray: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired
}

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
      console.log(gameObject)
      setGameObjectPlayers(gameObject.playerList.map(player => player.name))
      if (host === false && gameObject.playerList[0].name === props.name) {
        console.log("I am the host!")
        setHost(true)
      }
      if (lobbyModalOpen && gameObject.gameStart) {
        setLobbyModalOpen(false)
      }
    }
  }, [gameObject])

  const startGame = () => {
    let temp = {...gameObject}
    temp.gameStart = true
    setLobbyModalOpen(false)
  }

  //Socket.io --------------------------------------------------------------------
  const { room } = useParams();
  const navigate = useNavigate();

  //Initial Socket Connection
  useEffect(() => {
    const connectionOptions =  {
      "forceNew" : true,
      "reconnectionAttempts": "Infinity", 
      "timeout" : 10000,                  
      "transports" : ["websocket"]
    }
    socket = io.connect(ENDPOINT, connectionOptions)

    socket.emit('join', {room: room, name: props.name}, (error) => {
      if (error) {
        console.log("error")
        navigate('/');
      }
      else {
        console.log("Successfully connected to room")
      }
    })
  }, [])

  //Receiving Messages from Socket Server
  useEffect(() => {
    socket.on("gameObjectUpdate", (newGameObject) => {
      setGameObject(newGameObject)
    })

    socket.on("initialGameObject", (newGameObject) => {
      setGameObject(newGameObject)
    })

    socket.on("playerLeft", (newLobby) => {
      setGameObject(previousGameObject => {
        const newGameObject = {...previousGameObject}
        const newList = previousGameObject.playerList.filter(player => player.name !== newLobby.leftPlayer)
        newGameObject.playerList = newList
        return newGameObject
      })
    })
  }, [])

  //Updating Game Object with Game Actions
  const [lobbyModalOpen, setLobbyModalOpen] = useState(true);

  const updateGame = (newGameObject) => {
    if (newGameObject !== undefined) {
      socket.emit('updateGame', newGameObject)
    }
  }

  useEffect(() => {
    if (gameObject !== undefined && host) {
      let temp = {...gameObject}
      temp.gameStart = true
      updateGame(temp)
    }
  }, [lobbyModalOpen])

  //End of Socket.io ----------------------------------------------------

  const yourUserName = props.name;

  const [hand, setHand] = React.useState(yourCards);
  const [inPlay, setInPlay] = React.useState(inPlayTemp);
  const [topOfStack, setTopOfStack] = React.useState(null);

  // if this player has a card available to put down
  //who's turn is it? It stores a number 0 through 4, representing the player ID
  const [turn, setTurn] = React.useState(0);

  const [lastCardPlayed, setLastCardPlayed] = React.useState({
    c:"red",
    v:'3',
    gray:false
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
  }

  return (
    <>
      <PlayScreenMain>
        <TopPlayerHandContainer>
          <div style={{display:'max-content'}}>
            {Array.apply(null, { length: players[topPlayerId].cardCount }).map((card,index) => <HiddenCard key={index} />)}
          </div>
        </TopPlayerHandContainer>
        <TopPlayerUsername >{players[topPlayerId].name}</TopPlayerUsername>
        <LeftPlayerUsername >{players[leftPlayerId].name}</LeftPlayerUsername>
        <LeftPlayerHandContainer>
          <div style={{display:'max-content', transform: 'rotate(90deg)'}}>
            {Array.apply(null, { length: players[leftPlayerId].cardCount }).map((card,index) => <HiddenCard key={index} />)}
          </div>
        </LeftPlayerHandContainer>
        <RightPlayerUsername >{players[rightPlayerId].name}</RightPlayerUsername>
        <RightPlayerHandContainer>
          <div style={{display:'max-content', transform: 'rotate(-90deg)'}}>
            {Array.apply(null, { length: players[rightPlayerId].cardCount }).map((card,index) => <HiddenCard key={index} />)}
          </div>
        </RightPlayerHandContainer>
        
        <CardDropper>
          <div style={{width:'max-content'}}>
            {topOfStack &&
              <CardButton onClick={()=>{console.log("click")}} color={topOfStack.c} value={topOfStack.v} gray={topOfStack.gray}/>
            }
          </div>
        </CardDropper>
        <PlaceCards disabled>
          Place Cards!
        </PlaceCards>

        <HandContainer style={{left:`calc(50% - ${myHandOffset}px`}}>
          <div style={{width:'max-content'}}>
            {hand.map((card,index) => {
              return <CardButton id={`card-button-${index}`} key={index} onClick={e=>placeCard(card, hand, inPlay, setInPlay, setTopOfStack, lastCardPlayed)} color={card.c} value={card.v} gray={card.gray}/>
            })}
          </div>
        </HandContainer>
        <Center>
          <Card id="discard-pile"color={setLastCardPlayed.c} value={setLastCardPlayed.v}/>
          <button onClick={onClickDrawPile}>
            <DrawPile id="draw-pile"/>
          </button>
        </Center>
        <CallUnoButton>
          CALL UNO
        </CallUnoButton>
      </PlayScreenMain>
      <ColorPicker open={colorPickerOpen} setNextColor={setNextColor} setColorPickerOpen={setColorPickerOpen} />
      <EndingModal open={colorPickerOpen} />
      <LobbyModal open={lobbyModalOpen} players={gameObjectPlayers} isHost={host} startGame={startGame} />
    </>
  );
}
PlayScreen.propTypes = {
  name: PropTypes.string,
}

export { PlayScreen }
