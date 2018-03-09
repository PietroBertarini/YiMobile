'use strict';
var http = require('http');
var port = process.env.PORT || 1337;

const app = require('./app');
const server = http.createServer(app);


server.listen(port);
