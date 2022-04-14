import styled, { keyframes } from 'styled-components';
import defaultBackground from './assets/backgroundTransparent.png';

export const Button = styled.button`
  padding: 10px;
  border: 0;
  color: white;
  background-color: #5b6eb5;
  font-size: 1.5rem;
  border-radius: 4px;
  height: fit-content;
`;

export const ModalTitle = styled.h2`
  width: 100%;
  font-weight: bold;
  text-align: center;
  margin: 0;
  color: white;
  height: fit-content;
`;

const rainbowAnim = keyframes`
  from {
    filter: hue-rotate(0deg);
  }
  to {
    filter: hue-rotate(360deg);
  }
  `;

export const Background = styled.div`
  background-image: url(${props => props.file});
  background-color: black;
  /* background-size: 1000px; */
  background-size: ${props => props.file === defaultBackground ? "1000px" : "100%"};
  height: 100vh;
  width: 100vw;
  animation: ${rainbowAnim} 8s infinite linear;
  position: absolute;
  top: 0;
  z-index: -1;
`
