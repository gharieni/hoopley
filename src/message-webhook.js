const processMessage = require('./process-message');

module.exports = (req, res) => {
  if (req.body) {
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
    res.sendStatus(404);
  }
}
