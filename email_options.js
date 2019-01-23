window.onload = function () {
	const {getCurrentWindow, globalShortcut} = require('electron').remote;

	const updateBtn = document.getElementById('update');

	updateBtn.addEventListener('click', function(event){
		var host = document.getElementById("type").value.toString(); 
		var user = document.getElementById("username").value.toString(); 
		var pw = document.getElementById("pw").value.toString(); 
		var subject = document.getElementById("subject").value.toString(); 
		var text = document.getElementById("text").value.toString(); 
		var newCreds = [host,user,pw,subject,text];

		var x = localStorage.setItem("emailOps", JSON.stringify(newCreds)); //puts new array in storage
		alert("Email options updated. Please refresh the app.");
      	getCurrentWindow().reload();
	});

}