/* eslint-disable no-unused-vars */
import React from 'react';
import styled from 'styled-components'
import { yourCards } from './sampleData.js';
import { inPlayTemp } from './sampleData.js';
import './PlayScreen.css';
import Logo from './assets/logo.png';
import {placeCard} from './gameLogic';

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

const PlaceCards = styled.button`
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

const CardButtonStyledComponent = styled.button`
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
const BlackBox = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  opacity: ${props => props.gray ? "50%" : "0%"};
  background-color: black;
  top: 0;
  left: 0;
`

function Card(props) {
  const {color, value} = props
  return (
    <CardStyledComponent color={color} className="card" >
      <CardText>{value}</CardText>
    </CardStyledComponent>
  );
}

function CardButton(props) {
  const {color, value, gray} = props;
  return (
    <CardButtonStyledComponent onClick={props.onClick} color={color}  className="card" disabled={gray}>
      <CardText>{value}</CardText>
      <BlackBox gray={gray}></BlackBox>
    </CardButtonStyledComponent>
  );
}

function PlayScreen() {
  const players = 4;

  const yourUserName = "greg";
  const topPlayerName = "eric"
  const leftPlayerName = "mommy"
  const rightPlayerName = "daddy"

  const [hand, setHand] = React.useState(yourCards);
  const [inPlay, setInPlay] = React.useState(inPlayTemp);
  const [topPlayerCardCount, setTopPlayerCardCount] = React.useState(5);
  const [leftPlayerCardCount, setLeftPlayerCardCount] = React.useState(5);
  const [rightPlayerCardCount, setRightPlayerCardCount] = React.useState(5);
  const [topOfStack, setTopOfStack] = React.useState(null);


  const [lastCardPlayed, setLastCardPlayed] = React.useState({
    c:"red",
    v:'3',
    gray:false
  });

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
        <div style={{display:'max-  content', transform: 'rotate(90deg)'}}>
          {Array.apply(null, { length: topPlayerCardCount }).map(card => <HiddenCard className="card"/>)}
        </div>``
      </LeftPlayerHandContainer>
      <RightPlayerUsername className='username'>{rightPlayerName}</RightPlayerUsername>
      <RightPlayerHandContainer>
        <div style={{display:'max-content', transform: 'rotate(-90deg)'}}>
          {Array.apply(null, { length: rightPlayerCardCount }).map(card => <HiddenCard className="card"/>)}
        </div>
      </RightPlayerHandContainer>
      
      <CardDropper className='card'>
        <div style={{width:'max-content'}}>
          {topOfStack &&
            <CardButton onClick={()=>{console.log("click")}} color={topOfStack.c} value={topOfStack.v} gray={topOfStack.gray}/>
          }
        </div>
      </CardDropper>
      <PlaceCards className='placeCards' disabled>
        Place Cards!
      </PlaceCards>

      <HandContainer style={{left:`calc(50% - ${myHandOffset}px`}}>
        <div style={{width:'max-content'}}>
          {hand.map((card,index) => {
            console.log(index);
            console.log(placeCard)
            return <CardButton id={`card-button-${index}`} key={index} onClick={e=>placeCard(card, hand, inPlay, setInPlay, setTopOfStack, lastCardPlayed)} color={card.c} value={card.v} gray={card.gray}/>
          }
          )}
        </div>
      </HandContainer>
      <Center>
        <Card color={setLastCardPlayed.c} value={setLastCardPlayed.v}/>
        <HiddenCard className="card pile" style={{marginLeft: 8}}/>
      </Center>
      <CallUnoButton>
        CALL UNO
      </CallUnoButton>
    </PlayScreenMain>
  );
}

export { PlayScreen }
