const verifyWebhook = (req, res) => {

  let mode = req.query['hub.mode'];
  let token = req.query['hub.verify_token'];
  let challenge = req.query['hub.challenge'];

  if (mode && token ){
    if (mode === 'subscribe' && token === process.env.VERIFY_TOKEN) {
      cosole.log("webhook verified")
      res.status(200).send(challenge);
    } else {
      res.sendStatus(403);
    }
  }
};

module.exports = verifyWebhook;
