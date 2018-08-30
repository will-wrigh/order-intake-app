var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'shalsree781@gmail.com',
    pass: 'Iwalrto1tIhek'
  }
});
            var mysql = require('mysql');
            var currSqlCreds = JSON.parse(localStorage.getItem("sqlCreds")); //gets current list of options for the parameter selected

            var con = mysql.createConnection({
              host: currSqlCreds[0],
              user: currSqlCreds[1],
              password: currSqlCreds[2],
              database: currSqlCreds[3],
              multipleStatements: true
            });

            var query = "SELECT full_name,netID,proj_name FROM queue WHERE id=28;"

            console.log(query)
            
            con.connect(function(err) {
              if (err) throw err;
              console.log("Connected!");
              con.query(query, function (err, result) {
                if(err) throw err;
                var field = JSON.parse(JSON.stringify(result))[0]
                document.getElementById('sumMaterial').innerHTML = field["full_name"];
                var email = field["netID"]+"@emory.edu"
                var name = field["full_name"].split(' ')[0]
                var eText = "Hello " + name + "! Your " + field["proj_name"] + " 3D print is ready for pickup at the TechLab at MakeEmory!\n Our hours are Monday-Thursday 12pm-8pm and Friday 12pm-5pm. \n Best, MakeEmory Staff"
                var mailOptions = {
                  from: 'shalsree781@gmail.com',
                  to: email,
                  subject: 'Your 3D Print is Ready at MakeEmory',
                  text: eText
                };
                alert("Email sent!")
              });
            });


// var transporter = nodemailer.createTransport({
//     host: "smtp-mail.outlook.com", // hostname
//     secureConnection: false, // TLS requires secureConnection to be false
//     port: 587, // port for secure SMTP
//     tls: {
//        ciphers:'SSLv3'
//     },
//     auth: {
//         user: 'ssreed3@emory.edu',
//         pass: ''
//     }
// });

// var mailOptions = {
//   from: 'shalsree781@gmail.com',
//   to: 'shalini.sreedhar29@gmail.com',
//   subject: 'Your 3D Print is Ready',
//   text: 'Hello! Your 3D print is ready for pickup at the TechLab at MakeEmory!'
// };

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});