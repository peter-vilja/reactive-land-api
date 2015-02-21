'use strict';
var http = require('http');
var Tweet = require('./tweet');

var tweet = Tweet();
var stream = tweet.stream();
var keywords = tweet.keywords();
var subscribers = new Set();
var keywordSubscribers = new Set();

stream.on('data', data => subscribers.forEach(res => res.write(`data: ${data}\n\n`)));
keywords.on('data', data => keywordSubscribers.forEach(res => res.write(`data: ${data}\n\n`)));

http.createServer((req, res) => {
  res.writeHead(200, {
    'Content-Type' : 'text/event-stream',
    'Cache-Control' : 'no-cache',
    'Connection' : 'keep-alive'
  });
  if (req.url == '/tweets') {
    subscribers.add(res);
    res.on('close', () => subscribers.delete(res));
  }
  if (req.url == '/keywords') {
    keywordSubscribers.add(res);
    res.on('close', () => keywordSubscribers.delete(res));
  }
}).listen(4000);
