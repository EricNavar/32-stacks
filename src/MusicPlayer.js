import React from 'react';

function MusicPlayer() {
  //const [play, setPlay] = React.useState(false);
  //const [pause, setPause] = React.useState(true);

  const url = "http://streaming.tdiradio.com:8000/house.mp3";
  const audio = new Audio(url);

  const onPlayClick = () => {
    //setPlay(true);
    //setPause(false);
    audio.play();
  }

  const onPauseClick = () => {
    //setPlay(false);
    //setPause(true);
    audio.pause();
  }

  return (
    <div>
      <button onClick={onPlayClick}>Play</button>
      <button onClick={onPauseClick}>Pause</button>
    </div>
  );
}

export { MusicPlayer }
