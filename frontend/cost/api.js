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
		let apistr = "https://tolltrolls.tk:9103/interoperability/api/PassesCost";
		// api url
		const api_url = apistr.concat('/', op1, '/', op2, '/', datefrom, '/', dateto);
		// Defining async function
		async function getapi(url) {

			// Storing response
			const response = await fetch(url);

			// Storing data in form of JSON
			if (response.ok) {
				hideloader();
				
				var data = await response.json();
				
				console.log(data);
				show(data);
			}
			else if (response.status === 400){
				alert("Missing Input");
				return response.json().then((errorObj) => setErrors(errorObj));
			}
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
	
			alert("Request Succesful");
			var table_str = `<tr>
				<th>Station Operator</th>
				<th>Tag Operator</th>
				<th>Timestamp Request</th>
				<th>Period From</th>
				<th>Period To</th>
				<th>Number Of Passes</th>
				<th>Total Cost</th>
				</tr>`;
			table_str += `<tr>`;
			$.each(data, function (key,value){
				table_str += `<td>` + value + `</td>`;
			});
			table_str += `</tr>`;
			document.getElementById("table").innerHTML = table_str;
			var content = `Table Explanation: <p> Tag Operator <b>` + data['op2_ID'] + `</b> owes Station Operator <b>` +
				data['op1_ID'] + `</b> a total amount of <b>` + data['PassesCost'] + `\u20AC` + `</b>.</p>`;
			document.getElementById("download").innerHTML = '<input value="Export as CSV" type="button" id="download-button" onClick="download()">';
			document.getElementById("explanation").innerHTML = content;
		}

	})

})
