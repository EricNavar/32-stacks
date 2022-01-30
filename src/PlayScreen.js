/* eslint-disable no-unused-vars */
import React from 'react';
import styled from 'styled-components'
import { yourCards } from './sampleData.js';
import './PlayScreen.css';
import Logo from './assets/logo.png';

const PlayScreenMain = styled.main`
  justify-content:center;
  display: grid;
  background-color: #222;
  height: 100vh;
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
  height: 140px;
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

function PlayScreen() {
  const players = 4;

  const yourUserName = "greg";
  const topPlayerName = "eric"
  const leftPlayerName = "mommy"
  const rightPlayerName = "daddy"

  const [hand, setHand] = React.useState(yourCards);
  const [topPlayerCardCount, setTopPlayerCardCount] = React.useState(5);
  const [leftPlayerCardCount, setLeftPlayerCardCount] = React.useState(5);
  const [rightPlayerCardCount, setRightPlayerCardCount] = React.useState(5);

  const [lastColor, setLastColor] = React.useState("red");
  const [lastValue, setLastValue] = React.useState("1");

  const myHandOffset = (hand.length * 70) / 2;

  return (
    <PlayScreenMain>
      <TopPlayerHandContainer>
        <div style={{display:'max-content'}}>
          {Array.apply(null, { length: topPlayerCardCount }).map(card => <HiddenCard className="card"/>)}
        </div>
      </TopPlayerHandContainer>
      <TopPlayerUsername className='username'>{topPlayerName}</TopPlayerUsername>
      <LeftPlayerUsername className='username'>{leftPlayerName}</LeftPlayerUsername>
      <LeftPlayerHandContainer>
        <div style={{display:'max-content', transform: 'rotate(90deg)'}}>
          {Array.apply(null, { length: topPlayerCardCount }).map(card => <HiddenCard className="card"/>)}
        </div>
      </LeftPlayerHandContainer>
      <RightPlayerUsername className='username'>{rightPlayerName}</RightPlayerUsername>
      <RightPlayerHandContainer>
        <div style={{display:'max-content', transform: 'rotate(-90deg)'}}>
          {Array.apply(null, { length: rightPlayerCardCount }).map(card => <HiddenCard className="card"/>)}
        </div>
      </RightPlayerHandContainer>
      <HandContainer style={{left:`calc(50% - ${myHandOffset}px`}}>
        <div style={{width:'max-content'}}>
          {hand.map((card,index) => 
            <button onClick={()=>{console.log("click")}} className="clickableCard">
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
  );
}

export { PlayScreen }
