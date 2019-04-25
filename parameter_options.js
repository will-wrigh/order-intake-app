window.onload = function () {
const BrowserWindow = require('electron').remote.BrowserWindow;


function updateDisplay(options, optionList){

	for(i = optionList.options.length - 1 ; i >= 0 ; i--) //empty previously displayed list
    {
        optionList.remove(i);
    }

	if (options!=null){ //display selected list
		for(k = 0; k < options.length;k++){
			var x = options[k];
			optionList.options.add(new Option(x,k,x.selected)); 
		}
	}
}

const addButton = document.getElementById('addOption');
const delButton = document.getElementById('deleteOption');
const paramSel = document.getElementById('parameter');

var colorArray = ["White","Black"];
var printerArray = ["Taz","Form"];
var infillArray = ["5%","10%"];
var purposeArray = ["Personal","Academic"];
var resolutionArray = ["0.10", "0.20"];
var schoolArray = ["Emory College", "School of Medicine", "Other"]

if (localStorage.getItem("is_first_open")==null){
	console.log('here')
	var Color = localStorage.setItem("Color", JSON.stringify(colorArray));
	var Printer = localStorage.setItem("Printer", JSON.stringify(printerArray));
	var Infill = localStorage.setItem("Infill", JSON.stringify(infillArray));
	var Purpose = localStorage.setItem("Purpose", JSON.stringify(purposeArray));
	var Resolution = localStorage.setItem("Resolution", JSON.stringify(resolutionArray));
	var School = localStorage.setItem("School", JSON.stringify(schoolArray));
}

paramSel.addEventListener('change',function(event){
	var param = document.getElementById("parameter").value.toString(); //find which parameter the user selected - color, printer, etc.
	document.getElementById('param').innerHTML = param; //shows parameter name to be edited
	var options = JSON.parse(localStorage.getItem(param)); //gets current list of options for the parameter selected
	var optionList = document.getElementById('selectOptions');
	var i;
	updateDisplay(options,optionList);
});

addButton.addEventListener('click', function(event){
	var param = document.getElementById("parameter").value.toString(); 
	var options = JSON.parse(localStorage.getItem(param)); //gets current list of options for the parameter selected
	var toAdd = document.getElementById("newOption").value.toString();
	options.push(toAdd); //adds new options to current array of options
	var x = localStorage.setItem(param, JSON.stringify(options)); //puts new array in storage
	var optionList = document.getElementById('selectOptions');

	updateDisplay(options,optionList);
	
});

delButton.addEventListener('click',function(event){
	var param = document.getElementById("parameter").value.toString(); 
	var options = JSON.parse(localStorage.getItem(param)); //gets current list of options for the parameter selected
	var toDelete = document.getElementById("newOption").value.toString();

	var index = options.indexOf(toDelete); //find index of element to remove
	if (index > -1) {
    options.splice(index, 1); //remove element
	}
	var x = localStorage.setItem(param, JSON.stringify(options)); //putting new array in storage

	var optionList = document.getElementById('selectOptions');
	updateDisplay(options,optionList);
});

}