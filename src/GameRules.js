import React from 'react';
import styled from 'styled-components';

const GameRulesMain = styled.main`
  margin: 2.5rem;
  line-height: 1.5rem;
  border-radius: 8px;
  background-color: #6b6b6b;
  color: white;
  padding: 12px;
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
          The card is the same number as the previous card you put down
        </li>
        <li>
          You can create an streak of cards of increasing value or decreasing value. For example, if you put down 3, you can also put down 4,5,6... If you get to 0, you can roll back to 0 and keep increasing. Similarly, you could go from 4 to 3,2,1,0,9,8...
        </li>
      </ul>
      <p>
        multiple 2+ cards cards can be used at once
      </p>
    </GameRulesMain>
  );
}

export { GameRules };
