import React from 'react';
import styled from 'styled-components';

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
`

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
`

const Title = styled.h2`
  width: 100%;
  font-weight: bold;
  textAlign: center;
  margin: 8px;
  color: black;
`

export function ColorPicker(props) {
  const colors = ["red","green","blue","yellow"];
  const onClick = (newColor) => {
    props.setNextColor(newColor);
    props.setColorPickerOpen(false);
  }
  if (props.open) {
    return (
      <Modal>
        <Title>
          Pick a color
        </Title>
        {colors.map(color => <ColorButton key={color} color={color} onClick={e=>onClick(color)}></ColorButton>)}
      </Modal>
    );
  }
  else {
    return <></>;
  }
}
