var express = require('express');
var app = express();
var port = 3000;
var http = require('http').Server(app);
var io = require('socket.io')(http);

var users= [];
var singleChatMessage;

io.on('connection', function(socket){
    console.log('user connected');
    socket.on('disconnect', function(){
        console.log('user disconnected');
        users = [];
    });
    socket.on('chat message', function(msg){
            socket.broadcast.emit('server response', msg);
    });
    socket.on('join',(user)=>{
        console.log(user +'joined');
        socket.join(user);
       var singleUser = {id: socket.id, name: user};
       users.push(singleUser);
        console.log(singleUser);
        socket.broadcast.emit('new user joined', singleUser)
    });

    socket.on('single chat', (data)=>{
        console.log(data.id);
        console.log(data.name);
        console.log(data.message);
        singleChatMessage = {id: data.id, to: data.to, message: data.message, from: data.from}
        socket.to(data.id).emit('new message',singleChatMessage);
    })
});


http.listen(port, function(){
    console.log('listening on :3000');
});