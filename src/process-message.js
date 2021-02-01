
/* *****************************************************
 * setup dialogflow integration 
 *****************************************************  */
const fetch = require('node-fetch');
const request = require('request');

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

const sessionClient = new dialogflow.SessionsClient(config);
const sessionPath = sessionClient.projectAgentSessionPath(
  projectId,
  sessionId
);

const { FACEBOOK_ACCESS_TOKEN } = process.env;

const sendTextMessage = (userId, text) => {
  console.log("-----sendTextMessage")
  console.log(text)

  response = {
    "text": text
  }

  callSendAPI(userId, response);        
  // return 
  /*fetch(
  `https://graph.facebook.com/v2.6/me/messages?access_token=${FACEBOOK_ACCESS_TOKEN}`,
    {
      header: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify({
        messaging_type: 'RESPONSE',
        recipient: {
          id: userId,
        },
        message: {
          text,
        },
        }),
    }
  )
  .then(console.log('************** end fetch ****************'));
  */
}

// Sends response messages via the Send API
function callSendAPI(sender_psid, response) {
  // Construct the message body
  let request_body = {
    "recipient": {
      "id": sender_psid
    },
    "message": response
  }
  console.log(request_body.message);
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
  })
    .catch(err => {
      console.error('ERROR', err);
    });
}
