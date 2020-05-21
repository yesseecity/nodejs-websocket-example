const http = require('http');
const socketServer = require('socket.io');
const SocketControl = require('./server/socket-control.js');



webServer = http.createServer().listen(8080, ()=>{
    console.log('web socker server started!')
});

const sqlDbInfo = {
    'host'     : 'db',
    'user'     : 'root',
    'password' : '12345',
    'database' : 'test_db'
}
const sCtl = new SocketControl({}, sqlDbInfo);


const io = new socketServer(webServer, {
    // transports: ['websocket']
})

io.on('connection', function(socket){
    const sCtl = new SocketControl(socket, sqlDbInfo);
    
    memberName = "Tid";

    sCtl.watchingMemberAge(memberName);

    socket.on('user update age', function(newAge) {
        console.log('user update age:', newAge);
        sCtl.oriAge = newAge;
        sCtl.changeMemberAge('Tid', newAge);
    })
});