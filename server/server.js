const express = require('express');
const http = require('http');
const path = require('path');
const socketIO = require('socket.io');

const {generateMessage, generateLocationMessage} = require('./utils/message');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;

var app = express();
var server = http.createServer(app);
var io = socketIO(server);

io.on('connection', (socket) => {
    console.log('New user connected');
    
    socket.emit('newMessage', generateMessage('Chat Bot', 'Welcome to our chat user'));

    socket.broadcast.emit('newMessage', generateMessage('Chat Bot', 'New user joinded this chat'));

    socket.on('createMessage', (newMessage, callback) => {
        console.log('Message from client recieved on server: ', newMessage);
        io.emit('newMessage', generateMessage(newMessage.from, newMessage.text));
        callback('This is acknowledgment message from server');        
    });

    socket.on('createLocationMessage', (coords, callback) => {        
        io.emit('newLocationMessage', generateLocationMessage('Admin', coords.latitude, coords.longitude));
        callback('This is acknowledgment message from server');        
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

app.use(express.static(publicPath));

server.listen(port, () => {
    console.log(`Server is up on port ${port}`);
});
