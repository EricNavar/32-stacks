import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { Button, ModalTitle } from '../commonStyles';

const PlayerCard = styled.div`
  box-shadow: rgb(38, 57, 77) 0px 20px 30px -10px;
  border-radius: 8px;
  width: 120px;
  height: 60px;
  color: black;
  display: grid;
  align-items: center;
`;

const PlayerCardWrapper = styled.div`
  display: inline-flex;
  width: 50%;   
  height: 50%;
  justify-content: center;
  align-items: center;
  height: 120px;
`;

export function LobbyModal(props) {
  const { isHost, players } = props;
  if (players !== undefined && players[0]) {
    return (
      <>
        <ModalTitle>
          {players[0]}&apos;s lobby
        </ModalTitle>
        {players.map((player, index) =>
          <PlayerCardWrapper key={index}>
            <PlayerCard>
              <p>{player}</p>
            </PlayerCard>
          </PlayerCardWrapper>
        )}
        {isHost &&
          <div>
            <Button onClick={() => props.startGame()}>
              START GAME
            </Button>
          </div>
        }
      </>
    );
  }
  else {
    return <>No players in lobby</>;
  }
}
LobbyModal.propTypes = {
  isHost: PropTypes.bool.isRequired,
  players: PropTypes.array,
  startGame: PropTypes.func.isRequired
};
