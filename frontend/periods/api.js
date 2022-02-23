$(document).ready(function () {
	$("form").submit(function (event) {
		event.preventDefault()
		var station = document.getElementById("fname").value

		// make a post request by ajax
		//

		var datefrom = document.getElementById("date-from").value.replaceAll('-', '');
		var dateto = document.getElementById("date-to").value.replaceAll('-', '');
		//dateto.replace('-', '');
		let apistr = "http://localhost:9103/interoperability/api/TimePeriodPasses";
		// api url
		const api_url = apistr.concat('/', station, '/', datefrom, '/', dateto);
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
			alert('request successful!');
			var data2 = data['PeriodList'];
			const ctx = document.getElementById('myChart');//.getContext('2d');
			const myChart = new Chart(ctx, {
				type: 'doughnut',
				data: {
					labels: ['00:00-07:59', '08:00-15:59', '16:00-23:59'],
					color: ['rgb(248, 249, 250)'],
					datasets: [{
						label: '# of Passes',
						data: [data['PeriodList'][0]['Passes'], data['PeriodList'][1]['Passes'], data['PeriodList'][2]['Passes']],
						backgroundColor: [
							'rgb(255, 99, 132)',
							'rgb(54, 162, 235)',
							'rgb(255, 205, 86)'
						],
						hoverOffset: 4
					}]
				},
				options:{
					plugins: {
						legend: {
							display:true,
							labels:{
								color:'rgb(248, 249, 250)'
							}
						},
						title:{
							display:true,
							text: '# of Passes',
							color:'rgb(248, 249, 250)'
						}
					}
				}
			});
		}


		/*const ctx = document.getElementById('myChart');//.getContext('2d');
		const myChart = new Chart(ctx, {
		type: 'pie',
		data: {
			labels: ['00-08', '8-16', '16-00'],
			datasets: [{
				label: '# of Passes',
				data: [15, 5, 9],
				backgroundColor: [
					'rgb(255,0,0)',
					'rgb(0,255,0)',
					'rgb(0,0,255)'
				],
				hoverOffset: 4
			}]
		}
		});*/

	})

})
