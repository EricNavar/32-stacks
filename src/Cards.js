import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const StyledCard = styled.div`
  display: inline-flex;
  width: 64px;
  height: 90px;
  box-shadow: rgba(6, 24, 44, 0.4) 0px 0px 0px 2px, rgba(6, 24, 44, 0.65) 0px 4px 6px -1px, rgba(255, 255, 255, 0.08) 0px 1px 0px inset;
  box-sizing: border-box;
  @media (max-width: 600px) {
    width: 60px;
  }
`;

const BlackBox = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  opacity: ${props => props.gray ? "75%" : "0%"};
  background-color: black;
  top: 0;
  left: 0;
`;

const CardComponent = styled(StyledCard)`
  padding: 12px;
  background: url("https://raw.githubusercontent.com/ericnavar/among-us-2-2/master/sand/${props => `${props.value}_${props.color === "rainbow" ? "rainbow" : "red"}`}.jpg");
  background-size: cover;
`;

//this is meant to be a button that wraps around a card
const ButtonWrapper = styled.button`
  margin: 0;
  background: transparent;
  border: 0;
  position: relative;
`

const RedCard = styled(CardComponent)`
  
`;

const YellowCard = styled(CardComponent)`
  filter: hue-rotate(65deg) brightness(1.5);
`;

const GreenCard = styled(CardComponent)`
filter: hue-rotate(145deg);
`;

const BlueCard = styled(CardComponent)`
  filter: hue-rotate(235deg);
`;

function Card(props) {
  const { color, value } = props;

  let ColoredCardComponent = CardComponent;
  if (color === "red") { ColoredCardComponent = RedCard; }
  else if (color === "yellow") { ColoredCardComponent = YellowCard; }
  else if (color === "green") { ColoredCardComponent = GreenCard; }
  else if (color === "blue") { ColoredCardComponent = BlueCard; }

  return (<ColoredCardComponent color={color} value={value} />);
}
Card.propTypes = {
  color: PropTypes.string,
  value: PropTypes.string
};

export { Card };

function CardButton(props) {
  const { color, value, gray, myTurn, onClick } = props;
  return (
    <ButtonWrapper onClick={onClick} disabled={!myTurn || gray}>
      <Card color={color} value={value} />
      <BlackBox gray={gray}></BlackBox>
    </ButtonWrapper>
  );
}
CardButton.propTypes = {
  color: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  gray: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
  myTurn: PropTypes.bool,
};

export { CardButton };
