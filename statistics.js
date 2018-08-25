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

    var query = "SELECT AVG(material), SUM(material), MAX(material), MIN(material), AVG(time_min), SUM(time_min), MAX(time_min), MIN(time_min) FROM queue;"

    console.log(query)
    
    con.connect(function(err) {
      if (err) throw err;
      console.log("Connected!");
      con.query(query, function (err, result) {
        if(err) throw err;
        var field = JSON.parse(JSON.stringify(result))[0]
        document.getElementById('sumMaterial').innerHTML = field["SUM(material)"];
        document.getElementById('avgMaterial').innerHTML = field["AVG(material)"];
        document.getElementById('maxMaterial').innerHTML = field["MAX(material)"];
        document.getElementById('minMaterial').innerHTML = field["MIN(material)"];
        document.getElementById('sumTime').innerHTML = field["SUM(time_min)"];
        document.getElementById('avgTime').innerHTML = field["AVG(time_min)"];
        document.getElementById('maxTime').innerHTML = field["MAX(time_min)"];
        document.getElementById('minTime').innerHTML = field["MIN(time_min)"];
      });
    });

    modeQuery = ""
    for (i in stringFields){
      modeQuery = " SELECT " + stringFields[i] + " FROM queue GROUP BY " + stringFields[i] + " ORDER BY COUNT(*) DESC LIMIT 1;"
      k=0;
      con.query(modeQuery, function(err,result){
          if (err) throw err;
          var field = result[0]
          var elementId = stringFields[k] + "Mode"
          var name = stringFields[k]
          document.getElementById(elementId).innerHTML = field[name];
          k+=1
      });
    }

    var startDateField = document.getElementById('start-date')
    var startDate = document.getElementById('start-date').value.toString();
    var endDate = document.getElementById('end-date').value.toString();
    console.log(startDate)
    console.log(endDate)
    startDateField.addEventListener('change',function(event){

      var query = "SELECT date, AVG(material), SUM(material), MAX(material), MIN(material), AVG(time_min), SUM(time_min), MAX(time_min), MIN(time_min) FROM queue WHERE date >='" + startDate + "' AND date <='" + endDate + "';"
      con.query(query, function (err, result) {
        if(err) throw err;
        var field = JSON.parse(JSON.stringify(result))[0]
        document.getElementById('sumMaterial').innerHTML = field["SUM(material)"];
        document.getElementById('avgMaterial').innerHTML = field["AVG(material)"];
      });
    });

}
