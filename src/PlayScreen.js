import React from 'react';
import styled from 'styled-components'
import {sampleData} from './sampleData.js';
import './PlayScreen.css';
import Logo from './assets/logo.png';

const LastCardContainer = styled.div`
  position: absolute;
  bottom: 50%;
  left: 50%
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
  width: 50%;
  left: 25%;
  height: 140px;
  padding-top: 12px;
  padding-bottom: 12px;
  padding-right: 12px;
  padding-left: 32px;
`

const TopPlayerHandContainer = styled.div`
  position: absolute;
  top: 8px;
  left: 50%;
`

const HiddenCard = styled.div`
  border-color: white;
  background-color: black;
  background-image: url(${Logo});
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
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
  //what cards you have in your hand
  const [hand, setHand] = React.useState(sampleData[yourUserName]);
  const [lastColor, setLastColor] = React.useState("red");
  const [lastValue, setLastValue] = React.useState("1");
  const players = 2;

  return (
    <div>
      <TopPlayerHandContainer>
        <div>
          {sampleData[topPlayerName].map((card,index) => <HiddenCard className="card"/>)}
        </div>
      </TopPlayerHandContainer>
      <LastCardContainer>
        <Card color={lastColor} value={lastValue} />
      </LastCardContainer>
      <HandContainer>
        {hand.map((card,index) => <Card key={index} color={card.c} value={card.v}/>)}
      </HandContainer>
    </div>
  );
}

export { PlayScreen }
