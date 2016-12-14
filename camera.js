var fs = require('fs');
var spawn = require('child_process').spawn;

var proc;


function stopStreaming() {
    if (proc) {
        proc.kill();
        fs.unwatchFile('./stream/image_stream.jpg');
    }
}

function startStreaming(io) {
    var args = ["-w", "640", "-h", "480", "-o", "./stream/image_stream.jpg", "-t", "999999999", "-tl", "100"];
    proc = spawn('raspistill', args);

    console.log('Watching for changes...');

    fs.watchFile('./stream/image_stream.jpg', function(current, previous) {
        io.sockets.emit('liveStream', 'image_stream.jpg?_t=' + (Math.random() * 100000));
    });
}

export default {
    stopStreaming,
    startStreaming
}