var appid = "&appid=dbf5bbbaeef83b5dccc8aa6dab999515";
var baseURL = "http://api.openweathermap.org/data/2.5/weather?";
var unitFormat = "&units=imperial";
var doOnce = 0;

document.addEventListener('DOMContentLoaded', initializePage);



function initializePage(){
	
	if(doOnce == 0){
		document.getElementById('City').style.visibility = "hidden";
		document.getElementById('zip').style.visibility = "hidden";
		document.getElementById('sendWeatherSearch').style.visibility = "hidden";
		doOnce = 1;
	}
	
	document.getElementById('zipRadio').checked = false;
	document.getElementById('cityRadio').checked = false;
	
	document.getElementById('zipRadio').addEventListener("change", function(event){
		document.getElementById('zip').style.visibility = "visible";
		document.getElementById('City').style.visibility = "hidden";
		document.getElementById('sendWeatherSearch').style.visibility = "visible";
		event.stopPropagation();
	});
	
	document.getElementById('cityRadio').addEventListener("change", function(event){
			document.getElementById('zip').style.visibility = "hidden";
			document.getElementById('City').style.visibility = "visible";
			document.getElementById('sendWeatherSearch').style.visibility = "visible";
			event.stopPropagation();
	});
	
	document.getElementById('sendWeatherSearch').addEventListener('click', function(event){
		var req = new XMLHttpRequest();
		var searchTypeFlag;
		
		var options = document.getElementsByName('searchType');
		for(var i = 0; i < options.length;i++){
			if(options[i].checked == true){
				searchTypeFlag = options[i].value;
				break;
			}
		}
		var searchType;
		var searchString;
		if(searchTypeFlag == 1){
			searchType = "zip=";
			searchString = document.getElementById('zip').value;
		}else{
			searchType = "q=";
			searchString = document.getElementById('City').value;
		}
		
		var fullURL = baseURL + searchType + searchString + unitFormat + appid;
		
		req.open('GET', fullURL, true);
		
		req.addEventListener('load', function(){
			if(req.status >=200 && req.status < 400){
				console.log(req.responseText);
				var response = JSON.parse(req.responseText);
				
				

				var cityName = response.name;
				var currTemp = response.main['temp']; 
				var humidity = response.main['humidity']; ;
				
				document.getElementById('ResultHeader').textContent = "Current weather in " + cityName;
				document.getElementById('temp').textContent = currTemp;
				document.getElementById('humidity').textContent = humidity;
				
				event.preventDefault();
			}else{
				console.log("Error in network request: " + req.statusText);
			}
		});
		
		req.send(null);

		 event.preventDefault();
	});
	
		var postURL = "http://httpbin.org/post";
		
		var parameters;
			
		function getParameters(){
			var nameValue = document.getElementById('nameInput').value;
			var teleValue = document.getElementById('phoneInput').value;
			var emailValue = document.getElementById('emailInput').value;
			
			if(document.querySelector('input[name="hear-about"]:checked').value != null){
				var hearChoice = document.querySelector('input[name="hear-about"]:checked').value;
			}else{
				hearChoice = "No Selection Made";
			}
			var message = document.getElementsByName('cust')[0].value;
			
			var subscribe = document.getElementById('mailOptIn').value;
			
			parameters = new Object();
			parameters.custInfo = {custName:nameValue, custPhone:teleValue, custEmail:emailValue};
			parameters.howDidYouHear = hearChoice;
			parameters.custMsg = message;
			parameters.joinMailing = subscribe;
		}

		
		document.getElementById('contactSubmit').addEventListener('click', function(event){
			
			var req = new XMLHttpRequest();	
			req.open('POST', postURL, true);
			req.setRequestHeader('Content-Type', 'application/json');
			
			req.addEventListener('load', function(){
				var response = JSON.parse(req.responseText);
				console.log(response);
				document.getElementById('displayResult').textContent = req.responseText;
				
			});		
			getParameters();
			
			req.send(JSON.stringify(parameters));
			

			event.preventDefault();
			
		});
}
