'use strict';
var http = require('http');
var Tweet = require('./tweet');

http.createServer((req, res) => {
  if (req.url == '/tweets') {
    res.writeHead(200, {
      'Content-Type' : 'text/event-stream',
      'Cache-Control' : 'no-cache',
      'Connection' : 'keep-alive'
    });

    var tweet = Tweet();
    var stream = tweet.stream();
    stream.on('data', (data) => res.write(`data: ${data}\n\n`));
  }
}).listen(4000);
