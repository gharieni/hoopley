const processMessage = require('./process-message');


module.exports = (req, res) => {
  if (req.body.object === 'page') {
    req.body.entry.forEach(entry => {
      //******************

      // Gets the body of the webhook event
      let webhook_event = entry.messaging[0];
      console.log(webhook_event);

      // Get the sender PSID
      let sender_psid = webhook_event.sender.id;
      console.log('Sender PSID: ' + sender_psid);



      //**********************
    });

    res.status(200).send("event receive");
  }
  else{
    console.log("404 error")
    res.sendStatus(404);
  }
};


// Handles messages events
function handleMessage(sender_psid, received_message) {

}

// Handles messaging_postbacks events
function handlePostback(sender_psid, received_postback) {

}

// Sends response messages via the Send API
function callSendAPI(sender_psid, response) {

}






















/*module.exports = (req, res) => {
  if (req.body.object === 'page') {
    req.body.entry.forEach(entry => {
      entry.messaging.forEach(event => {
        if (event.message && event.message.text) {
          console.log('process message')
          processMessage(event);
        }
      });
    });

    res.status(200).send("event receive");
  }
  else{
    console.log("404 error")
    res.sendStatus(404);
  }
};
*/


