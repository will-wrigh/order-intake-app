        window.onload = function () {

            const path = require('path')
            const url = require('url')
            var mysql = require('mysql');
            var nodemailer = require('nodemailer');

            var currSqlCreds = JSON.parse(localStorage.getItem("sqlCreds")); //gets current list of options for the parameter selected

            var con = mysql.createConnection({
              host: currSqlCreds[0],
              user: currSqlCreds[1],
              password: currSqlCreds[2],
              database: currSqlCreds[3],
              multipleStatements: true
            });
            id=location.search.split('id=')[1];

            var netID = "";
            var full_name = "";

            var sel = "SELECT proj_name, full_name, phone_num, netID , association, color, printer, infill, resolution, material, time_min, file, purpose, date FROM queue WHERE id="+id;
            con.connect(function(err) {
              if (err) throw err;
              console.log("Connected!");
              con.query(sel, function (err, result) {
                if(err) throw err;
                var field = result[0];
                console.log(field);
                var fileName = field.file.split(' ').pop(); 

                netID = field.netID;
                full_name = field.full_name;

                document.getElementById('projName').innerHTML = field.proj_name;
                document.getElementById('fullName').innerHTML = full_name
                document.getElementById('phoneNum').innerHTML = field.phone_num;
                document.getElementById('netID').innerHTML = netID
                document.getElementById('association').innerHTML = field.association;
                document.getElementById('color').innerHTML = field.color;
                document.getElementById('printer').innerHTML = field.printer;
                document.getElementById('infill').innerHTML = field.infill;
                document.getElementById('resolution').innerHTML = field.resolution;
                document.getElementById('material').innerHTML = field.material;
                document.getElementById('file').innerHTML = fileName;
                document.getElementById('purpose').innerHTML = field.purpose;
                document.getElementById('date').innerHTML = field.date;
                var timeH = Math.floor(field.time_min/60);
                var timeM = Math.round(60*((field.time_min/60)%1))
                var timeT = timeH + "hr " + timeM + " min"
                document.getElementById('time').innerHTML = timeT;

              });
            });
             //shows parameter name to be edited

            var currEmailOps = JSON.parse(localStorage.getItem("emailOps"));
            var transporter = nodemailer.createTransport({ // to send emails
              service: currEmailOps[0],
              auth: {
                user: currEmailOps[1],
                pass: currEmailOps[2]
              }
            });

            
            const emailBtn = document.getElementById('send-email')
            emailBtn.addEventListener('click', function (event) {
                // var emailID = document.getElementById("posEmail").value.toString();
                // console.log(emailID);
                //need id, netid
                
                
                  // con.query(query, function (err, result) {
                    // if(err) throw err;
                    // var field = result[0]
                    var email = netID+"@emory.edu"
                    var name = full_name.split(' ')[0]
                    var eText = "Dear " + name + ",\n\n" + currEmailOps[4]

                    var mailOptions = {
                      from: currEmailOps[1],
                      to: email,
                      subject: currEmailOps[3],
                      text: eText
                    }
                    transporter.sendMail(mailOptions, function(error, info){
                      if (error) {
                        console.log(error);
                      } else {
                        console.log('Email sent: ' + info.response);
                      }
                    });

                    var update = "UPDATE queue SET emailSent = 'yes' WHERE id="+id+";";
                    con.query(update, function (err, result) { //update queue to set emailsent to yes
                      if(err) throw err;
                    });
                    alert("Email sent! Please refresh the queue.")
                
            });


        }