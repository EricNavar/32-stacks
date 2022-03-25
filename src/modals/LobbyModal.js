import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import {Button, ModalTitle} from '../commonStyles';

const Modal = styled.div`
  border-radius: 8px;
  box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
  background-color: white;
  padding: 12px;
  max-width: 90vh;
  max-height: 90vw;
  width: 426px;
  height: 306px;
  z-index: 100;
  position: absolute;
  top: calc(50vh - 213px);
  left: calc(50vw - 223px);
  text-align: center;
`;

const PlayerCard = styled.div`
  box-shadow: rgb(38, 57, 77) 0px 20px 30px -10px;
  border-radius: 8px;
  width: 120px;
  height: 60px;
  color: black;
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
  const {isHost, players} = props;
  if (players !== undefined && players[0]) {
    console.log("Players")
    return (
      <Modal>
        <ModalTitle>
          {players[0]}&apos;s lobby
        </ModalTitle>
        {players.map((player,index) => 
          <PlayerCardWrapper key={index}>
            <PlayerCard>
              <p>{player}</p>
            </PlayerCard>  
          </PlayerCardWrapper>
        )}
        {isHost && <Button onClick={() => props.startGame()}>
          START GAME
        </Button>}
      </Modal>
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
