import React from 'react';
import PropTypes from 'prop-types';
import { Button, ModalTitle } from '../commonStyles';

export function EndingModal(props) {
  const { isHost, restartGame } = props;
  return (
    <>
      <ModalTitle>Game Over</ModalTitle>
      {isHost &&
        <div>
          <Button onClick={restartGame}>
            Play again
          </Button>
        </div>
      }
    </>
  );
}
EndingModal.propTypes = {
  isHost: PropTypes.bool.isRequired,
  restartGame: PropTypes.func.isRequired,
};