import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { MusicPlayer } from '../MusicPlayer';

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
`;

const Title = styled.h2`
  width: 100%;
  font-weight: bold;
  textAlign: center;
  margin: 8px;
  color: black;
`;

export function SettingsModal(props) {
  if (props.open) {
    return (
      <Modal>
        <Title>
          Settings
        </Title>
        <MusicPlayer url="http://streaming.tdiradio.com:8000/house.mp3"/>
      </Modal>
    );
  }
  else {
    return <></>;
  }
}
SettingsModal.propTypes = {
  open: PropTypes.bool.isRequired,
  setNextColor: PropTypes.func.isRequired,
  setColorPickerOpen: PropTypes.func.isRequired
};
