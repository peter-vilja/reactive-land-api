'use strict';
var http = require('http');
var Tweet = require('./tweet');

var tweet = Tweet();
var stream = tweet.stream();
var keywords = tweet.keywords();

http.createServer((req, res) => {
  res.writeHead(200, {
    'Content-Type' : 'text/event-stream',
    'Cache-Control' : 'no-cache',
    'Connection' : 'keep-alive'
  });
  if (req.url == '/tweets') stream.on('data', (data) => res.write(`data: ${data}\n\n`));
  if (req.url == '/keywords') keywords.on('data', (data) => res.write(`data: ${data}\n\n`));
}).listen(4000);
