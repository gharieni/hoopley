const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//set express server 
var server = app.listen(process.env.PORT || 5000, function () {
  var port = server.address().port;
  console.log("Express is working on port " + port);
});

const verifyWebhook = require('./verify-webhook');
app.get('/webhook', verifyWebhook);


const messagewebhook = require('./message-webhook');
app.post('/webhook', messagewebhook);
