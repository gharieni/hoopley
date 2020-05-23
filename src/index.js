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
//const messageWebhook = require('./message-webhook');

//app.post('/', messageWebhook);
app.post('/webhook', (req, res) => {
  let body = req.body;

  //checks this is an event from the page subscreption
  if (body.object === 'page'){

    //Iterates over each netry - there may be multiple if batched
    body.entry.forEach(function(entry) {
      //get the message enry messaging is an array , but
      //will only ever contain one message , so we get index 0
      let webhook_event = entry.messaging[0];
      console.log(webhook_event);
    });
    res.status(200).send('EVENT_RECEIVED');
  } else {
    //return a 404 not found if event is not from a page subscruption
    res.sendStatus(404);
  }
});

// adds support for Get request to the webhook
app.get('/webhook', (req, res) => {
  //you verify token. Should be a random string.
  let VERIFY_TOKEN = EAAHVTLvXqNEBAJlbSFGeT36jZA9GD8h4dwZAOiYtVZBp9wEV8ZAHZAsvEybRwKFhcEYwHWODzsLkYZCexGjmWFU
  //parse the query params
  let mode = req.query['hub.mode'];
  let token = req.query['hub.verify_token'];
  let challange = req.query['hub.challange'];

  //check if a token and mode is in the query string of the request
  if (mode && token){

    // checks the mode and tokn sent is correct
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {

      //  response with the challange token from the request
      console.log('WEBHOOK_VERIFIED');
      res.status(200).send(challenge);
    } else {
      // Respond with 403 Forbidden if verify tokens do not match
      res.sendStatus(403);
    }
  }
});
