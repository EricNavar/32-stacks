import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

//DialogPaper is a styled div that will be the contain the dialog content.

const ModalPaper = styled.div`
  border-radius: 24px;
  box-shadow: 0px 20px 30px -10px rgb(38, 57, 77);
  max-width: 90vh;
  max-height: 90vh;
  max-width: calc(100% - 32px);
  position: absolute;
  color: white;
  text-align: center;
  overflow: hidden;
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
`;

const ModalPaperDiv = styled.div`
  display: flex;
  flex-wrap: wrap;
  border-radius: 24px;
  background-color: black;
  height: calc(100% - 16px);
  width: calc(100% - 16px);
  margin: 8px;
  padding: 12px;
  box-sizing: border-box;
  align-content: baseline;
  justify-content: center;
`;

export function DialogPaper(props) {
  const { children } = props;
  return (
    <ModalPaper>
      <ModalPaperDiv>
        {children}
      </ModalPaperDiv>
    </ModalPaper>
  );
}
DialogPaper.propTypes = {
  children: PropTypes.any
}
