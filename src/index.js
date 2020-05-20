require('dotenv').config({ path: 'variables.env' });

const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//set server port and log message
var server = app.listen(process.env.PORT || 5000, function () {
  var port = server.address().port;
  console.log("Express is working on port " + port);
});




//app.listen(5000, () => console.log('Express server is listening on port 5000'));

//app.get('/', verifyWebhook);
const messageWebhook = require('./message-webhook');

app.post('/', messageWebhook);
