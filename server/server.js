const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const cors = require('cors');

const PORT = 5000;
const app = express();
app.use(cors());

const httpServer = http.createServer(app);
const io = socketIO(httpServer);

//----------------------------------------------------------------------------------
//Player Fetching Methods

const playerList = [];

const addPlayer = (id, name, room) => {
    const player = {id, name, room};
    playerList.push(player);
    return player;
};

const getPlayer = (id) => {
    return playerList.find(player => player.id === id);
};

const removePlayer = (id) => {
    const index = playerList.findIndex(player => player.id === id);
    return playerList.splice(index, 1)[0];
};

const getPlayersInRoom = (room) => {
    return playerList.filter(player => player.room === room);
};

//----------------------------------------------------------------------------------
//Socket Methods

io.on('connection', socket => {
    socket.on('join', (payload, callback) => {
        //If there are 4 players in room, return error
        const players = getPlayersInRoom(payload.room);
        if (players.length === 4) {
            console.log("Full");
            return callback("Full");
        }
        else {
            console.log(`Player joined room: ${payload.room}`);
            addPlayer(socket.id, payload.name, payload.room, players.length + 1);
            socket.join(payload.room);
            const currentPlayers = getPlayersInRoom(payload.room);
            let initialPlayerList = [];
            for (i = 0; i < currentPlayers.length; i++) {
                let newPlayer = {
                    name: currentPlayers[i].name,
                    cardCount: 7
                };
                initialPlayerList.push(newPlayer);
            }
            io.to(payload.room).emit('initialGameObject', {
                turn: 1,
                direction: false,
                lastCardPlayed: 'empty',
                playerList: initialPlayerList,
                winner: 0,
                gameStart: false
            });
            return callback();
        }
    });

    socket.on('disconnect', () => {
        console.log("Player leaving");
        const player = getPlayer(socket.id);
        removePlayer(socket.id);
        io.to(player.room).emit('playerLeft', {
            leftPlayer: player.name
        });
    });

    socket.on('updateGame', (gameObject) => {
        const player = getPlayer(socket.id);
        if (player) {
            io.to(player.room).emit('gameObjectUpdate', gameObject);
        }
    });
});

httpServer.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});