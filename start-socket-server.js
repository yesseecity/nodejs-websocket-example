const http = require('http');
const socketServer = require('socket.io');
const SocketControl = require('./server/socket-control.js');
const fs = require('fs');


webServer = http.createServer(function(req, res){
    fs.readFile('index.html',function (err, data){
        res.writeHead(200, {'Content-Type': 'text/html','Content-Length':data.length});
        res.write(data);
        res.end();
    });
});

webServer.listen(8080, ()=>{
    console.log('web socker server started!')
});



const io = new socketServer(webServer, {
    // transports: ['websocket']
})

io.on('connection', function(socket){
    const sCtl = new SocketControl(socket);
    socket.on('joinRoom', (msg) => {
        let msgObj = msg;
        // let msgObj = JSON.parse(msg);

        console.log('========connection ===========')
        console.log('[socket.io]: ', msgObj.deviceType, 'connected', '(socket id: '+socket.id+')', msgObj)

        socket.join(msgObj.roomId, () => {
            const rooms = Object.keys(socket.rooms);

            // broadcast to everyone in the room
            // io.to(msgObj.roomId).emit('a new user has joined the room');

            let roomSockets = io.sockets.adapter.rooms[msgObj.roomId].sockets;
            // console.log("roomSockets: ", roomSockets)
            for (let id in roomSockets) {
                if (id !== socket.id) {
                    let cmdObj = {}

                    if (msgObj.deviceType === 'board') {
                        console.log('board connected')
                        cmdObj = {
                            'cmd': 'board-connected'
                        }
                        io.to(id).emit('board msg', cmdObj)
                    }
                    if (msgObj.deviceType === 'web') {
                        console.log('web connected')
                        cmdObj = {
                            'cmd': 'web-connected'
                        }
                        io.to(id).emit('web msg', cmdObj)
                    }
                }
            }
            socket.on('disconnect', function(obj){
                console.log('[socket.io]: ', msgObj.deviceType, 'disconnected', '(socket id: '+socket.id+')', msgObj)
                for (let id in roomSockets) {
                    if (id !== socket.id) {
                        let cmdObj = {}

                        if (msgObj.deviceType === 'board') {
                            cmdObj = {
                                'cmd': 'board-disconnected'
                            }
                            io.to(id).emit('board msg', cmdObj)
                        } else if (msgObj.deviceType === 'web') {
                            cmdObj = {
                                'cmd': 'web-disconnected'
                            }
                            io.to(id).emit('web msg', cmdObj)

                        }
                    }
                }
            });
        });
    });

    socket.on('board msg', function(msgObj){
        console.log('web msg');
        let room = io.sockets.adapter.rooms[msgObj.roomId]
        if (room == undefined) {
            return
        }
        let roomSockets = room.sockets;
        for (let id in roomSockets) {
            if (id !== socket.id) {
                console.log(msgObj)
                console.log('send to board')
                io.to(id).emit('board msg', msgObj)
            }
        }
    });
    socket.on('web msg', function(msgObj){
        console.log('web msg');
        let room = io.sockets.adapter.rooms[msgObj.roomId]
        if (room == undefined) {
            return
        }
        let roomSockets = room.sockets;
        for (let id in roomSockets) {
            if (id !== socket.id) {
                console.log('send to board')
                io.to(id).emit('web msg', msgObj)
            }
        }
    });
    
    socket.on('request room info', function(msgObj, callback){
        let roomInfo = io.sockets.adapter.rooms[msgObj.roomId]
        // let roomSockets = room.sockets;
        console.log('request room info:', roomInfo)
        callback(roomInfo)
    })


});