const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const cors = require('cors');

const PORT = 5000;
const app = express();
app.use(cors())

const httpServer = http.createServer(app)
const io = socketIO(httpServer)

//----------------------------------------------------------------------------------
//Player Fetching Methods

const playerList = []

const addPlayer = ({id, name, room}) => {
    const player = {id, name, room}
    playerList.push(player)
    return player
}

const getPlayer = (id) => {
    return playerList.find(player => {player.id === id})
}

const removePlayer = (id) => {
    const index = playerList.findIndex(player => {player.id === id})
    return playerList.splice(index, 1)[0]
}

const getPlayersInRoom = (room) => {
    return playerList.filter(player => {player.room === room})
}

//----------------------------------------------------------------------------------
//Socket Methods

io.on('connection', socket => {
    socket.on('join', (payload, callback) => {
        //If there are 4 players in room, return error
        const players = getPlayersInRoom(payload.room)
        if (players.length === 4) {
            return callback("Room is Full!")
        }

        addPlayer(socket.id, payload.name, payload.room)
        socket.join(payload.room)

        io.to(payload.room).emit('roomData', {room: payload.room, players: players})
        return callback("Success")
    })

    socket.on('leave', () => {
        const removedPlayer = removePlayer(socket.id)
        if (removedPlayer) {
            io.to(removedPlayer.room).emit('roomData', {room: removedPlayer.room, players: getPlayersInRoom(removedPlayer.room)})
        }
    })

    socket.on('updateGame', (gameState) => {
        const player = getPlayer(socket.id)
        if (player) {
            io.to(player.room).emit('gameStateUpdate', gameState)
        }
    })
})


httpServer.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})