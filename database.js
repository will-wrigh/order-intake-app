window.onload = function () {
	const {getCurrentWindow, globalShortcut} = require('electron').remote;

	const updateBtn = document.getElementById('update');

	updateBtn.addEventListener('click', function(event){
		var host = document.getElementById("host").value.toString(); 
		var user = document.getElementById("user").value.toString(); 
		var pw = document.getElementById("pw").value.toString(); 
		var db = document.getElementById("db").value.toString(); 
		var newCreds = [host,user,pw,db];

		var x = localStorage.setItem("sqlCreds", JSON.stringify(newCreds)); //puts new array in storage
		alert("Database updated. Please refresh the app.");
      	getCurrentWindow().reload();
	});

}