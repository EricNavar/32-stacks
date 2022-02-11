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
  height: 446px;
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

const PlayAgainButton = styled.button`
  padding: 8px;
  border: 0;
  color: white;
  background-color: blue;
  font-size: 1.5rem;
`

export function EndingModal(props) {
  if (props.open) {
    return (
      <Modal>
        <Title>
          {props} won!
        </Title>
        <PlayAgainButton>
            Play again
        </PlayAgainButton>
      </Modal>
    );
  }
  else {
    return <></>;
  }
}
EndingModal.propTypes = {
  open: PropTypes.bool.isRequired,
}