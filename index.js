var app = require('express')();
var port = process.env.PORT || 3000;
app.set('port', (port));

var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.txt');
});

app.get('/chat', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

app.get('/admin/:message', function(req, res) {
    var remoteAddress = req.connection.remoteAddress;
    io.emit('chat message', remoteAddress + ": " + req.params.message);
    res.type("text/plain").send('message published');
});

io.on('connection', function(socket){
    var socketId = socket.id;
    var clientIp = socket.request.connection.remoteAddress;

    console.log("client connected: " + socketId + "[" + clientIp + "]");
    socket.on('chat message', function(msg){
        io.emit('chat message', socketId + ": " + msg);
    });
    socket.on('disconnect', function(){
        console.log("client disconnected: " + socketId + "[" + clientIp + "]");
    });
});

http.listen(port, function(){
    console.log('listening on *:' + port);
});