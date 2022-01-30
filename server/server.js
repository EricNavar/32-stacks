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

const addPlayer = async (id, name, room) => {
    const player = {id, name, room}
    playerList.push(player)
    return player
}

const getPlayer = (id) => {
    return playerList.find(player => player.id === id)
}

const removePlayer = (id) => {
    const index = playerList.findIndex(player => player.id === id)
    return playerList.splice(index, 1)[0]
}

const getPlayersInRoom = (room) => {
    return playerList.filter(player => player.room === room)
}

//----------------------------------------------------------------------------------
//Socket Methods

io.on('connection', socket => {
    socket.on('join', (payload, callback) => {
        //If there are 4 players in room, return error
        const players = getPlayersInRoom(payload.room)
        if (players.length === 4) {
            console.log("Full")
            return callback("Room is Full!")
        }
        else {
        console.log(`Player joined room: ${payload.room}`)
            addPlayer(socket.id, payload.name, payload.room).then(
                socket.join(payload.room),
                io.to(payload.room).emit('roomData', {room: payload.room, players: players})
            )
            return callback()
        }
    })

    socket.on('leave', () => {
        console.log("Player leaving")
        const removedPlayer = removePlayer(socket.id)
        if (removedPlayer) {
            io.to(removedPlayer.room).emit('roomData', {room: removedPlayer.room, players: getPlayersInRoom(removedPlayer.room)})
        }
    })

    socket.on('updateGame', (gameState) => {
        console.log(`Received ${gameState.clicks}`)
        const player = getPlayer(socket.id)
        if (player) {
            io.to(player.room).emit('gameStateUpdate', gameState)
        }
    })
})

httpServer.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})