/*
-------- PAPAYA PRICE COMPARER ---------
compare prices between amazon stores within the EU in seconds.
TODO:
*/


// Configure XMLHTTPRequest for price comparison API
xmlhttp=new XMLHttpRequest(async=true);

// Function to toggle the display of the prices(by country) on and off using vanilla JS
/*

1. Loop through all elements
2. If element is hidden, then show
3. If element is visible, then hide

*/

// declare boolean to control whether to convert to GBP or not
var convert_to_gbp = false

var num_results = 10;

function toggleDisp() {
    for (let i=0;i<num_results;i++) {
				var x = document.getElementsByClassName("countryPrice")[i];
			if (x.style.display === "none") {
					x.style.display = "block";
					document.getElementsByClassName('settings')[0].style.display = 'block'

			} else {
					x.style.display = "none";
					document.getElementsByClassName('settings')[0].style.display = 'none'

				}
			}
}


// Wait for the page to load using JQuery

$(document).ready(function() {

	function getValue(callback) { chrome.storage.sync.get(["convert_to","limit_results"], callback); }
	getValue(call);

	function call(data) {
		if (data.limit_results == '') {
			num_results = 10
		} else {
			num_results = parseInt(data.limit_results)
		}

		if (data.convert_to == 'GBP') {
			convert_to_gbp = true
			
		} else {
			convert_to_gbp = false
		}
	console.log(num_results)
	// Use proxy to hide request to currency API
	$.ajaxPrefilter( function (options) {
			if (options.crossDomain && jQuery.support.cors) {
			  var http = (window.location.protocol === 'http:' ? 'http:' : 'https:');
			  options.url = http + '//cors-anywhere.herokuapp.com/' + options.url;
			}
		  }); 
		  $.get(
			  'https://api.exchangeratesapi.io/latest',
			  function (response) {
				  // get gbp rate
				  gbp_rate = response['rates']['GBP']

		  
	// --- Optional code to translate product titles --- //
	// let txt = document.getElementById('productTitle').textContent.replace(/\s+/g, " ")
	// txt = txt.split(' ').slice(0,4).join(' ')
	// var settings = {
	// 	"async": true,
	// 	"crossDomain": true,
	// 	"url": "https://google-translate1.p.rapidapi.com/language/translate/v2",
	// 	"method": "POST",
	// 	"headers": {
	// 		"x-rapidapi-host": "google-translate1.p.rapidapi.com",
	// 		"x-rapidapi-key": "API_KEY",
	// 		"accept-encoding": "application/gzip",
	// 		"content-type": "application/x-www-form-urlencoded"
	// 	},
	// 	"data": {
	// 		"source": `${document.location.href.slice(19,21)}`,
	// 		"q": `${txt}`,
	// 		"target": "en"
	// 	}
	// }
	// if (!document.location.href.includes('amazon.co.uk')) {
	// 	$.ajax(settings).done(function (response) {
	// 		translated_txt = response['data']['translations'][0]['translatedText']
	// 	});
	// }
	
	// Get first 4 words of the product name
	let productName = document.getElementById('productTitle').textContent.replace(/\s+/g, " ")
	productName = productName.split(' ').slice(0,4).join(' ')
	// API URL
	var apiURL = `https://api2.hoteudeals.com/products?keywords=${productName}&page=1`

	// When request is ready, do the following:
	xmlhttp.onreadystatechange=function()
{
	// Parse Response of API Request
	parsed_resp = JSON.parse(xmlhttp.responseText)
	
	// Click event listener
	document.getElementById('productTitle').onclick = function() {
	
	// if countryPrice elements exists, then just toggle the display on and off
		
		if($(".countryPrice").length){
			toggleDisp()
			

} else {


			
			// if it does not, then create it using a for loop

		for (let index = 0; index < num_results; index++) {

			// -----------------THE MAIN FOR LOOP----------------- //
			/*
			
			1. Create a div element
			2. Assign an image to the corresponing name of country
			3. Get price from response
			4. Adjust innerHTML and make it visible
			
			*/
	
			try {

			var div = document.createElement("div");
			div.className = "countryPrice";
			let imgsrc = chrome.runtime.getURL('img/' + String(parsed_resp['hydra:member'][index]['deals']['new'][0]['country']) + '.png')
			let q = String(parsed_resp['hydra:member'][index]['deals']['new'][0]['detailPageUrl'])

			/* 

			If the curerency is set to GBP, then multiply the number by the rate obtained from currency API
			If not, then do not multiply
			
			*/
			var elm;
			if (convert_to_gbp == true) {
				elm = ' : £' + String(Math.round(parsed_resp['hydra:member'][index]['deals']['new'][0]['price'] * gbp_rate)) + '<br>'
			} else {
				elm = ' : €' + String(parsed_resp['hydra:member'][index]['deals']['new'][0]['price']) + '<br>'

			}

			div.innerHTML =  `<a target="_blank" href="${q}"><img src="${imgsrc}" style="margin-top:2%;">${elm}</a>`;
			div.style.display = 'block'
			document.getElementById('productTitle').appendChild(div) 
			
		}  catch {
			// Skip if it can't find any new deals for one of the coutnries country
				continue
			}
			
		}
		// Create settings button to adjust currency
		var settings = document.createElement("settings");
		let settingsrc = chrome.runtime.getURL('img/settings.png')
			settings.className = "settings";
			settings.innerHTML = `<a target="_blank" href="chrome-extension://kclgdemmaecaehpmnipbolehonilboha/options.html"><img src="${settingsrc}" style="margin-top: 2%;"> : Settings</a>`
			document.getElementById('productTitle').appendChild(settings)

	}

	}
		
}

// Send the actual GET request and specify parameters for the request
xmlhttp.open("GET", apiURL);
xmlhttp.setRequestHeader("content-type", 'application/json');
xmlhttp.send();

});
}
})






