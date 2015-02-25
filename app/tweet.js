'use strict';
var oauth = require('oauth');
var querystring = require('querystring');
var stream = require('stream');

var consumerKey = process.env.FRPKEY;
var consumerSecret = process.env.FRPSECRET;
var accessTokenKey = process.env.FRPACCESSKEY;
var accessTokenSecret = process.env.FRPACCESSSECRET;
var buffer = '';
var buf = '';

function Tweet() {
  if (!(this instanceof Tweet)) return new Tweet();

  this.oa = new oauth.OAuth(
    'https://api.twitter.com/oauth/request_token',
    'https://api.twitter.com/oauth/access_token',
    consumerKey,
    consumerSecret,
    '1.0A',
    null,
    'HMAC-SHA1'
  );
}

module.exports = Tweet;

Tweet.prototype.stream = function () {
  var readable = new stream.Readable({objectMode: true});
  readable._read = () => {};
  var url = 'https://stream.twitter.com/1.1/statuses/sample.json?include_entities=true';
  var request = this.oa.post(url, accessTokenKey, accessTokenSecret, {});

  request.on('response', response => response.on('data', chunk => {
    var index;
    buffer += chunk.toString();
    while ((index = buffer.indexOf('\r\n')) > -1) {
      var obj = buffer.slice(0, index);
      buffer = buffer.slice(index + 2);
      if (obj.length > 0) readable.push(obj);
    }
  }));
  request.end();
  return readable;
};

Tweet.prototype.keywords = function () {
  var keywords = [
    'happy', 'joyful', 'excited', 'relaxed', 'awesome',
    'sad', 'depressed', 'bored', 'angry', 'hurt'
  ];
  var readable = new stream.Readable({objectMode: true});
  readable._read = () => {};
  var url = 'https://stream.twitter.com/1.1/statuses/filter.json?track=' + keywords.join(',');
  var request = this.oa.post(url, accessTokenKey, accessTokenSecret, {});

  request.on('response', response => response.on('data', chunk => {
    var index;
    buf += chunk.toString();
    while ((index = buf.indexOf('\r\n')) > -1) {
      var obj = buf.slice(0, index);
      buf = buf.slice(index + 2);
      if (obj.length > 0) readable.push(obj);
    }
  }));
  request.end();
  return readable;
};
