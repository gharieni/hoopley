require('dotenv').config({ path: 'variables.env' });

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




//app.listen(5000, () => console.log('Express server is listening on port 5000'));

//app.get('/', verifyWebhook);
//const messageWebhook = require('./message-webhook');

//app.post('/', messageWebhook);
app.post('/webhook', (req, res) => {
  let body = req.body;

  //checks this is an event from the page subscreption
  if (body.object === 'page'{

  //Iterates over each netry - there may be multiple if batched
  body.entry.forEach(entry) {
    //get the message enry messaging is an array , but 
    //will only ever contain one message , so we get index 0
    let webhook_event = entry.messaging[0];
    console.log(webhook_event);
});
  res.status(200).send('EVENT_RECEIVED');
} else {
  //return a 404 not found if event is not from a page subscruption 
  res.sendStatus(404);
}
});
