import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { MusicPlayer } from '../MusicPlayer';
import Shockwave from '../assets/shockwave_looped.mp3';
import Tetris99 from '../assets/tetris99.m4a';
import Good4U from '../assets/good4u.m4a';

const Title = styled.h2`
  width: 100%;
  font-weight: bold;
  textAlign: center;
  margin: 8px;
  color: white;
`;


const ChangeBoardCard = styled.div`
  text-align: center;
  display: grid;
  
  height: 50%;
  padding: 16px;
  background: rgba(0,0,0,.9);
  width: 100px;
  margin: auto;
  margin-top: auto;
  border-radius: 8px;
  margin-top: 50px;
  margin-right: 4rem;
  box-shadow: 
    blue 0px 0px 0px 2px inset, 
    rgb(0, 0, 0) 10px -10px 0px -3px, 
    rgb(31, 193, 27) 10px -10px, rgb(0, 0, 0) 20px -20px 0px -3px, 
    rgb(255, 217, 19) 20px -20px, rgb(0, 0, 0) 30px -30px 0px -3px, 
    rgb(255, 156, 85) 30px -30px, rgb(0, 0, 0) 40px -40px 0px -3px, 
    rgb(255, 85, 85) 40px -40px
`

const ChangePlayMusicCard = styled.div`
  text-align: center;
  display: grid;
  
  height: 50%;
  padding: 16px;
  background: rgba(0,0,0,.9);
  width: 100px;
  margin: auto;
  margin-top: auto;
  border-radius: 8px;
  margin-top: 50px;
  margin-right: 4rem;
  
  box-shadow: 
    blue 0px 0px 0px 2px inset, 
    rgb(0, 0, 0) 10px -10px 0px -3px, 
    rgb(31, 193, 27) 10px -10px, rgb(0, 0, 0) 20px -20px 0px -3px, 
    rgb(255, 217, 19) 20px -20px, rgb(0, 0, 0) 30px -30px 0px -3px, 
    rgb(255, 156, 85) 30px -30px, rgb(0, 0, 0) 40px -40px 0px -3px, 
    rgb(255, 85, 85) 40px -40px
`

const CurrentSong = styled.p`
  text-align: center;
  margin: 4px;
`
const MenuButtons = styled.button`
  width: 94%;
  padding: 4px;
  background: #383838;
  color: white;
  border-radius: 8px;
  border-style: none;
  font-size: 0.8rem;
  font-weight: bold;
  height: fit-content;
  text-decoration: none;
  margin: 3px;
  transition: transform 0.3 ease;

  &::after, &::before {
    content: "";
    position: absolute;
    opacity: 0.3;
    background: #383838;
    border-radius: inherit;
    width: 100%;
    height: 100%;
    left 0;
    bottom: 0;
    z-index: -1;
    transition: transform 0.3 ease;
  }

  &:hover {    
    transform: translate(-12px, -12px)
  }

  &:hover:after {
    transform: translate(6px, 6px)
  }

  &:hover:before {
    transform: translate(12px, 12px)
  }
`

const songs = [
  { name: "Shockwave", file: Shockwave },
  { name: "Tetris 99", file: Tetris99 },
  { name: "Good 4 U", file: Good4U }
]

export function SettingsModal(props) {
  const onClick = (backgroundName) => {
    props.setSelectedBackground(backgroundName);
  };

  const [songIndex, setSongIndex] = React.useState(0);

  const onClickBefore = () => {
    let newSongIndex = songIndex - 1;
    if (newSongIndex === -1) {
      newSongIndex += songs.length;
    }
    setSongIndex(newSongIndex);
    console.log(newSongIndex);
  }

  const onClickNext = () => {
    setSongIndex((songIndex + 1) % songs.length);
    console.log(songIndex);
  }

  return (
    <>
      <Title>
        Settings
      </Title>
      <ChangeBoardCard>

        <h2>
          Change Board Map
        </h2>
        {Object.keys(props.backgrounds).map((backgroundName, index) =>
          <MenuButtons key={index} onClick={() => onClick(backgroundName)}>{backgroundName}</MenuButtons>
        )}

      </ChangeBoardCard>
      <ChangePlayMusicCard>
        <h2>Play Music</h2>
        <CurrentSong>{songs[songIndex].name}</CurrentSong>
        <MusicPlayer url={songs[songIndex].file} />
        <MenuButtons onClick={onClickBefore}>before</MenuButtons>
        <MenuButtons onClick={onClickNext}>next</MenuButtons>
      </ChangePlayMusicCard>

    </>
  );
}
SettingsModal.propTypes = {
  backgrounds: PropTypes.object.isRequired,
  setSelectedBackground: PropTypes.func
};

