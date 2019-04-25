window.onload = function () {
const BrowserWindow = require('electron').remote.BrowserWindow


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
var fs = require('fs');
// var files = fs.readdirSync('.///images');
// var optionList = document.getElementById('backgroundOptions');
// updateDisplay(files, optionList);

// const backgroundBtn = document.getElementById('backgroundUpdate');
// backgroundBtn.addEventListener('click', function (event) {
// 	var idx = optionList.value;
// 	var newImg = optionList[idx].innerHTML;
// 	localStorage.setItem("background", newImg);
// });
const parameterWindowBtn = document.getElementById('parameter-window')
parameterWindowBtn.addEventListener('click', function (event) {

  let win = new BrowserWindow({ width: 600, height: 450})
  
	win.loadURL('file://' + __dirname + '/parameter_options.html');
	  win.on('close', function () { win = null })
	  win.show()
});

const emailWindowBtn = document.getElementById('email-window')
emailWindowBtn.addEventListener('click', function (event) {

  let win = new BrowserWindow({ width: 600, height: 650})
  
	win.loadURL('file://' + __dirname + '/email_options.html');
	  win.on('close', function () { win = null })
	  win.show()
});

const databaseWindowBtn = document.getElementById('database-window')
databaseWindowBtn.addEventListener('click', function (event) {

  let win = new BrowserWindow({ width: 400, height: 500})
  
	win.loadURL('file://' + __dirname + '/database.html');
	  win.on('close', function () { win = null })
	  win.show()
});

const changeStartID = document.getElementById('changeStartID')
const startidval = document.getElementById('startID')
startidval.value = JSON.parse(localStorage.getItem('start-id'));
changeStartID.addEventListener('click', function (event) {
	localStorage.setItem("start-id", JSON.stringify(startidval.value));
	alert('Start ID for queue display updated')
});


const changeStoreDir = document.getElementById('changeStoreDir')
const dirval = document.getElementById('storeDir')
dirval.value = JSON.parse(localStorage.getItem('store-dir'));
changeStoreDir.addEventListener('click', function (event) {
	localStorage.setItem("store-dir", JSON.stringify(dirval.value));
	alert('Print file autosave location updated')
});

}


