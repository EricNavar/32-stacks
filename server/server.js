const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const PORT = 8080;
const app = express();

const httpServer = http.createServer(app);
const io = socketIO(httpServer);

//----------------------------------------------------------------------------------
//Player Fetching Methods

const playerList = [];

const addPlayer = (id, playerID, name, room) => {

    const player = { id, playerID, name, room };
    if (playerList.length < 4) {
        playerList.push(player);
    }

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
            addPlayer(socket.id, payload.playerID, payload.name, payload.room);
            socket.join(payload.room);
            const currentPlayers = getPlayersInRoom(payload.room);
            let initialPlayerList = [];
            for (i = 0; i < currentPlayers.length; i++) {
                let newPlayer = {
                    id: currentPlayers[i].playerID,
                    name: currentPlayers[i].name,
                    cardCount: 8
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
            leftPlayer: player.playerID
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