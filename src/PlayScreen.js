import React, { useState, useEffect } from 'react';
import styled from 'styled-components'
import { yourCards, otherPlayers } from './sampleData.js';
import './PlayScreen.css';
import Logo from './assets/logo.png';
import { ColorPicker } from './ColorPicker';
import { EndingModal } from './EndingModal';
import { LobbyModal } from './LobbyModal.js';

import io from 'socket.io-client';
import { useParams, useNavigate } from "react-router-dom";

const ENDPOINT = "http://localhost:5000";
let socket;

const PlayScreenMain = styled.main`
  justify-content:center;
  display: grid;
  background-color: #222;
  height: 100vh;
`

// Drop cards here
const CardDropper = styled.div`
  position: absolute;
  bottom: 200px;
  left: calc(50% - 32px);
  border-style: solid;
  height:
  border-color: black;
  background-color: black;
`

const PlaceCards = styled.div`
  position: absolute;
  bottom: 120:

`

const Center = styled.div`
  position: absolute;
  bottom: 50%;
  left: calc(50% - 58px);
  display: flex;
`

const CardStyledComponent = styled.div`
  padding: 12px;
  border-style: solid;
  border-color: ${props => props.color};
  color: black;
  background-color: white;
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

const HiddenCard = styled.div`
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

const RightPlayerUsername = styled.p`
  right: 16px;
`

const LeftPlayerUsername = styled.p`
  left: 16px;
`

const TopPlayerUsername = styled.p`
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

function Card(props) {
  const {color, value} = props
  return (
    <CardStyledComponent color={color} className="card" >
      <CardText>{value}</CardText>
    </CardStyledComponent>
  );
}

function PlayScreen(props) {
  const myId = 2;
  const [players, setPlayers] = React.useState(otherPlayers);
  const otherPlayerIds = players.filter(player => player.id !== myId).map(player => player.playerId);
  const topPlayerId = otherPlayerIds[0];
  const leftPlayerId = otherPlayerIds[1];
  const rightPlayerId = otherPlayerIds[2];
  
  const [gameObject, setGameObject] = useState();
  useEffect(() => {
    console.log(gameObject)
  }, [gameObject])

  //Socket.io spam sorry guys --------------------------------------------------------------------
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

    //On disconnect
    return () => {
      socket.emit('leave')
      socket.off()
    }
  }, [])

  //Receiving Messages from Socket Server
  useEffect(() => {
    socket.on("gameObjectUpdate", (gameObject) => {
      setGameObject(gameObject)
    })

    socket.on("initialGameObject", (gameObject) => {
      setGameObject(gameObject)
    })
  })

  //End of Socket.io spam ----------------------------------------------------

  const yourUserName = props.name;

  const [hand, setHand] = React.useState(yourCards);

  const [lastColor, setLastColor] = React.useState("red");
  const [lastValue, setLastValue] = React.useState("1");

  const [colorPickerOpen, setColorPickerOpen] = React.useState(false);
  const [nextColor, setNextColor] = React.useState("red");

  const [endingModalOpen, setEndingModalOpen] = React.useState(false);
  const [lobbyModalOpen, setLobbyModalOpen] = React.useState(false);

  const myHandOffset = (hand.length * 70) / 2;

  return (
    <>
    <PlayScreenMain>
      <TopPlayerHandContainer>
        <div style={{display:'max-content'}}>
          {Array.apply(null, { length: players[topPlayerId].cardCount }).map((card,index) => <HiddenCard key={index} className="card"/>)}
        </div>
      </TopPlayerHandContainer>
      <TopPlayerUsername className='username'>{players[topPlayerId].name}</TopPlayerUsername>
      <LeftPlayerUsername className='username'>{players[leftPlayerId].name}</LeftPlayerUsername>
      <LeftPlayerHandContainer>
        <div style={{display:'max-content', transform: 'rotate(90deg)'}}>
          {Array.apply(null, { length: players[leftPlayerId].cardCount }).map((card,index) => <HiddenCard key={index} className="card"/>)}
        </div>
      </LeftPlayerHandContainer>
      <RightPlayerUsername className='username'>{players[rightPlayerId].name}</RightPlayerUsername>
      <RightPlayerHandContainer>
        <div style={{display:'max-content', transform: 'rotate(-90deg)'}}>
          {Array.apply(null, { length: players[rightPlayerId].cardCount }).map((card,index) => <HiddenCard key={index} className="card"/>)}
        </div>
      </RightPlayerHandContainer>
      
      <CardDropper className='card'></CardDropper>
      <PlaceCards className='placeCards'>
        Place Cards!
      </PlaceCards>

      <HandContainer style={{left:`calc(50% - ${myHandOffset}px`}}>
        <div style={{width:'max-content'}}>
          {hand.map((card,index) => 
            <button key={index} onClick={()=>{console.log("click")}} className="clickableCard">
              <Card key={index} color={card.c} value={card.v}/>
            </button>
          )}
        </div>
      </HandContainer>
      <Center>
        <Card color={lastColor} value={lastValue}/>
        <HiddenCard className="card pile" style={{marginLeft: 8}}/>
      </Center>
      <CallUnoButton>
        CALL UNO
      </CallUnoButton>
    </PlayScreenMain>
    <ColorPicker open={colorPickerOpen} setNextColor={setNextColor} setColorPickerOpen={setColorPickerOpen} />
    <EndingModal open={colorPickerOpen} />
    <LobbyModal open={lobbyModalOpen} players={players} isHost={true} />
    <button onClick={e=>setLobbyModalOpen(!lobbyModalOpen)}>click me</button>
    </>
  );
}

export { PlayScreen }
