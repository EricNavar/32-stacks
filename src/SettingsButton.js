import React from 'react';
import styled from 'styled-components';
import { PropTypes } from 'prop-types';
import { SettingsModal } from './modals/SettingsModal';
import SettingsIcon from './assets/settings-icon';

const SettingsIconButton = styled.button`
  background: white;
  position: absolute;
  top: 12px;
  right: 12px;
  height: 40px;
  width: 40px;
  border-radius: 20px;
  border-style: none;
  z-index: 9999
`;

function SettingsButton(props) {
  const [settingsModalOpen, setSettingsModalOpen] = React.useState(false);

  const onClickSettingsButton = () => {
    setSettingsModalOpen(!settingsModalOpen);
  };

  return (
    <>
      <SettingsIconButton onClick={onClickSettingsButton}>
        <SettingsIcon />
      </SettingsIconButton>
      <SettingsModal open={settingsModalOpen} zIndex={200} backgrounds={props.backgrounds} setSelectedBackground={props.setSelectedBackground} />
    </>
  );
}
SettingsButton.propTypes = {
  backgrounds: PropTypes.object.isRequired,
  setSelectedBackground: PropTypes.func.isRequired,
  selectedBackground: PropTypes.string.isRequired
}

export { SettingsButton };
