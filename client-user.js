const socket = require('socket.io-client')('http://localhost:8080');


var age =15;
socket.emit('user update age', age);




setTimeout(()=> {
    socket.on('db change age', function(new_age) {
        console.log('db change age:', new_age)
    })
},10000)