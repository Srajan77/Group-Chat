const path = require('path');
const express = require("express");
const socketio = require('socket.io');
const http = require('http');
const formatMessage = require('./utils/messages');
const { userJoin, getcurrentUser , userLeave, getRoomUsers} = require('./utils/users');


const app = express();
const server = http.createServer(app);
const io = socketio(server);

const botName = 'Chat Cord';

app.use(express.static(path.join(__dirname, 'public')));


io.on('connection', socket => {

    socket.on('joinRoom', ({username, room }) =>{

        const user = userJoin(socket.id, username, room);
        // console.log(user);

        
        socket.join(user.room);

        //welcomes current user
        socket.emit('message', formatMessage(user.username,'Welcome to Chat Cord'));

        // broadcast when a user connects
        socket.broadcast.to(user.room).emit('message', formatMessage(user.username,`${user.username} has joined the chat.`));


        // send users and room info for sidebar
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
        })

    });



    // Listen for Chat Message
    
    socket.on('chatMessage', (msg)=>{
        const user = getcurrentUser(socket.id);
        io.to(user.room).emit('message', formatMessage(user.username ,msg));
    });





    socket.on('disconnect', ()=>{

        const user = userLeave(socket.id);

        if(user)
        {
            io.to(user.room).emit('message', formatMessage(botName, `${user.username} has left the chat`));

            // send users and room info for sidebar
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
        })

        }
        
    });

    

});


const PORT = 3000 || process.env.PORT;

server.listen(PORT, function(err){
    if(err)
    {
        console.log(err);
    }
    else
    {
        console.log("Serever started on port "+ PORT);
    }
})