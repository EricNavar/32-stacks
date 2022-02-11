/* eslint-disable no-unused-vars */
import React, {useState, useEffect} from 'react';
import { useParams, useNavigate } from "react-router-dom";
import io from 'socket.io-client';

const ENDPOINT = "http://localhost:5000";

let socket;

const ServerTest = () => {
  const { room } = useParams();
  const [players, setPlayers] = useState([]);
  const [currentPlayer, setCurrentPlayer] = useState('');

  const navigate = useNavigate();

  //Initial Socket Join
  useEffect(() => {
    const connectionOptions =  {
      "forceNew" : true,
      "reconnectionAttempts": "Infinity", 
      "timeout" : 10000,                  
      "transports" : ["websocket"]
    }
    socket = io.connect(ENDPOINT, connectionOptions)

    socket.emit('join', {room: room, name: "Rocketman"}, (error) => {
      if (error) {
        console.log("error")
        navigate('/');
      }
      else {
        console.log("Successfully connected to socket server")
      }
    })

    //On tab close
    return () => {
      socket.emit('leave')
      socket.off()
    }
  }, [])

  //Receiving Messages from Server
  useEffect(() => {
    socket.on("gameObjectUpdate", (gameObject) => {
      setClicks(gameObject.clicks)
    })

    socket.on("")
  })

  const [clickCount, setClicks] = useState(0);

  const clickFunction = () => {
    socket.emit('updateGame', ({clicks: clickCount + 1}))
  }

  return (
    <div>
      <div>Room Code: {room}</div>
      <button style={{fontSize: '60px'}} onClick={clickFunction}>Click Me</button>
      <div style={{fontSize: '60px'}}>{clickCount}</div>
    </div>
  );
}

export { ServerTest }