var app = new Vue({
    el: '#container',
    data: {
        ready: false,
        username: ''
    }
});

$(function () { 
    var socket = io();
    socket.on('chatMsg', (msg) => {
        if (msg.username == app.username) {
            $('#txt').append('<li><b style="color: red">' + msg.username + '</b>: ' + msg.msg +  '</li>');
        } else {
            $('#txt').append('<li><b style="color: green">' + msg.username + '</b>: ' + msg.msg +  '</li>');
        }
        window.scrollTo(0, document.body.scrollHeight);
    });
    socket.on('join', (data) => {
        $('#txt').append('<p style="text-align: center"><small><i style="color: gray"><span style="text-decoration: underline">' + data.userName + '</span> đã tham gia, hiện có ' + data.userNum + ' người online.</i></small></p>');
    });
    socket.on('leave', (userNum) => {
        $('#txt').append('<p style="text-align: center"><small><i style="color: gray">Ai đó đã rời đi, hiện còn ' + userNum + ' người online.</i></small></p>');
    });
    socket.on('typing', (username) => {
        $('#typing').text(username + ' đang nhập tin nhắn ...');
    });
    socket.on('endTyping', (username) => {
        $('#typing').text('');
    });

    $('#regis').submit(function () {
        $('body').css('background-color', '#c1e7e1');
        socket.emit('join', $('#username').val());
        app.username = $('#username').val();
        $('#username').val('');
        app.ready = true;
        return false;
    });
    $('#sendMsg').submit(function() {
        socket.emit('chatMsg', {msg: $('#msg').val(), username: app.username});
        $('#msg').val('');
        return false;
    });
    $('#msg').keydown(function() {
        socket.emit('typing', app.username);
    });
    $('#msg').keyup(function() {
        socket.emit('endTyping', app.username);
    });
});

