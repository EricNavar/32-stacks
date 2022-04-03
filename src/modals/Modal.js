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
 
  border-radius: 24px;
  box-shadow: 0px 20px 30px -10px rgb(38, 57, 77);
  max-width: 90vh;
  max-height: 90vw;
  width: 466px;
  height: 466px;
  position: absolute;
  top: calc(50vh - 213px);
  left: calc(50vw - 223px);
  
  color: white;
  text-align: center;
  background: linear-gradient(
    90deg,
    rgba(255, 0, 0, 1) 0%,
    rgba(255, 154, 0, 1) 10%,
    rgba(208, 222, 33, 1) 20%,
    rgba(79, 220, 74, 1) 30%,
    rgba(63, 218, 216, 1) 40%,
    rgba(47, 201, 226, 1) 50%,
    rgba(28, 127, 238, 1) 60%,
    rgba(95, 21, 242, 1) 70%,
    rgba(186, 12, 248, 1) 80%,
    rgba(251, 7, 217, 1) 90%,
    rgba(255, 0, 0, 1) 100%
  );
  overflow: hidden;

`;

const ModalPaperDiv = styled.div`
  display: flex-root;
  border-radius: 24px;
  background-color: black;
  height: 98%;
  width: 98%;
  margin: 1%;
  padding: 12px;
  box-sizing: border-box;
`;

export function Modal(props) {
  const { open, ModalComponent, zIndex, ...otherProps } = props;
  if (open) {
    return (
      <Background zIndex={zIndex}>
        <ModalPaper>
          <ModalPaperDiv>
            <ModalComponent {...otherProps} />
          </ModalPaperDiv>
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
