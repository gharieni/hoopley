const processMessage = require('./process-message');

module.exports = (req, res) => {
  if (req.body.object === 'page') {
    req.body.entry.forEach(entry => {
      entry.messaging.forEach(event => {
        if (event.message && event.message.text) {
          processMessage(event);
        }
      });
    });

    res.status(200).send("event receive");
  }
  else{

//    if (req.intent) {
 //     pushToMysql(NULL, req.intent, req.queryResult.queryText);
  //  }
    res.sendStatus(201);
  }
}
