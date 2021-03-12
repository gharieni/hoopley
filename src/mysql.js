var mysql = require('mysql');

const pool = mysql.createPool({
  host : 'care-me-db.cmrrij8g9xe7.eu-west-3.rds.amazonaws.com',
  user : 'admin',
  password : '75lbt0u&'
});

/*
var sql = 'CREATE TABLE data (`age` INT , `sexe` VARCHAR(10) NOT NULL , `height` INT, `weight` INT, `contact` VARCHAR(100), `relation` VARCHAR(100), `pcr` VARCHAR(10),`pathologie` VARCHAR(100))';
connection.query(sql,  function (err, res) {
  if(err) throw err;
  console.log("Table created");
});
*/

function queryDatabase(author){
  pool.query('INSERT INTO data SET ?', author, function (err, res) {
    if(err) throw err;
    console.log('Last insert ID:', res.insertId);
  });
  console.log('_________________________________________________');
  pool.query("SELECT * FROM todos", function (err,rows) {
    if(err) throw err;
    console.log('Data received from Db:');
    console.log(rows);
  });

  console.log('intenet age here !');
  pool.release();
}


var author = {age: '', sexe: '', height: '', weight: '', contact: '', relation: '', pcr: '', pathologie: ''};

var pushToMysql = (userId, intent, text) => {

  console.log('function push mysql');
  console.log(intent.displayName);


  switch(intent.displayName) {
    case '1) Default Welcome Intent':
      pool.getConnection(function(err) {
        if (err) {
          return console.error('error: ' + err.message);
        }
        console.log('Connected to the MySQL Server.');
      });
      pool.query("USE caremedb", function(err) {
        if (err) throw err;
      });
      break;
    case '2) Data share':
      break;
    case 'age':
      author.age = text;
      console.log('intent age here ');
      break;
    case 'contact with a positive of COVID-19?':
      author.contact = text;
      break;
    case 'contact-type':
      break;
    case 'height':
      author.height = text;
      break;
    case 'pathologies?':
      author.pathologie = text;
      break;
    case 'Sexe':
      author.sexe = text;
      break;
    case 'symptoms':
      break;
    case 'Weight':
      author.weight = text;
      console.log('------------------------------');
      queryDatabase(author);
      break;
    case 'you have test for COVID-19':
      author.pcr = text;
      break;
    case 'symptom date':
      break;
  } 
};

module.exports = pushToMysql;
