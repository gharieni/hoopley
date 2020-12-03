const axios = require('axios');

const dialogflow = require('@google-cloud/dialogflow');
const uuid = require('uuid');
const express = require('express');
const bodyParser = require('body-parser');
const sessionId = uuid.v4();;
const projectId = 'care-me-almvrf';

const app = express();

//******************************************************
async function runSample(projectId = 'care-me-almvrf') {
const sessionClient = new dialogflow.SessionsClient();
const sessionPath = sessionClient.sessionPath(projectId, sessionId);
console.log('sucessful connect to dialogflow');
console.log(sessioId);
    // The text query request.
  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        // The query to send to the dialogflow agent
        text: 'hello',
        // The language used by the client (en-US)
        languageCode: 'en-US',
      },
    },
   };
const responses = await sessionClient.detectIntent(request);
console.log('Detected intent');
}
//******************************************************


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
  let token = req.query['process.env.Page.verify_token'];
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

app.post('/webhook', (req, res) => {
  var data = req.body;
  // Make sure this is a page subscription
  if (data.object == "page") {
    // Iterate over each entry
    // There may be multiple if batched
    data.entry.forEach(function (pageEntry) {
      var pageID = pageEntry.id;
      var timeOfEvent = pageEntry.time;

      // Iterate over each messaging event
      pageEntry.messaging.forEach(function (messagingEvent) {
        if (messagingEvent.message) {
          console.log(messagingEvent.message);
          receivedMessage(messagingEvent);
        } else {
          console.log("Webhook received unknown messagingEvent: ",messagingEvent);
        }
      });
    });
    // Assume all went well.
    // You must send back a 200, within 20 seconds
    res.sendStatus(200);
  }
});




function receivedMessage(event) {
  var senderID = event.sender.id;
  var message = event.message;


  // You may get a text or attachment but not both
  var messageText = message.text;
  var messageAttachments = message.attachments;

  if (messageText) {
    //send message to api.ai
    sendToApiAi(senderID, messageText);
  } else if (messageAttachments) {
    handleMessageAttachments(messageAttachments, senderID);
  }
}



function sendToApiAi(sender, text) {
  sendTypingOn(sender);
  console.log("send to api function ");
  let apiaiRequest = sessionPath.textRequest(text, {
    sessionId: sessionIds.get(sender)
  });

  apiaiRequest.on("response", response => {
    if (isDefined(response.result)) {
      handleApiAiResponse(sender, response);
    }
  });

  apiaiRequest.on("error", error => console.error(error));
  apiaiRequest.end();
};


/*
 *
 * Turn typing indicator on
 *
 */
const sendTypingOn = (recipientId) => {
  console.log("send typing on ")
  var messageData = {
    recipient: {
      id: recipientId
    },
    sender_action: "typing_on"
  };
  callSendAPI(messageData);
}


/*
 * Call the Send API. The message data goes in the body. If successful, we'll
 * get the message id in a response
 *
 */
const callSendAPI = async (messageData) => {

  const url = "https://graph.facebook.com/v3.0/me/messages?access_token=" + process.env.Page_Access_Token;
  console.log("callsendAPI ")
  await axios.post(url, messageData)
      .then(function (response) {
        if (response.status == 200) {
          var recipientId = response.data.recipient_id;
          var messageId = response.data.message_id;
          if (messageId) {
            console.log(
                "Successfully sent message with id %s to recipient %s",
                messageId,
                recipientId
            );
          } else {
            console.log(
                "Successfully called Send API for recipient %s",
                recipientId
            );
          }
        }
      })
      .catch(function (error) {
        console.log(error.response.headers);
      });
}


const isDefined = (obj) => {
  if (typeof obj == "undefined") {
    return false;
  }
  if (!obj) {
    return false;
  }
  return obj != null;
}


function handleApiAiResponse(sender, response) {
  let responseText = response.result.fulfillment.speech;
  let responseData = response.result.fulfillment.data;
  let messages = response.result.fulfillment.messages;
  let action = response.result.action;
  let contexts = response.result.contexts;
  let parameters = response.result.parameters;


  console.log("funcion handleApiResponse")
  sendTypingOff(sender);

  if (responseText == "" && !isDefined(action)) {
    //api ai could not evaluate input.
    console.log("Unknown query" + response.result.resolvedQuery);
    sendTextMessage(
        sender,
        "I'm not sure what you want. Can you be more specific?"
    );
  } else if (isDefined(action)) {
    handleApiAiAction(sender, action, responseText, contexts, parameters);
  } else if (isDefined(responseData) && isDefined(responseData.facebook)) {
    try {
      console.log("Response as formatted message" + responseData.facebook);
      sendTextMessage(sender, responseData.facebook);
    } catch (err) {
      sendTextMessage(sender, err.message);
    }
  } else if (isDefined(responseText)) {
    sendTextMessage(sender, responseText);
  }
};

/*
 * Turn typing indicator off
 *
 */
const sendTypingOff = (recipientId) => {
  console.log("const send typing off")
  var messageData = {
    recipient: {
      id: recipientId
    },
    sender_action: "typing_off"
  };
  callSendAPI(messageData);
}


const sendTextMessage = async (recipientId, text) => {
  console.log("const send textMessage")
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      text: text
    }
  };
  await callSendAPI(messageData);
}


function handleApiAiAction(sender, action, responseText, contexts, parameters) {
  console.log("function handleApiAction")
  switch (action) {
    case "send-text":
      var responseText = "This is example of Text message."
      sendTextMessage(sender, responseText);
      break;
    default:
      //unhandled action, just send back the text
      sendTextMessage(sender, responseText);
  }
};
