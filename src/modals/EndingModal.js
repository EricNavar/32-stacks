import React from 'react';
import PropTypes from 'prop-types';
import { Button, ModalTitle } from '../commonStyles';
import Dialog from '@mui/material/Dialog';
import { DialogPaper } from './DialogPaper';

export function EndingModal(props) {
  const { isHost, restartGame, open } = props;
  return (
    <Dialog open={open} PaperComponent={DialogPaper}>
      <ModalTitle>Game Over</ModalTitle>
      {isHost &&
        <div>
          <Button onClick={restartGame}>
            Play again
          </Button>
        </div>
      }
    </Dialog>
  );
}
EndingModal.propTypes = {
  open: PropTypes.bool.isRequired,
  isHost: PropTypes.bool.isRequired,
  restartGame: PropTypes.func.isRequired,
};