import React from 'react';
import SussyBoi from './assets/sussy-boi.gif';
import Crucifiction from './assets/crucifixtion.jpg';
import styled, { keyframes } from 'styled-components';
import { Background } from './commonStyles';

const resizing = keyframes`
  0% {
    width: 10px;
  }
  25% {
    width: 300px;
  }
  50% {
    width: 150px;
  }
  75% {
    width: 200px;
  }
  100% {
    width: 30px;
  }
`;

const SussyBoiImg = styled.img`
    animation: ${resizing} .2s infinite;
`

const CreditsPage = styled.main`
  cursor: url(//b.thumbs.redditmedia.com/YrGSo9BGOoMTX5rdUbNriLBUTmYhe7bB4yZuSKItEKY.png),auto;
  color: white;
  background: #555;
`

export function Credits() {
  return (
    <>
      <CreditsPage>
        <h1>Eric Navar Cainan Conway Alex Good  Yonas Bahre Eric Navar Cainan Conway Alex Good Yonas Bahre Eric Navar Cainan Conway Alex Good Yonas Bahre Eric Navar Cainan Conway Alex Good Yonas Bahre Eric Navar Cainan Conway Alex Good Yonas Bahre Eric Navar Cainan Conway Alex Good Yonas Bahre</h1>
        <SussyBoiImg src={SussyBoi} />
        <iframe width="350" height="703" src="https://www.youtube.com/embed/9bZkp7q19f0" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
        <br />
        &lt;img src=&quot;
        <img width="400px" src={Crucifiction} />
        &quot; alt=&quot;Crucifiction of Christ&quot;&gt;
      </CreditsPage>
      <Background />
    </>
  )
}