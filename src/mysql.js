var mysql = require('mysql');











/*
var sql = 'CREATE TABLE data (`age` INT , `sexe` VARCHAR(10) NOT NULL , `height` INT, `weight` INT, `contact` VARCHAR(100), `relation` VARCHAR(100), `pcr` VARCHAR(10),`pathologie` VARCHAR(100))';
connection.query(sql,  function (err, res) {
  if(err) throw err;
  console.log("Table created");
});


*/
function queryDatabase(author){
  connection.query('INSERT INTO data SET ?', author, function (err, res) {
    if(err) throw err;
    console.log('Last insert ID:', res.insertId);
  });
  console.log('_________________________________________________');
  connection.query("SELECT * FROM todos", function (err,rows) {
    if(err) throw err;
    console.log('Data received from Db:');
    console.log(rows);
  });

  connection.end();
}


var author = {age: '', sexe: '', height: '', weight: '', contact: '', relation: '', pcr: '', pathologie: ''};

var pushToMysql = (userId, intent, text) => {




  function connectToDatabase(){
    const connection = mysql.createConnection({
      host : 'care-me-db.cmrrij8g9xe7.eu-west-3.rds.amazonaws.com',
      user : 'admin',
      password : '75lbt0u&',
    });
    return new Promise((resolve,reject) => {
      connection.connect();
      resolve(connection);
    });
  }
  console.log('function push mysql');
  console.log(intent.displayName);


  switch(intent.displayName) {
    case '1) Default Welcome Intent':
      connectToDatabase();
      connection.query("USE caremedb", function(err) {
        if (err) throw err;
      });
      break;
    case '2) Data share':
      break;
    case 'age':
      author.age = text;
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
      break;
    case 'you have test for COVID-19':
      author.pcr = text;
      break;
    case 'symptom date':
      queryDatabase(author);
      break;
  } 
  // if (result.intent.displayName ===  ) {
};


module.exports = pushToMysql;







