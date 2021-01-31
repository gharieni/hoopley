const processMessage = require('./process-message');

module.exports = (req, res) => {
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
