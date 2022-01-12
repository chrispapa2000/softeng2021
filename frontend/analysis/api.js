$(document).ready(function () {
	$("form").submit(function (event) {
		event.preventDefault()
		var op1 = document.getElementById("op1").value
		var op2 = document.getElementById("op2").value

		// make a post request by ajax
		//

		var datefrom = document.getElementById("date-from").value.replaceAll('-', '');
		var dateto = document.getElementById("date-to").value.replaceAll('-', '');
		//dateto.replace('-', '');
		let apistr = "https://tolltrolls.tk:9103/interoperability/api/PassesAnalysis";
		// api url
		const api_url = apistr.concat('/', op1, '/', op2, '/', datefrom, '/', dateto);
		// Defining async function
		async function getapi(url) {

			// Storing response
			const response = await fetch(url);

			// Storing data in form of JSON
			var data = await response.json();
			console.log(data);
			if (response) {
				hideloader();
			}
			show(data);
		}
		// Calling that async function
		getapi(api_url);

		// Function to hide the loader
		function hideloader() {
			document.getElementById("loading").style.display = 'none';
		}
		// Function to define innerHTML for HTML table
		function show(data) {
			// Setting innerHTML as tab variable
			var table_str = `<tr>
				<th>Station Operator</th>
				<th>Tag Operator</th>
				<th>Timestamp Request</th>
				<th>Period From</th>
				<th>Period To</th>
				<th>Number Of Passes</th>
				</tr>`;
			table_str += `<tr><td>` + data['op1_ID'] + `</td><td>` + data['op2_ID'] + `</td><td>` + 
				data['RequestTimestamp'] + `</td><td>` + data['PeriodFrom'] + `</td><td>` + 
				data['PeriodTo'] + `</td><td>` + data['NumberOfPasses'] + `</td></tr>`;
			//$("content").html(table_str);
			document.getElementById("table").innerHTML = table_str;
			var data2 = data['PassesList'];
			var passes = `<tr>
			<th>PassIndex</th>
			<th>PassID</th>
			<th>StationID</th>
			<th>Timestamp</th>
			<th>VehicleID</th>
			<th>Charge</th>
				</tr>`;
			for (var i=0; i<data2.length; i++){
				var object = data2[i];
				passes += `<tr>`;
				for (var property in object){
					passes += `<td>` + object[property] + `</td>`;
				}
				passes += `</tr>`;
			}
			document.getElementById("passeslist").innerHTML = passes;
			document.getElementById("title").innerHTML = "Pass List";
			document.getElementById("download").innerHTML = '<input value="Export as CSV" type="button" id="download-button" onClick="download()">';
		}

	})

})
