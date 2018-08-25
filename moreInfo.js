        window.onload = function () {

            const path = require('path')
            const url = require('url')
            var mysql = require('mysql');

            var currSqlCreds = JSON.parse(localStorage.getItem("sqlCreds")); //gets current list of options for the parameter selected

            var con = mysql.createConnection({
              host: currSqlCreds[0],
              user: currSqlCreds[1],
              password: currSqlCreds[2],
              database: currSqlCreds[3],
              multipleStatements: true
            });
            id=location.search.split('id=')[1];
            var sel = "SELECT proj_name, full_name, phone_num, netID , association, color, printer, infill, resolution, material, time_hr, time_min, file, purpose, date FROM queue WHERE id="+id;
            con.connect(function(err) {
              if (err) throw err;
              console.log("Connected!");
              con.query(sel, function (err, result) {
                if(err) throw err;
                var field = result[0];
                console.log(field);
                var fileName = field.file.split(' ').pop(); 
                document.getElementById('projName').innerHTML = field.proj_name;
                document.getElementById('fullName').innerHTML = field.full_name;
                document.getElementById('phoneNum').innerHTML = field.phone_num;
                document.getElementById('netID').innerHTML = field.netID;
                document.getElementById('association').innerHTML = field.association;
                document.getElementById('color').innerHTML = field.color;
                document.getElementById('printer').innerHTML = field.printer;
                document.getElementById('infill').innerHTML = field.infill;
                document.getElementById('resolution').innerHTML = field.resolution;
                document.getElementById('material').innerHTML = field.material;
                document.getElementById('file').innerHTML = fileName;
                document.getElementById('purpose').innerHTML = field.purpose;
                document.getElementById('date').innerHTML = field.date;

              });
            });
             //shows parameter name to be edited


        }