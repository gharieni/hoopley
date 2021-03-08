const processMessage = require('./process-message');
const {WebhookClient} = require('dialogflow-fulfillment');

function WebhookProcessing(req, res) {
  console.log("----------------------------");
  const agent = new WebhookClient({request: req, response: res});
  console.info(`agent set`);

  let intentMap = new Map();
  intentMap.set('1) Default Welcome Intent', welcome);

  console.log("----------------------------");
  agent.handleRequest(intentMap);
}

function welcome(agent) {
  console.log("welcome function !");
  agent.add(`Welcome to my agent!`);
}


module.exports = (req, res) => {
  if (req.body.object === 'page') {
    req.body.entry.forEach(entry => {
      entry.messaging.forEach(event => {
        if (event.message && event.message.text) {
          processMessage(event);
          WebhookProcessing(req, res);
 

        }
      });
    });

    res.status(200).send("event receive");
  }
  else{
    res.sendStatus(404);
  }
}
