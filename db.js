var mysql = require('mysql');

var con = mysql.createConnection({
  host: "mysql.ecdsdev.org",
  user: "hortontestuser",
  password: "f%jUY78NH$#mK87F",
  database: "hortontestdb"
});

//todo - change all times before 105ish to last 2 chars plus all before that ie 10005 = 100+05 = 105
// var create = "CREATE TABLE queue (id INT AUTO_INCREMENT PRIMARY KEY, proj_name VARCHAR(255), full_name VARCHAR(255), phone_num INT, netID VARCHAR(255), association VARCHAR(255), color VARCHAR(255), printer VARCHAR(255), infill VARCHAR(255), resolution  VARCHAR(255), material INT, time_hr INT, time_min INT, file VARCHAR(255), purpose VARCHAR(255), date VARCHAR(255), completed VARCHAR(255) DEFAULT 'no', emailSent VARCHAR(255) DEFAULT 'no', paidFor VARCHAR(255) DEFAULT 'no', imageTaken VARCHAR(255) DEFAULT 'no')";
// var add = "INSERT INTO queue (proj_name, full_name) VALUES ('Koala', 'Joe')";
 // var sel = "SELECT * FROM queue where date > '2019-01-01'"
 // var sel = "SELECT * FROM queue WHERE date > '2019-01-01' "
 // var sel  = "SELECT COUNT(id),printer FROM queue GROUP BY printer"
 var sel = "SELECT COUNT(id),association FROM queue GROUP BY association"

 // var sel = "SELECT * FROM queue WHERE DATE(date) BETWEEN '2018-01-01' AND '2018-11-11'"
 //var add = "INSERT INTO queue (proj_name, full_name, phone_num, netID , association, color, printer, infill, resolution, material, time_min, file, purpose, date, comments) \
                              //VALUES ('','Kevin Kirsch', '','kdkirsc','Emory University','White','Form','5%','0.10',5,10,'slep.form','Personal','9/4/2018','')"
// var alter = "ALTER TABLE queue ADD COLUMN comments VARCHAR(255)"
// var del = "ALTER TABLE queue DROP COLUMN completed"
// var addCol = "ALTER TABLE queue ADD COLUMN completed VARCHAR(255) DEFAULT 'no'"
//var change = "UPDATE queue SET time_min = 1413 WHERE id=106"
//var delData = "DELETE FROM queue WHERE id =114 "
con.connect(function(err) {
  console.log(sel);
  if (err) throw err;
  console.log("Connected!");

  con.query(sel, function (err, result) {
    if (err) throw err;
    // console.log("record inserted");
    console.log(result);
     for (var i = 0; i < result.length; i++) {
      console.log(result[i]["COUNT(id)"])
    }
  });
  con.end();
});
