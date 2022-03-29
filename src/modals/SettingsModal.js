import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { MusicPlayer } from '../MusicPlayer';

const Title = styled.h2`
  width: 100%;
  font-weight: bold;
  textAlign: center;
  margin: 8px;
  color: black;
`;

export function SettingsModal(props) {
  const onClick = (backgroundName) => {
    props.setSelectedBackground(backgroundName);
  };

  return (
    <>
      <Title>
        Settings
      </Title>
      <h2>Music</h2>
      <MusicPlayer url="http://streaming.tdiradio.com:8000/house.mp3" />
      <h2>
        Choose a board map
      </h2>
      {Object.keys(props.backgrounds).map((backgroundName, index) =>
        <button key={index} onClick={() => onClick(backgroundName)}>{backgroundName}</button>
      )}
    </>
  );
}
SettingsModal.propTypes = {
  backgrounds: PropTypes.object.isRequired,
  setSelectedBackground: PropTypes.func
};
