window.onload = function () {
    const BrowserWindow = require('electron').remote.BrowserWindow
    const path = require('path')
    const url = require('url')
    var mysql = require('mysql');
    const {shell} = require('electron');
    var nodemailer = require('nodemailer');

    var currSqlCreds = JSON.parse(localStorage.getItem("sqlCreds")); //gets current list of options for the parameter selected
    // console.log(currSqlCreds);
    var con = mysql.createConnection({
      host: currSqlCreds[0],
      user: currSqlCreds[1],
      password: currSqlCreds[2],
      database: currSqlCreds[3],
      multipleStatements: true
    });

    var transporter = nodemailer.createTransport({ // to send emails
      service: 'gmail',
      auth: {
        user: 'shalsree781@gmail.com',
        pass: ''
      }
    });

  var info = [ //shows up before sql data loads
        {
            name:'MakeEmory'
            // file: 'thing.stl',
            // date: '05/15/2009',2
            // completed: 'no',
            // emailSent: 'no',
            // paidFor: 'no',
            // imageTaken: 'no',
            // estCost: ''
        }
    ];

    const exportFile = document.getElementById('exportFileButton');
    exportFile.addEventListener('click', function() {
        var exportPlugin = hot.getPlugin('exportFile');
        exportPlugin.downloadFile('csv', {filename: 'Queue.csv'});
    });

    var hotElement = document.querySelector('#hot');
    var hotElementContainer = hotElement.parentNode;
    var hotSettings = {
        data: info,
        columns: [
            {
                data: 'id',
                //readOnly: true
                editor: false,
                renderer:"html"
            },
            {
                data: 'name',
                editor: false,
                width: 150
            },
            {
                data: 'file',
                editor: false,
                //renderer:renderButtons
                renderer:"html",
                width: 200
            },
            {
                data: 'date',
                type: 'date',
                dateFormat: 'MM/DD/YYYY',
                editor: false
            },
            {
                data: 'estCost',
                type: 'numeric',
                numericFormat: {
                    pattern: '$0,0.00',
                    culture: 'en-US' // this is the default culture, set up for USD
                },
                editor: false
            },
            {
                data: 'material',
                type: 'numeric',
                editor: false
            },
            {
                data: 'completed'
            },
            {
                data: 'emailSent'
            },

            {
                data: 'imageTaken'
            },
            {
                data: 'paidFor'
            },
            {
                data: 'comments'
            },
            {
                data: 'printer'
            }
        ],
        stretchH: 'all',
        autoWrapRow: true,
        persistentState: true,
        height: 500,
        minRows:20,
        rowHeaders: false,
        colHeaders: [
            'ID','Name','File Name','Date','Cost','Material','Completed','Email Sent','Image Taken','Paid For','Comments','Printer'
        ],
        contextMenu: true,
        filters: true,
        //dropdownMenu: true,
        allowInsertRow: true,
        comments: true,
        //colWidths:[50,50,50,50,50,50,50,50,50,50,50,50,50],
        hiddenColumns:{columns:[11]}
        
    };
    var hot = new Handsontable(hotElement, hotSettings);

    var newDataArray = [
            ];
    var i = 0;
    var k = 0;
    var sel = "SELECT id,netID,full_name,file,time_hr,material,completed,paidFor,emailSent,imageTaken,date,material,comments,printer FROM queue";
    
    con.connect(function(err) { //connect to database
      if (err) throw err;
      console.log("Connected!");
      con.query(sel, function (err, result) {
        // console.log(result)
        for(r of result){ //for each row in the table
            if (err) throw err;
            var field = r;
            // console.log(field);
            var name = field.full_name + " (" + field.netID + ")";
            var material = field.material;
            var cost = (material - (material%100))/100; //integer division to get cost
            var costResin = (material - (material%50))/50; //integer division to get cost
            var file = field.file;
            if (file!=null){
                var fileName = file.split(' ').pop(); //get last part of file path as file name
                var fileType = fileName.split('.').pop(); //get part after period as file type    
            }
            else {
                var fileName = ""
                var fileType = ""
            }

            if (fileType=='form') {
                material = material + " mL";
                cost = (costResin+1)*4; //cost for resin 
            }
            else {
                material = material + " g";
                cost = (cost+1)*2; //cost for pla
            }

            newDataArray.push([field.id,name,createNew(fileName,field.id),field.date,cost,material,field.completed,field.emailSent,field.imageTaken,field.paidFor,field.comments,field.printer]);
            k+=1;
        }
        localStorage.setItem("data", JSON.stringify(hot.getData()));
        hot.populateFromArray(0, 0, newDataArray);
        hot.render();
         //put data array in local storage
      });
    });

    function createNew(file,id){ //creates button with link to open more info page with corresponding id (this func is called when creating each new row)
        var html = "<button id='new' style='background: none;border: none;text-decoration: underline;color: blue;' onclick=window.open(&quot;moreInfo.html&quot;+'?id='+"+id+")>"+file+"</button>"
        return html
    };

    const saveBtn = document.getElementById('saveBtn');
    saveBtn.addEventListener('click', function() { //saves the data in 'updates' rows by updating each row in database

        var data = hot.getData();
        var updates = ['completed','emailSent','paidFor','imageTaken','comments'] 

        for (i = 0; i < data.length; i++) { 
            if(data[i][0]!=null){ //skips empty rows 
                for (k = 6; k < 11; k++) { //loops through columns 6-11 and updates database
                    query = " UPDATE queue SET " + updates[k-6] + " = '" + data[i][k] +"' WHERE id=" + data[i][0]+";";
                    con.query(query, function (err, result) {
                        if(err) throw err;
                    });

                }
            }
            // if (data[i][1] == ""){
            //     var delData = "DELETE FROM queue WHERE id = " + data[i][0]
            //         con.query(delData, function (err, result) {
            //             if(err) throw err;
            //         });
            // }
        }
        alert('Saving...please wait 5s before closing!')
    });

    const statsWindowBtn = document.getElementById('stats-window')
    statsWindowBtn.addEventListener('click', function (event) {
        let win = new BrowserWindow({ width: 700, height: 500})
        win.loadURL('file://' + __dirname + '/statistics.html');
        win.on('close', function () { win = null })
        win.show()
    });

    function resetRows(count){
        hot.addHook('modifyRow', function(row) {
                return row <= count ? row : null;
            });
        hot.render();
    }

    var data = hot.getData();
    var options = []
    for (k = 0; k < data.length; k++){
        options[k] = data[k][0]
    }
    //var posName = data[0:data.length]
    //JSON.parse(localStorage.getItem(p)); //get names of options list 
    // var optionsList = document.getElementById("posEmail");
    // // options.unshift("All"); //adds to beginning of array

    // updateDisplay(options,optionsList); //sets the possible names to email to every name in database 

    // const sendEmail = document.getElementById('posEmail');
    // sendEmail.addEventListener('change',function(event){
    //     var toSendName = sendEmail.options[sendEmail.selectedIndex].text;

    // });

    // const printer = document.getElementById('prefPrinter');
    // printer.addEventListener('change',function(event){
    //     var countSourceRows = hot.countSourceRows() - 1;
    //     var printType = printer.options[printer.selectedIndex].text;
    //     var data = hot.getData();

    //     //if (printType=="All"){
    //     hot.populateFromArray(0, 0, newDataArray);
    //     hot.render();
    //     //}
    //     //else{
    //         hot.addHook('modifyRow', function(row) {
    //             var rowOffset = 0;
    //             var numRowsHidden =  0;
    //             var rowsToHide = [];
    //             var j = 0;
    //             if (printType!="All"){
    //                 for (i = 0; i < data.length; i++) { //find which rows to hide
    //                     if(data[i][0]!=null){
    //                             if (data[i][11]!=printType){ //if form print
    //                                 rowsToHide[j] = i;
    //                                 j++;
    //                             }
    //                     } 
    //                 }

    //                 for (k = 0; k < rowsToHide.length;k++){ //calculate offset of rows
    //                     if (row >= rowsToHide[k]-numRowsHidden) { 
    //                         rowOffset = rowOffset + 1;
    //                         numRowsHidden++;
    //                     }
    //                 }

    //             }
    //             row = row + rowOffset;
    //             return row <= countSourceRows ? row : null;
    //         });
    //         hot.render();
    //     //}
    //     // else{
    //     //     hot.render();
    //     // }
    // });

    function getHotData(){
        return hot.getData();
    }


    // var p = "Printer"
    // var options = JSON.parse(localStorage.getItem(p));
    // var optionsList = document.getElementById("prefPrinter");
    // // options.unshift("All"); //adds to beginning of array

    // console.log(options)
    // updateDisplay(options,optionsList);


    function updateDisplay(options, optionList){
      var len = options.length
      for(i = optionList.options.length - 1 ; i >= 0 ; i--) //empty previously displayed list
        {
            optionList.remove(i);
        }

      if (options!=null){ //display selected list
          for(j = 0; j < len;j++){
          var x = options[j];
          if (x!=null) optionList.options.add(new Option(x,j,x.selected)); 
        }
      }

    }

//     const emailBtn = document.getElementById('send-email')
//     emailBtn.addEventListener('click', function (event) {
//         //need id, netid
//         var query = "SELECT full_name,netID,proj_name FROM queue WHERE id=29;"

//         console.log(query)
        
//           con.query(query, function (err, result) {
//             if(err) throw err;
//             var field = result[0]
//             var email = field.netID+"@emory.edu"
//             var name = field.full_name.split(' ')[0]
//             var eText = "Hello " + name + "!\nYour " + field.proj_name + " 3D print is ready for pickup at the TechLab at MakeEmory!\nOur hours are Monday-Thursday 12pm-8pm and Friday 12pm-5pm. \nBest, \nMakeEmory Staff"
//             var mailOptions = {
//               from: 'shalsree781@gmail.com',
//               to: email,
//               subject: 'Your 3D Print is Ready at MakeEmory',
//               text: eText
//             }
//             transporter.sendMail(mailOptions, function(error, info){
//               if (error) {
//                 console.log(error);
//               } else {
//                 console.log('Email sent: ' + info.response);
//               }
//             });
//         });
        
        
//     });

 }
