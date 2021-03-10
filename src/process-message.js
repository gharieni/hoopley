
/* *****************************************************
 * setup dialogflow integration 
 *****************************************************  */

const request = require('request');

const dialogflow = require('@google-cloud/dialogflow');
const uuid = require('uuid');
const projectId = 'care-me-almvrf';
const sessionId = uuid.v4();
const languageCode = 'en-US';
const {struct} = require('pb-util');

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
/*
const {WebhookClient} = require('dialogflow-fulfillment');

exports.dialogflowWebhook = functions.https.onRequest(async (request, response) => {
  const agent = new WebhookClient({ request, response });

  console.log(JSON.stringify(request.body));

  const result = request.body.queryResult;

  function welcome(agent) {
    agent.add(`Welcome to my agent!`);
  }

  function fallback(agent) {
    agent.add(`Sorry, can you try again?`);
  }

  async function userOnboardingHandler(agent) {

    const db = admin.firestore();
    const profile = db.collection('users').doc('jeffd23');

    const { name, color } = result.parameters;

    await profile.set({ name, color })
    agent.add(`Welcome aboard my friend!`);
  }


  let intentMap = new Map();
  intentMap.set('1)Default Welcome Intent', welcome);
  intentMap.set('Default Fallback Intent', fallback);
  intentMap.set('UserOnboarding', userOnboardingHandler);
  agent.handleRequest(intentMap);
});
*/


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
    queryParams: {
      payload: struct.encode({source: 'ACTIONS_ON_GOOGLE'})
    },
  };



  sessionClient.detectIntent(request).then(response => {
    const result = response[0].queryResult;
    sendTextMessage(userId, result.fulfillmentText);
    console.log('Detected intent');
    console.log(`  Query: ${result.queryText}`);
    console.log(`  Response: ${result.fulfillmentText}`);
    if (result.intent) {
      console.log(`  Intent: ${result.intent.displayName}`);
    }
  })
    .catch(err => {
      console.error('ERROR', err);
    });
}
