import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import {ModalTitle} from '../commonStyles';

const ColorButton = styled.button`
  box-sizing: border-box;
  border-radius: 8px;
  box-shadow: rgba(0, 0, 0, 0.4) 0px 2px 4px, rgba(0, 0, 0, 0.3) 0px 7px 13px -3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset;
  border-color: ${props => props.color};
  background-color: ${props => props.color};
  max-width: 30vw;
  max-height: 30vh;
  width: 180px;
  height: 180px;
  margin: 8px;
`;

export function ColorPicker(props) {
  const colors = ["red", "green", "blue", "yellow"];
  const onClick = (newColor) => {
    props.setNextColor(newColor);
    props.setColorPickerOpen(false);
  };
  return (
    <>
      <ModalTitle>Pick a color</ModalTitle>
      {colors.map(color => <ColorButton key={color} color={color} onClick={() => onClick(color)}></ColorButton>)}
    </>
  );
}
ColorPicker.propTypes = {
  setNextColor: PropTypes.func.isRequired,
  setColorPickerOpen: PropTypes.func.isRequired
};
