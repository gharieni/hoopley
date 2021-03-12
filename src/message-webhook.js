const processMessage = require('./process-message');
const { WebhookClient } = require('dialogflow-fulfillment');

function welcome(){
  console.log('*** function welcome called here');
}


module.exports = (req, res) => {
  if (req.body.object === 'page') {
    req.body.entry.forEach(entry => {
      entry.messaging.forEach(event => {
        if (event.message && event.message.text) {
          const agent = new WebhookClient({ request: req, response: res });
          const intentMap = new Map();
          intentMap.set('1) Default Welcome Intent', welcome);
          agent.handleRequest(intentMap);
          processMessage(event);
        }
      });
    });

    res.status(200).send("event receive");
  }
  else{
    res.sendStatus(404);
  }
}
