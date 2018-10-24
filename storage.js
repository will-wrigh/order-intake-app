const {getCurrentWindow, globalShortcut} = require('electron').remote;
var colorArray = ["Purple","Blue"];
var printerArray = ["Taz","Monoprice","Form"];
var infillArray = ["5%","10%"];
var purposeArray = ["Personal","Academic"];
var resolutionArray = ["0.10"];
var schoolArray = ["Emory College", "School of Medicine", "Other"]

var Color = localStorage.setItem("Color", JSON.stringify(colorArray));
var Printer = localStorage.setItem("Printer", JSON.stringify(printerArray));
var Infill = localStorage.setItem("Infill", JSON.stringify(infillArray));
var Purpose = localStorage.setItem("Purpose", JSON.stringify(purposeArray));
var Resolution = localStorage.setItem("Resolution", JSON.stringify(resolutionArray));
var School = localStorage.setItem("School", JSON.stringify(schoolArray));

var newCreds = ["mysql.ecdsdev.org", "hortontestuser","f%jUY78NH$#mK87F", "hortontestdb"]
var x = localStorage.setItem("sqlCreds", JSON.stringify(newCreds)); //puts new array in storage