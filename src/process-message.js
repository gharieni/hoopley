
/* *****************************************************
 * setup dialogflow integration 
 *****************************************************  */

const dialogflow = require('@google-cloud/dialogflow');
const uuid = require('uuid');
const projectId = 'care-me-almvrf';
const sessionId = uuid.v4();
const languageCode = 'en-US';

//var privatekey = process.env.DIALOGFLOW_PRIVATE_KEY;
//var private = JSON.parse(process.env.DIALOGFLOW_PRIVATE_KEY);
const config = {
  credentials: {
    private_key: process.env.DIALOGFLOW_PRIVATE_KEY,
  //  private_key: (!isNaN( process.env.DIALOGFLOW_PRIVATE_KEY)) ? process.env.DIALOGFLOW_PRIVATE_KEY.replace(/\n/g, '\n') : null,
   // private_key: private,
    client_email: process.env.DIALOGFLOW_CLIENT_EMAIL
  }
};
//console.log(config.credentials.private_key);

const sessionClient = new dialogflow.SessionsClient(config);
const sessionPath = sessionClient.projectAgentSessionPath(
  projectId,
  sessionId
);
const sendTextMessage = (userId, text) => {
  return fetch(
  `https://graph.facebook.com/v3.0/me/messages?access_token=` + process.env.Page_Access_Token,
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
