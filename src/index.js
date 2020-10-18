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

app.post('/webhook', (req, res) => {
  let data = req.body;

  //checks this is an event from the page subscreption
//  let webhook_event = entry.messaging[0];

  console.log("----------------- app post ")
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
      let webhook_event = entry.messaging[0];
      console.log(webhook_event);
    });
  }
});

function sendToApiAi(sender, text) {
  sendTypingOn(sender);
  console.log("send to api function ")
  let apiaiRequest = apiAiService.textRequest(text, {
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



