
/* *****************************************************
 * setup dialogflow integration 
 *****************************************************  */
const fetch = require('node-fetch');

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
  return fetch(
  `https://graph.facebook.com/v3.0/me/messages?access_token=${FACEBOOK_ACCESS_TOKEN}`,
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
  );
}

module.exports = (event) => {
  const userId = event.sender.id;
  const message = event.message.text;

  console.log("module export")
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
