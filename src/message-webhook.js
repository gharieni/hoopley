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
    console.dir(res);
  //  if (result.intent) {
   //   pushToMysql(userId, result.intent, result.queryText);
   // }
    res.sendStatus(201);
  }
}
