import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { Button, ModalTitle } from '../commonStyles';

const PlayerCard = styled.div`
  box-shadow: rgb(38, 57, 77) 0px 20px 30px -10px;
  border-radius: 8px;
  width: 120px;
  height: 60px;
  color: white;
  display: grid;
  align-items: center;
  border-width: .5px;
  border-style: solid;
  border-color: white;
`;

const PlayerCardWrapper = styled.div`
  display: inline-flex;
  width: 50%;   
  height: 50%;
  justify-content: center;
  align-items: center;
  height: 120px;
`;

const PlayersContainer = styled.div`
  width: 100%;
`

const StartGameButton = styled(Button)`
  margin-left: auto;
  margin-right: auto;
`

export function LobbyModal(props) {
  const { isHost, players, room } = props;
  if (players !== undefined && players[0]) {
    return (
      <>
        <ModalTitle>
          {players[0]}&apos;s lobby
        </ModalTitle>
        <ModalTitle style={{ fontSize: "120%", margin: "0px" }}>Room Code: {room}</ModalTitle>
        <PlayersContainer id="hello">
          {players.map((player, index) =>
            <PlayerCardWrapper key={index}>
              <PlayerCard>
                <p>{player}</p>
              </PlayerCard>
            </PlayerCardWrapper>
          )}
        </PlayersContainer>
        {isHost &&
          <StartGameButton onClick={() => props.startGame()}>
            START GAME
          </StartGameButton>
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
  startGame: PropTypes.func.isRequired,
  room: PropTypes.string,
};
