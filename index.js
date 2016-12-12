var app = require('express')()
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
    // res.send('<h1>hello world</h1>');
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket) {
    io.emit('chat message', 'a user has connected');
    console.log('a user connected');
    
    socket.on('disconnect', function() {
        io.emit('chat message', 'a user has disconnected');
        console.log('user disconnected');
    });
    
    socket.on('chat message', function(msg) {
        // console.log('message: ' + msg);
        io.emit('chat message', msg);
    })
})

http.listen(8080, function() {
    console.log('listening on *:8080');
});