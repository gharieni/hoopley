var mysql = require('mysql');

const pool = mysql.createPool({
  host : process.env.db-host,
  user : process.env.db-user,
  password :process.env.db-password,
  database : 'caremedb'
});

pool.getConnection(function(err,connection) {
  if (err) {
    return console.error('error: ' + err.message);
  }
  console.log('Connected to the MySQL Server.');
});


function queryDatabase(author){
  console.log('push to mysql')
  pool.query('INSERT INTO data SET ?', author, function (err, res) {
    if(err) throw err;
  });

  pool.on('release', function (connection) {
    console.log('Connection %d released', connection.threadId);
  });
};


var author = {age: '', sexe: '', height: '', weight: '',vaccin:'',  contact: '', relation: '', pcr: '', pathologie: '', symptom: '', symDate: ''};

var pushToMysql = (userId, intent, text) => {
  console.log(intent.displayName);
  switch(intent.displayName) {
    case 'Default Welcome Intent':
      break;
    case 'age':
      author.age = text;
      console.log('intent age here ');
      break;
    case 'Sexe':
      author.sexe = text;
      break;
    case 'height':
      author.height = text;
      break;
    case 'Weight':
      author.weight = text;
      break;
    case 'vaccin':
      author.vaccin = text;
      break;
    case 'contact with a positive of COVID-19?':
      author.contact = text;
      break;
    case 'contact-type':
      author.relation = text;
      break;
    case 'you have test for COVID-19':
      author.pcr = text;
      break;
    case 'pathologies?':
      author.pathologie = text;
      break;
    case 'symptoms':
      author.symptom = text;
      break;
    case 'symptoms - no':
      author.symptom = 'no symptom';
      queryDatabase(author);
      break;
    case 'symptom date':
      author.symDate = text;
      queryDatabase(author);
      break;
  } 
};
module.exports = pushToMysql;
