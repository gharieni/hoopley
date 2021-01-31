const apiai = require("apiai");
const express = require("express");
const bodyParser = require("body-parser");
const uuid = require("uuid");
const axios = require('axios');
const app = express();


//Import Config file
const config = require("./config");

//setting Port
app.set("port", process.env.PORT || 5000);

//serve static files in the public directory
app.use(express.static("public"));

// Process application/x-www-form-urlencoded
app.use(
    bodyParser.urlencoded({
      extended: false
    })
);

// Process application/json
app.use(bodyParser.json());

// Index route
app.get("/", function (req, res) {
  res.send("Hello world, I am a chat bot");
});

// for Facebook verification
app.get("/webhook/", function (req, res) {
  console.log("request");
  if (
      req.query["hub.mode"] === "subscribe" &&
      req.query["hub.verify_token"] === config.FB_VERIFY_TOKEN
  ) {
    res.status(200).send(req.query["hub.challenge"]);
  } else {
    console.error("Failed validation. Make sure the validation tokens match.");
    res.sendStatus(403);
  }
});

// Spin up the server
app.listen(app.get("port"), function () {
  console.log("Magic Started on port", app.get("port"));
});
//__________________________________________________________________________________

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//set server port and log message
var server = app.listen(process.env.PORT || 5000, function () {
  var port = server.address().port;
  console.log("Express is working on port " + port);
});

app.post('/webhook', (req, res) => {
  let body = req.body;

  //checks this is an event from the page subscreption
//  let webhook_event = entry.messaging[0];

  console.log("------------------------------")
  //console.log("body")
  console.log("------------------------------")
  if (body.object === 'page'){
    console.log('post 2')

    //Iterates over each netry - there may be multiple if batched
    body.entry.forEach(function(entry) {
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
  }
});

// adds support for Get request to the webhook
app.get('/webhook', (req, res) => {
  console.log(VERIFY_TOKEN)
  //parse the query params
  let mode = req.query['hub.mode'];
  let token = req.query['hub.verify_token'];
  let challange = req.query['hub.challange'];

  console.log('hello 2')
  //check if a token and mode is in the query string of the request
  if (mode && token){
    // checks the mode and tokn sent is correct
    console.log('hello 3')
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {

      //  response with the challange token from the request
      console.log('WEBHOOK_VERIFIED');
      res.status(200).send(challenge);
      console.log('end if')
    } else {
      // Respond with 403 Forbidden if verify tokens do not match
      res.sendStatus(403);
      console.log('verify token do not match')
    }
  }
});