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
		let apistr = "http://localhost:9103/interoperability/api/PassesCost";
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
			else if (response.status === 402){
				alert("No Data Found");
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
				<th>Operator 1</th>
				<th>Operator 2</th>
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
			if (data['PassesCost'] < 0){
				var content = `Operator 1 ` + data['op1_ID'] + ` owes Operator 2 ` + data['op2_ID'] + `<b> ` + data['PassesCost'] + `\u20AC</b>.</p>`;
			}
			else {
				var content = `Operator 2 ` + data['op2_ID'] + ` owes Operator 1 ` + data['op1_ID'] + `<b> ` + data['PassesCost'] + `\u20AC</b>.</p>`;
			}
			document.getElementById("download").innerHTML = '<input value="Export as CSV" type="button" id="download-button" onClick="download()">';
			document.getElementById("explanation").innerHTML = content;
		}



	})

})
