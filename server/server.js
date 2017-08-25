const express = require('express');
const http = require('http');
const path = require('path');
const socketIO = require('socket.io');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;

var app = express();
var server = http.createServer(app);
var io = socketIO(server);

io.on('connection', (socket) => {
    console.log('New user connected');

    //secket.emit - send message to joined - bot welcome to our chat
    socket.emit('newMessage',{
        from: 'Chat Bot',
        text: 'Welcome to our chat user',
        createdAt: new Date().getTime()
    });

    //socket.broadcast - from admin - new user joined
    socket.broadcast.emit('newMessage',{
        from: 'Chat Bot',
        text: 'New user joinded this chat',
        createdAt: new Date().getTime()
    })

    socket.on('createMessage', (newMessage) => {
        console.log('Message from client recieved on server: ', newMessage);
        io.emit('newMessage', {
            from: newMessage.from,
            text: newMessage.text,
            createdAt: new Date().getTime()
        })
        // socket.broadcast.emit('newMessage', {
        //     from: newMessage.from,
        //     text: newMessage.text,
        //     createdAt: new Date().getTime()
        // });
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

app.use(express.static(publicPath));

server.listen(port, () => {
    console.log(`Server is up on port ${port}`);
});
