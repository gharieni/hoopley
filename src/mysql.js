var mysql = require('mysql');

const pool = mysql.createPool({
  host : 'care-me-db.cmrrij8g9xe7.eu-west-3.rds.amazonaws.com',
  user : 'admin',
  password : '75lbt0u&',
  database : 'caremedb'
});

pool.getConnection(function(err,connection) {
  if (err) {
    return console.error('error: ' + err.message);
  }
  console.log('Connected to the MySQL Server.');
});

/*
var sql = 'CREATE TABLE data (`age` INT , `sexe` VARCHAR(10) NOT NULL , `height` INT, `weight` INT, `contact` VARCHAR(100), `relation` VARCHAR(100), `pcr` VARCHAR(10),`pathologie` VARCHAR(100))';
connection.query(sql,  function (err, res) {
  if(err) throw err;
  console.log("Table created");
});
*/

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
      console.log(text);
      author.symptom = text;
      break;
    case 'symptom date':
      author.symDate = text;
      queryDatabase(author);
      break;
  } 
  // to modify after install the card request for messanger 
  if (!author.symDate && (author.symptom == 'no' || author.symptom == 'No' || author.symptom == 'NO' ))
    queryDatabase(author);
};
module.exports = pushToMysql;
