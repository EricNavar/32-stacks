import React from 'react';
import styled from 'styled-components';

const GameRulesMain = styled.main`
  line-height: 1.5rem;
  border-radius: 8px;
  background-color: black;
  box-shadow: blue 0px 0px 0px 2px inset, rgb(0, 0, 0) 10px -10px 0px -3px, rgb(31, 193, 27) 10px -10px, rgb(0, 0, 0) 20px -20px 0px -3px, rgb(255, 217, 19) 20px -20px, rgb(0, 0, 0) 30px -30px 0px -3px, rgb(255, 156, 85) 30px -30px, rgb(0, 0, 0) 40px -40px 0px -3px, rgb(255, 85, 85) 40px -40px;
  color: white;
  padding-top: 12px;
  padding-bottom: 12px;
  padding-left: 30px;
  padding-right: 30px;
  max-width: 800px;
  margin-top: 3rem;
  margin-left: auto;
  margin-right: auto;
  font-size: 1.2rem;
  & li {
    margin-bottom: 10px;
  }
`;

const Title = styled.h1`
  font-weight: bold;
  text-align: center;
`;

function GameRules() {
  return (
    <GameRulesMain>
      <Title>
        32Stacks Game Rules
      </Title>
      <p>
        This is like a cooler version of Uno. When your turn starts, you play your first card according to regular Uno rules. After that, you can play keep playing additional cards. Each additional card must follow one of the following rules:
      </p>
      <ul>
        <li>
          The card is the same number as the previous card you put down.
        </li>
        <li>
          If you place a non-wild card, you can place additional cards to create an streak of cards of increasing value or decreasing value. For example, if you put down 3, you can then put down 4,5,6... or you can then put down 2,1,0...
        </li>
        <li>
          Your streak can overflow and underflow. If you put down 2,1,0, then you can then put down 9 and continue with a decreasing streak. Similarly, another valid streak is 7,8,9,0,1,2...
        </li>
        <li>
          You can create a streak of the following special cards: Draw 4, Draw 2, Skip, and Reverse. Put down as many as you like, but you can't mix special cards in a streak.
        </li>
        <li>
          You win by putting down all your cards.
        </li>
      </ul>
    </GameRulesMain>
  );
}

export { GameRules };
