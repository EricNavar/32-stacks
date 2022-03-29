import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const Background = styled.div`
  height: 100vh;
  width: 100vw;
  background: rgba(0,0,0,.5);
  position: absolute;
  z-index: 1;
  top: 0;
  z-index: ${props => props.zIndex};
`

const ModalPaper = styled.div`
  border-radius: 8px;
  box-shadow: rgb(38, 57, 77) 0px 20px 30px -10px;
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
  color: black;
  text-align: center;
`;

export function Modal(props) {
  const { open, ModalComponent, zIndex, ...otherProps } = props;
  if (open) {
    return (
      <Background zIndex={zIndex}>
        <ModalPaper>
          <ModalComponent {...otherProps} />
        </ModalPaper>
      </Background>
    );
  }
  else {
    return <></>;
  }
}
Modal.propTypes = {
  open: PropTypes.bool.isRequired,
  ModalComponent: PropTypes.node.isRequired,
  zIndex: PropTypes.number
};
