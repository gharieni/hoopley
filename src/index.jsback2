require('dotenv').config({ path: 'variables.env' });

const dialogflow = require('@google-cloud/dialogflow').v2beta1;
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

// adds support for Get request to the webhook
app.get('/webhook', (req, res) => {
  //parse the query params
  let mode = req.query['hub.mode'];
  let token = req.query['hub.verify_token'];
  let challenge = req.query['hub.challenge'];

  console.log('hello 2')
  //check if a token and mode is in the query string of the request
  if (mode && token){
    // checks the mode and tokn sent is correct
    console.log('hello 3')
    if (mode === 'subscribe' && token === process.env.VERIFY_TOKEN)
        //  response with the challange token from the request
      console.log('WEBHOOK_VERIFIED');
    res.status(200).send(challenge);
  } else {
    // Respond with 403 Forbidden if verify tokens do not match
    res.sendStatus(403);
    console.log('verify token do not match')
  }
});


// Handles messages events
const handleMessage = (sender_psid, received_message) => {
  let response;

  if (received_message.text) {

  }
}

//
const handlePostback = (sender_psid, received_postback) => {
  let response;

  // Get the payload for the postback
  let payload = received_postback.payload;

  if(payload === 'GET_STARTED'){

  }
}



app.post('/webhook', (req, res) => {
  let data = req.body;

  //checks this is an event from the page subscreption
//  let webhook_event = entry.messaging[0];

  console.log("------------------------------")
  if (data.object === 'page'){
    console.log('post 2')

    //Iterates over each netry - there may be multiple if batched
    data.entry.forEach(function(entry) {
      //get the message enry messaging is an array , but
      //will only ever contain one message , so we get index 0
      console.log('post 3')
      let webhook_event = entry.messaging[0];
      console.log(webhook_event);
    });
    res.status(200).send('EVENT_RECEIVED');
  } else {
    //return a 404 not found if event is not from a page subscruption
    console.log('post 4')
    res.sendStatus(404);
    data.entry.forEach(function(entry) {
      //get the message enry messaging is an array , but
      //will only ever contain one message , so we get index 0
      console.log('post 3')
      let webhook_event = entry.messaging[0];
      console.log(webhook_event);
  });
}
});


