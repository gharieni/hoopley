var mysql = require('mysql');



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


  function queryDatabase(){
connection.query("USE caremedb", function(err) {
  if (err) throw err;
});
/*
var sql = 'CREATE TABLE data (`age` INT , `sexe` VARCHAR(10) NOT NULL , `height` INT, `weight` INT, `contact` VARCHAR(100), `relation` VARCHAR(100), `pcr` VARCHAR(10),`pathologie` VARCHAR(100))';
connection.query(sql,  function (err, res) {
  if(err) throw err;
  console.log("Table created");
});


*/

var author = {age: '30', sexe: 'male', height: '180', weight: '80', contact: 'yes', relation: 'famely', pcr: 'yes', pathologie: 'hypertention'};

connection.query('INSERT INTO data SET ?', author, function (err, res) {
  if(err) throw err;
  console.log('Last insert ID:', res.insertId);
});

connection.query("SELECT * FROM todos", function (err,rows) {
  if(err) throw err;
  console.log('Data received from Db:');
  console.log(rows);
});

connection.end();
}

var pushToMysql = (userId, intent) => {
  console.log('function push mysql');
  console.log(intent.displayName);

};

module.exports = pushToMysql;
