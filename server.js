var express = require('express');
var app = express();
var http = require('http').Server(app); 
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;

app.use(express.static(__dirname + "/public/"));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

var userNum = 0;

io.on('connection', (socket) => {
    socket.on('chatMsg', (msg) => {
        io.emit('chatMsg', msg);
    });
    socket.on('disconnect', () => {
        userNum--;
        io.emit('leave', userNum);
    });
    socket.on('join', (username) => {
        userNum++;
        io.emit('join', {userNum: userNum, userName: username});
    })
    socket.on('typing', (username) => {
        io.emit('typing', username);
    });
    socket.on('endTyping', (username) => {
        io.emit('endTyping', username);
    });
});

http.listen(port, () => {
    console.log('Listening on port: ' + port);

});