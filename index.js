var express = require('express');
var app = express();
var port = 3000;
var http = require('http').Server(app);
var io = require('socket.io')(http);


io.on('connection', function(socket){
    console.log('user connected');
    socket.on('disconnect', function(){
        console.log('user disconnected');
    });
    socket.on('join', (data)=>{
        socket.join(data.room);
        console.log(data.user);
        console.log(data.room);
        socket.broadcast.to(data.room).emit('new user joined', {user: data.user, message: 'is joined the room'});
    });
    
    socket.on('leave', (data)=>{
        socket.join(data.room);
        console.log(data.user);
        console.log(data.room);
        socket.broadcast.to(data.room).emit('left room', {user: data.user, message: 'is left the room'});
        socket.leave(data.room);    
    });

    socket.on('send message',(data)=>{
        console.log(data.user + ':'+ data.message);
        io.in(data.room).emit('new message', {user: data.user, message:data.message} );
    } )
});


http.listen(port, function(){
    console.log('listening on :3000');
});