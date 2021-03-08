
/* *****************************************************
 * setup dialogflow integration 
 *****************************************************  */

const request = require('request');

const {WebhookClient} = require('dialogflow-fulfillment');
const dialogflow = require('@google-cloud/dialogflow');
const uuid = require('uuid');
const projectId = 'care-me-almvrf';
const sessionId = uuid.v4();
const languageCode = 'en-US';

var privateKey = (process.env.NODE_ENV=="production") ? JSON.parse(process.env.DIALOGFLOW_PRIVATE_KEY).replace(/\n/g, '\n') : null;
const config = {
  credentials: {
    private_key: privateKey,
    client_email: process.env.DIALOGFLOW_CLIENT_EMAIL
  }
};

process.env.DEBUG = 'dialogflow:debug'; // enables lib debugging statements

const sessionClient = new dialogflow.SessionsClient(config);
const sessionPath = sessionClient.projectAgentSessionPath(
  projectId,
  sessionId
);

/* *****************************************************
  // Sends response messages via the Send API
 *****************************************************  */

const sendTextMessage = (userId, text) => {
  let response;
  response = {
    "text": text
  }
  sendTypingOnOff(userId, 'mark_seen')
  callSendAPI(userId, response);        
}

function callSendAPI(sender_psid, response) {
  // Construct the message body
  let request_body = {
    "recipient": {
      "id": sender_psid
    },
    "message": response
  }
  // Send the HTTP request to the Messenger Platform
  request({
    "uri": "https://graph.facebook.com/v2.6/me/messages",
    "qs": { "access_token": process.env.Page_Access_Token },
    "method": "POST",
    "json": request_body
  }, (err, res, body) => {
    if (!err) {
      console.log('message sent!')
    } else {
      console.error("Unable to send message:" + err);
    }
  });
}

function sendTypingOnOff(sender_psid, action) {
  // Construct the message body
  let request_body = {
    "recipient": {
      "id": sender_psid
    },
    "sender_action": action
  }
  // Send the HTTP request to the Messenger Platform
  request({
    "uri": "https://graph.facebook.com/v2.6/me/messages",
    "qs": { "access_token": process.env.Page_Access_Token },
    "method": "POST",
    "json": request_body
  }, (err, res, body) => {
    if (!err) {
      console.log('action!' + action)
    } else {
      console.error("Unable to send action:" + err);
    }
  });
}

function welcome(agent) {
  console.log("welcome function !");
  agent.add(`Welcome to my agent!`);
}

function WebhookProcessing(req, res) {
  console.log("----------------------------");
  const agent = new WebhookClient({request: req, response: res});
  console.info(`agent set`);

  let intentMap = new Map();
  intentMap.set('1) Default Welcome Intent', welcome);

  console.log("----------------------------");
  agent.handleRequest(intentMap);
}

module.exports = (event) => {
  const userId = event.sender.id;
  const message = event.message.text;

  console.log("module export ---> " + message)
  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        text: message,
        languageCode: languageCode,
      },
    },
  };



  sessionClient.detectIntent(request).then(response => {
    const result = response[0].queryResult;
    return sendTextMessage(userId, result.fulfillmentText);
  }).then(function(request,response) { 
    return  WebhookProcessing(request, response);
  }).catch(err => {
    console.error('ERROR', err);
  });
}
