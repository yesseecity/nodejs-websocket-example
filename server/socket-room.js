class SocketRoom {
    constructor(socket, dbInfo) {
                
        var connection = mysql.createConnection({
            // host     : 'db',
            // user     : 'root',
            // password : '12345',
            // database : 'test_db'
            host     : dbInfo.host,
            user     : dbInfo.user,
            password : dbInfo.password,
            database : dbInfo.database
        });

        connection.connect();
        this.oriAge = 0;
        this.connection = connection;
        this.socket = socket;
    }

    querryMember(name, callback) {
        this.connection.query('SELECT * FROM `members` WHERE name = "'+name+'";', function (error, results, fields) {
            if (error) throw error;
            // console.log(results[0]);
            var age = results[0].age;
            callback(age);
        });
    }

    changeMemberAge(name, age) {
        this.connection.query('UPDATE members SET age='+age+' WHERE name="'+name+'";', function (error, results, fields) {
            if (error) throw error;
        });
    }

    socketCheckAge(age) {
        var oriAge = this.oriAge ;
        if (age !== this.oriAge && this.oriAge !== 0) {
            console.log('age update, new age: ', age)
            this.socket.emit('db change age', age);
            this.oriAge = age;
        } else if (age !== this.oriAge) {
            this.oriAge = age ;
        } else {
            console.log('current age: ', age)
        }
    }
    watchingMemberAge(name) {
        this.querryMember(name, this.socketCheckAge.bind(this))
        setTimeout(()=>{
            this.watchingMemberAge(name)
        }
        , 1000)
    }

}


// ES5 export
module.exports = SocketRoom;

// ES6 Different export useage
// export {SocketControl};
// export const SocketControl;
// export default SocketControl;