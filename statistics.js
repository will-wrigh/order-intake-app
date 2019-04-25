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

    var stringFields=["association", "color", "purpose", "printer"]
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

    // var startDateField = document.getElementById('start-date')
    var updateBtn = document.getElementById('update-btn')

    var startDate = document.getElementById('start-date').value.toString();
    // var endDate = document.getElementById('end-date').value.toString();
    // console.log(startDate)
    // console.log(endDate)

    var query = "SELECT date, COUNT(*), AVG(material), SUM(material), MAX(material), MIN(material), AVG(time_min), SUM(time_min), MAX(time_min), MIN(time_min) FROM queue WHERE date >='" + startDate +"';"

    con.query(query, function (err, result) {
      console.log(query)
      if(err) throw err;
      var field = JSON.parse(JSON.stringify(result))[0]
      // document.getElementById('nPrints').innerHTML = field["COUNT(*)"];
      document.getElementById('sumMaterial').innerHTML = field["SUM(material)"];
      document.getElementById('avgMaterial').innerHTML = field["AVG(material)"];
    });

    // var query = "SELECT COUNT(id),printer FROM queue GROUP BY printer"
    // var query = 
    // var query = "SELECT COUNT(id),material FROM queue GROUP BY material"
    //just gotta iterate thorugh these results and print out full result on sheet

    queries = ["SELECT COUNT(id),association FROM queue GROUP BY association","SELECT COUNT(id),printer FROM queue GROUP BY printer"]
    for (var i = 0; i < queries.length; i++){
      con.query(queries[i], function (err, result) {
        if(err) throw err;
        var field = JSON.parse(JSON.stringify(result))[0];
        // document.getElementById('nForm').innerHTML = field["COUNT(*)"];

        printersArray = createArray(result);
        createTable(printersArray);
      });
    }

    updateBtn.addEventListener('click',function(event){
      var startDate = document.getElementById('start-date').value.toString();
      // var endDate = document.getElementById('end-date').value.toString();
      console.log(startDate)
      // console.log(endDate)
      // var query = "SELECT date, AVG(material), SUM(material), MAX(material), MIN(material), AVG(time_min), SUM(time_min), MAX(time_min), MIN(time_min) FROM queue WHERE date >='" + startDate + "' AND date <='" + endDate + "';"
      var query = "SELECT date, COUNT(*), AVG(material), SUM(material), MAX(material), MIN(material), AVG(time_min), SUM(time_min), MAX(time_min), MIN(time_min) FROM queue WHERE date >='" + startDate +"';"

      con.query(query, function (err, result) {
        console.log(query)
        if(err) throw err;
        var field = JSON.parse(JSON.stringify(result))[0]
        // document.getElementById('nPrints').innerHTML = field["COUNT(*)"];
        document.getElementById('sumMaterial').innerHTML = field["SUM(material)"];
        document.getElementById('avgMaterial').innerHTML = field["AVG(material)"];
      });

      // var query = "SELECT COUNT(id),printer FROM queue GROUP BY printer"
      // var query = 
      // var query = "SELECT COUNT(id),material FROM queue GROUP BY material"
      //just gotta iterate thorugh these results and print out full result on sheet

      queries = ["SELECT COUNT(id),association FROM queue GROUP BY association","SELECT COUNT(id),printer FROM queue GROUP BY printer"]
      for (var i = 0; i < queries.length; i++){
        con.query(queries[i], function (err, result) {
          if(err) throw err;
          var field = JSON.parse(JSON.stringify(result))[0];
          // document.getElementById('nForm').innerHTML = field["COUNT(*)"];

          printersArray = createArray(result);
          createTable(printersArray);
        });
      }
        
    });

  function createTable(tableData) {
    var table = document.createElement('table');
    table.className += " table";
    table.setAttribute("id", "content");
    table.setAttribute("style", "width: 50%;");
    var tableBody = document.createElement('tbody');

    tableData.forEach(function(rowData) {
      var row = document.createElement('tr');

      rowData.forEach(function(cellData) {
        var cell = document.createElement('td');
        cell.appendChild(document.createTextNode(cellData));
        row.appendChild(cell);
      });

      tableBody.appendChild(row);
    });

    table.appendChild(tableBody);
    document.body.appendChild(table);
    var br = document.createElement('br');
    document.body.appendChild(br);
  }

  function createArray(result){
    type = Object.keys(result[0])[1]

    printersArray = []
    printersArray.push([type, "count"])
    count = 1;
    for (var i = 0; i < result.length; i++) {
      if ((result[i]["COUNT(id)"]) > 1){
        printersArray.push([])
        printersArray[count].push(result[i][type])
        printersArray[count].push(result[i]["COUNT(id)"])
        count = count + 1
      }
    }
    return printersArray;
  }

}
