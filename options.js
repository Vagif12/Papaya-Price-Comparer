
// ------Options for Papaya Price Comparer------ //


var def_convert_to = "";
var def_limit_results = 10;

// function to load options
function loadOptions() {

	var convert_to = def_convert_to;
	var limit_results = def_limit_results;
	chrome.storage.sync.get("convert_to",
		function(data){
				convert_to = data.convert_to;
				if (convert_to == undefined) {
					convert_to = def_convert_to;
				}

				var select = document.getElementById("convert_to");
				for (var i = 0; i < select.children.length; i++) {
					var child = select.children[i];
					if (child.value == convert_to) {
						child.selected = "true";
						child.text += "*";
						break;
					}
				}
			}
		);
		chrome.storage.sync.get("limit_results",
		function(data){
				limit_results = data.limit_results;
				if (limit_results == undefined) {
					limit_results = def_limit_results;
				}

				var select = document.getElementById("limit_results");
				for (var i = 0; i < select.children.length; i++) {
					var child = select.children[i];
					if (child.value == limit_results) {
						child.selected = "true";
						child.text += "*";
						break;
					}
				}
			}
		);

}

// save options functions
function saveOptions() {
	var select = document.getElementById("convert_to");
	var convert_to_select = select.children[select.selectedIndex].value;
	chrome.storage.sync.set({'convert_to': convert_to_select,'exchange_rates':0}, function() {
		document.location.reload(true);
	});
	var select = document.getElementById("limit_results");
	var limit_results_select = select.children[select.selectedIndex].value;
	chrome.storage.sync.set({'limit_results': limit_results_select}, function() {
		document.location.reload(true);
	});	
}

// erase options function
function eraseOptions() {
	localStorage.removeItem("limit_results");
	localStorage.removeItem("convert_to");
	location.reload();
}

document.addEventListener('DOMContentLoaded', loadOptions);
document.querySelector('#convert_to').addEventListener('change', saveOptions);
document.querySelector('#limit_results').addEventListener('change', saveOptions);

