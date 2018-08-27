// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const BrowserWindow = require('electron').remote.BrowserWindow
const path = require('path')
var mysql = require('mysql')
const fs = require('fs')
const dialog = require('electron').remote.dialog
const {getCurrentWindow, globalShortcut} = require('electron').remote;
  //remote = require('remote'),
  //dialog = remote.require('dialog');

var sqlCreds = ["mysql.ecdsdev.org","hortontestuser","f%jUY78NH$#mK87F","hortontestdb"];
var x = localStorage.setItem("sqlCreds", JSON.stringify(sqlCreds));
var currSqlCreds = JSON.parse(localStorage.getItem("sqlCreds")); //gets current list of options for the parameter selected

var con = mysql.createConnection({
  host: currSqlCreds[0],
  user: currSqlCreds[1],
  password: currSqlCreds[2],
  database: currSqlCreds[3]
});

var info = []

var i = 0

const printer = document.getElementById('prefPrinter');
const fileSel = document.getElementById('file');

printer.addEventListener('change',function(event){
  var printerOptions = document.getElementById("prefPrinter"); 
  var printType = printerOptions.options[printerOptions.selectedIndex].text;
  console.log(printType)
  //var printType = document.getElementById("prefPrinter").value.toString(); //find which printer the user selected
  if ((printType=='Form')){
      document.getElementById('units').innerHTML = 'mL'; //changes material units to grams for Taz or Monoprice Prints
  }
  else{
    document.getElementById('units').innerHTML = 'g' //changes material units to mL for printers other than Taz or Monoprice
  }
});

fileSel.addEventListener('change',function(event){
  var printerOptions = document.getElementById("prefPrinter"); 
  var printType = printerOptions.options[printerOptions.selectedIndex].text.toString();
  file=document.getElementById("file");
  myfile=document.getElementById("file").value.toString(); //find which parameter the user selected
  var errors = checkPrintType(myfile,printType);
  if (errors!=""){
    alert(errors);
    file.value="";
  }
  //errors = ""
  //var ext = myfile.split('.').pop();
  // if (printType=='Form'){
  //   if(ext=="form"){
  //   }
  //   else{
  //     errors+=("Invalid File Extension: ." + ext + " Should be .form for " + printType)
  //     file.value = "" // clears value
  //   }
  // }
  // else{
  //   if(ext=="amf"){
  //   }
  //   else{
  //     errors+=("Invalid File Extension: ." + ext + " Should be .amf for " + printType)
  //     file.value = ""    } 
  // }
  // return errors
});

function checkPrintType(myfile,printType){
  errors = ""
  if (myfile=="") return "";
  var ext = myfile.split('.').pop();
  if (printType=='Form'){
    if(ext=="form"){
    }
    else{
      errors+=("Invalid File Extension: ." + ext + " Should be .form for " + printType+"\n")
      //file.value = "" // clears value
    }
  }
  else{
    if(ext=="amf"){
    }
    else{
      errors+=("Invalid File Extension: ." + ext + " Should be .amf for " + printType+"\n")
      //file.value = ""    
    } 
  }
  return errors;
}

const newProject = document.getElementById('add-proj')
newProject.addEventListener('click', function (event) {

  var projName = document.getElementById("projName").value.toString();
  var fullName = document.getElementById("fullName").value.toString();
  var netID = document.getElementById("netID").value.toString();
  var phoneV = document.getElementById("phoneNum").value;
  var timeHV = document.getElementById("timeH").value;
  var timeMV = document.getElementById("timeM").value;
  var phone = document.getElementById("phoneNum").value.toString();
  var timeH = document.getElementById("timeH").value.toString();
  var timeM = document.getElementById("timeM").value.toString();
  var time = timeH*60+timeM

  var schoolSel = document.getElementById("prefSchool");
  var school = schoolSel.options[schoolSel.selectedIndex].text;
  var colorSel = document.getElementById("prefColor");
  var color = colorSel.options[colorSel.selectedIndex].text;
  var printerSel = document.getElementById("prefPrinter");
  var printer = printerSel.options[printerSel.selectedIndex].text;
  var infillSel = document.getElementById("prefInfill");
  var infill = infillSel.options[infillSel.selectedIndex].text;
  var resolutionSel = document.getElementById("prefResolution");
  var resolution = resolutionSel.options[resolutionSel.selectedIndex].text;
  var purposeSel = document.getElementById("prefPurpose");
  var purpose = purposeSel.options[purposeSel.selectedIndex].text;


  var errors = "Errors: \n"
  var file = document.getElementById("file");
  if (file.value!=""){
    var fileName = file.files[0].path.toString();
    fileName = fileName.replace(/(\\|\/)/g, ' ');
    var fileN = fileName.split(' ').pop();  
    //var fileName = String(file).split(/(\\|\/)/g).pop();
    console.log(fileName);
  }
  else{
    errors += "No file added.\n"
  }



  var material = document.getElementById("material").value.toString(); //todo add g and mL

  var date = new Date();
  var fullDate = (date.getMonth()+1) + '/' + date.getDate() + '/' + date.getFullYear();

  //var dataArray = [[fullName,fileName, fullDate,'no','no','no','no',cost],[]];
  //var otherData = [netID,phone,school,color,printer,infill,resolution,time]
  //localStorage.setItem("addedData", JSON.stringify(dataArray));
  //localStorage.setItem("dataArray", JSON.stringify(otherData));

  phoneNumStr = phone.toString()
  // if (phoneNumStr.length!=10 || phoneNumStr.length!=11){ //checks if phone number is the normal 10 or 11 digits long
  //   console.log(phoneNumStr.length);
  //   errors += "Phone number is invalid.\n"
  // }
  var comments = "";
  var printerOptions = document.getElementById("prefPrinter"); 
  var printType = printerOptions.options[printerOptions.selectedIndex].text.toString();
  file=document.getElementById("file");
  myfile=document.getElementById("file").value.toString(); //find which parameter the user selected
  
  var printErrors = checkPrintType(myfile,printType);
  if (printErrors!=""){
    errors+=printErrors;
    file.value="";
  }
  if (fullName.indexOf(" ") == -1){ //error if no space in full name box
    errors += "Full name should be first and last name.\n"
  }  
  if ((phoneV!="") && isNaN(parseInt(phone))){
    errors+="Enter a valid phone number.\n"
  }
  if (parseInt(material)<=0 || isNaN(parseInt(material))){
    errors+="Enter valid material amount.\n"
  }
  if ( ( (timeHV!="") && (timeMV!="") ) &&  (isNaN(parseInt(timeH)) || isNaN(parseInt(timeM))) ){
    errors+="Enter a valid time.\n"
  }

  if (timeM > 60){ //checks if phone number is the normal 10 or 11 digits long
    errors += "Time should be in hours and minutes.\n"
  }
  if (netID == ""){
    errors += "Enter a netID.\n"
  }
  if (errors!="Errors: \n"){
    alert(errors);
  }
  else{
    var alertA = "Successfully added print! Open the queue to check it out."
      console.log(fileName);
      var add = "INSERT INTO queue (proj_name, full_name, phone_num, netID , association, color, printer, infill, resolution, material, time_min, file, purpose, date, comments) VALUES ('"  
       + projName + "','" + fullName + "', '" + phone + "','" + netID + "','" + school + "','" + color + "','" + printer + "','" + infill + "','" + resolution + "','" + material+ "','" + time + "','" + fileName + "','" + purpose+"','"+fullDate+"','"+comments+"')";
      con.connect(function(err) {
      if (err) throw err;
      console.log("Connected!");
      con.query(add, function (err, result) { 
        if (err) throw err;
        // alertA += projName + " print added!";
        
        console.log(result);
      });
      con.end();
      });
      alert(alertA);
      getCurrentWindow().reload();
  }
  var path = "C:\\Users\\shali\\Desktop\\Fall18\\" + netID
  var dir = "C:\\Users\\shali\\Desktop\\Fall18\\" + netID + "\\"
  if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
  }
    filePath = path+"\\"+fileN
      fs.writeFileSync(filePath, file.value, function (err) {
        if (err === undefined) {
          console.log("saved");
          console.log(filePath)
          dialog.showMessageBox({
            message: 'The file has been saved!',
            buttons: ['OK']
          });
        } else {
          dialog.showErrorBox('File save error', err.message);
        }
      });
  

});

const newWindowBtn = document.getElementById('queue-window')
newWindowBtn.addEventListener('click', function (event) {

  let win = new BrowserWindow({ width: 1100, height: 700})
  
	win.loadURL('file://' + __dirname + '/queue.html');
	  win.on('close', function () { 
      win = null;
    })
	  win.show()
	});

const optionsWindowBtn = document.getElementById('options-window')
optionsWindowBtn.addEventListener('click', function (event) {

  let win = new BrowserWindow({ width: 400, height: 550})
  
	win.loadURL('file://' + __dirname + '/options.html');
	  win.on('close', function () { win = null })
	  win.show()
	});

//var selectOptions = ["Color", "Printer", "Infill", "Purpose", "Resolution"];
var selectOptions = ["Color", "Printer", "Infill", "Purpose", "Resolution", "School"];

for (k = 0; k < selectOptions.length; k++){  //updates dropdown lists 
  var options = JSON.parse(localStorage.getItem(selectOptions[k]));
  var listName = "pref"+selectOptions[k] //ie prefPrinter
  var optionsList = document.getElementById(listName);
  updateDisplay(options,optionsList);
}


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
var bgd = (localStorage.getItem("background")); //gets current list of options for the parameter selected
console.log(bgd);
document.getElementById('background').style.background = "url(file:///images/" + bgd + ")";
document.getElementById('background').style.backgroundRepeat = false;
// document.getElementById('background').style.background-size = "cover";
            //var data = win.getHotData();
           //  var data = localStorage.getItem("data")
           //  var update = "UPDATE queue SET material = '2' WHERE id=1"
           //  var updates = ['completed','emailSent','paidFor','imageTaken']
           // // con.end();
           //  //con.connect(function(err) {
           //      //if (err) throw err;
           //    console.log("Connected!");

           //      for (i = 0; i < data.length; i++) { 
           //          if(data[i][0]!=null){
           //              for (k = 4; k < 8; k++) { //loops through columns 4-8 and updates database
           //                  query = " UPDATE queue SET " + updates[k-4] + " = '" + data[i][k] +"' WHERE id=" + data[i][0]+";";
           //                  console.log(query)
           //                  con.query(query, function (err, result) {
           //                      if(err) throw err;
           //                      console.log(result)
           //                      //con.end();
           //                  });

           //              }
           //          }
           //      }