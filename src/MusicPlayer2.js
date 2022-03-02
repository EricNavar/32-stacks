import React from 'react';
import PlayIcon from './assets/play-solid';
import PauseIcon from './assets/pause-solid';

function MusicPlayer2() {
  const [play, setPlay] = React.useState(false);

  const url = "http://streaming.tdiradio.com:8000/house.mp3";
  const audio = new Audio(url);

  const onPlayClick = () => {
    setPlay(true);
    audio.play();
  }

  const onPauseClick = () => {
    setPlay(false);
    audio.pause();
  }

  return (
    <div>
      {play}
      <button onClick={onPauseClick}><PauseIcon/></button>
      <button onClick={onPlayClick}><PlayIcon/></button>
    </div>
  );
}

export { MusicPlayer2 }
