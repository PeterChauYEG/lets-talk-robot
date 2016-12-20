import fs from 'fs';
import { spawn } from 'child_process';

let proc;

export function stopStreaming() {
  if (proc) {
    proc.kill();
    fs.unwatchFile('./stream/image_stream.jpg');
  }
}

export function startStreaming(io) {
  const args = ["-w", "640", "-h", "480", "-o", "./stream/image_stream.jpg", "-t", "999999999", "-tl", "100"];

  // spawn live-stream process
  proc = spawn('raspistill', args);

  console.log('Watching for changes...');

  fs.watchFile('./stream/image_stream.jpg', function(current, previous) {
    io.sockets.emit('liveStream', './stream/image_stream.jpg?_t=' + (Math.random() * 100000));
  });
}