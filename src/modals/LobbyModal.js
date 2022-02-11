import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const Modal = styled.div`
  border-radius: 8px;
  box-shadow: box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
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
`

const Title = styled.h2`
  width: 100%;
  font-weight: bold;
  textAlign: center;
  margin: 8px;
  color: black;
`

const StartButton = styled.button`
  padding: 8px;
  border: 0;
  color: white;
  background-color: blue;
  font-size: 1.5rem;
`

const PlayerCard = styled.div`
  box-shadow: rgb(85, 91, 255) 0px 0px 0px 3px, rgb(31, 193, 27) 0px 0px 0px 6px, rgb(255, 217, 19) 0px 0px 0px 9px, rgb(255, 156, 85) 0px 0px 0px 12px, rgb(255, 85, 85) 0px 0px 0px 15px;
  border-radius: 8px;
  width: 120px;
  height: 60px;
  color: black;
`

const PlayerCardWrapper = styled.div`
  display: inline-flex;
  width: 50%;
  height: 50%;
  justify-content: center;
  align-items: center;
  height: 120px;
`

export function LobbyModal(props) {
  const {isHost, players} = props;
  if (props.open) {
    return (
      <Modal>
        <Title>
          {players[0].name}&apos;s lobby
        </Title>
        {players.map(player => 
          <PlayerCardWrapper>
            <PlayerCard>
              <p>{player.name}</p>
            </PlayerCard>  
          </PlayerCardWrapper>
        )}
        {isHost && <StartButton>
          START GAME
        </StartButton>}
      </Modal>
    );
  }
  else {
    return <></>;
  }
}
LobbyModal.propTypes = {
  isHost: PropTypes.bool.isRequired,
  players: PropTypes.object.isRequired
}
