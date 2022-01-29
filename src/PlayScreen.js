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

const LastCardContainer = styled.div`
  position: absolute;
  bottom: 50%;
  left: calc(50% - 20px);
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
  transform: rotate(90deg);
`

const RightPlayerHandContainer = styled.div`
  position: absolute;
  top: calc(50% - 40px);
  right: 0;
  transform: rotate(-90deg);
`

function Card(props) {
  console.log(props);
  const color = props.color;
  const value = props.value;
  return (
    <CardStyledComponent color={color} className="card">
      <CardText>{value}</CardText>
    </CardStyledComponent>
  );
}

function PlayScreen() {
  const yourUserName = "greg";
  const topPlayerName = "eric"
  const [topPlayerCardCount, setTopPlayerCardCount] = React.useState(5);
  const [leftPlayerCardCount, setLeftPlayerCardCount] = React.useState(5);
  const [rightPlayerCardCount, setRightPlayerCardCount] = React.useState(5);
  //what cards you have in your hand
  const [hand, setHand] = React.useState(yourCards);
  const [lastColor, setLastColor] = React.useState("red");
  const [lastValue, setLastValue] = React.useState("1");
  const players = 4;

  const myHandOffset = (hand.length * 70) / 2;

  return (
    <PlayScreenMain>
      <TopPlayerHandContainer>
        <div style={{display:'max-content'}}>
          {Array.apply(null, { length: topPlayerCardCount }).map(card => <HiddenCard className="card"/>)}
        </div>
      </TopPlayerHandContainer>
      <LeftPlayerHandContainer>
        <div style={{display:'max-content'}}>
          {Array.apply(null, { length: topPlayerCardCount }).map(card => <HiddenCard className="card"/>)}
        </div>
      </LeftPlayerHandContainer>
      <RightPlayerHandContainer>
        <div style={{display:'max-content'}}>
          {Array.apply(null, { length: topPlayerCardCount }).map(card => <HiddenCard className="card"/>)}
        </div>
      </RightPlayerHandContainer>
      <LastCardContainer>
        <Card color={lastColor} value={lastValue} />
      </LastCardContainer>
      <HandContainer style={{left:`calc(50% - ${myHandOffset}px`}}>
        <div style={{width:'max-content'}}>
          {hand.map((card,index) => <Card key={index} color={card.c} value={card.v}/>)}
        </div>
      </HandContainer>
    </PlayScreenMain>
  );
}

export { PlayScreen }
