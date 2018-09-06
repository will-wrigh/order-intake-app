var mysql = require('mysql');

var con = mysql.createConnection({
  host: "mysql.ecdsdev.org",
  user: "hortontestuser",
  password: "f%jUY78NH$#mK87F",
  database: "hortontestdb"
});


// var create = "CREATE TABLE queue (id INT AUTO_INCREMENT PRIMARY KEY, proj_name VARCHAR(255), full_name VARCHAR(255), phone_num INT, netID VARCHAR(255), association VARCHAR(255), color VARCHAR(255), printer VARCHAR(255), infill VARCHAR(255), resolution  VARCHAR(255), material INT, time_hr INT, time_min INT, file VARCHAR(255), purpose VARCHAR(255), date VARCHAR(255), completed VARCHAR(255) DEFAULT 'no', emailSent VARCHAR(255) DEFAULT 'no', paidFor VARCHAR(255) DEFAULT 'no', imageTaken VARCHAR(255) DEFAULT 'no')";
// var add = "INSERT INTO queue (proj_name, full_name) VALUES ('Koala', 'Joe')";
// var sel = "SELECT * FROM queue"
// var alter = "ALTER TABLE queue ADD COLUMN comments VARCHAR(255)"
// var del = "ALTER TABLE queue DROP COLUMN completed"
// var addCol = "ALTER TABLE queue ADD COLUMN completed VARCHAR(255) DEFAULT 'no'"
// var change = "UPDATE queue SET completed = 'no',completed='yes' WHERE id=1,id=14"
var delData = "DELETE FROM queue WHERE id =72 "
con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
  con.query(delData, function (err, result) {
    if (err) throw err;
    // console.log("record inserted");
    console.log(result);
  });
  con.end();
});
