var express = require('express');
var app = express();
var request = require('request');

// set the view engine to ejs
app.set('view engine', 'ejs');

// use res.render to load up an ejs view file

// index page
var unique_makes = [];
let unique_brands = [];


app.get('/makes/:makeName', function (req, res)
{
	var makename = req.params.makeName.toLowerCase();

	return new Promise(resolve =>
	{
		request('https://vpic.nhtsa.dot.gov/api/vehicles/getallmanufacturers?format=json', function (error, response, body)
		{
			if (!error && response.statusCode == 200)
			{
				unique_brands = [];
				var san = JSON.parse(body)
				for (var i = 0; i < san.Results.length; i++)
				{

					if (!unique_brands.includes(san.Results[i].Mfr_CommonName) && san.Results[i].Mfr_CommonName != null)
					{
						unique_brands.push(san.Results[i].Mfr_CommonName);

					}

				}
				resolve(body);

			}
			else
			{
				return res.render('pages/index',
				{
					unique_brands: unique_brands,
					unique_makes: unique_makes,
					makename: makename,
					year: "",
					make: "",
					model: "",
					flag: ""
				});
			}
		});
	}).then(value =>
	{
		return new Promise(resolve =>
		{


			request('https://vpic.nhtsa.dot.gov/api/vehicles/GetMakeForManufacturer/' + makename + '?format=json', function (err, resp, bod)
			{
				if (!err && resp.statusCode == 200)
				{

					var makesBody = JSON.parse(bod)
					unique_makes = [];
					for (var i = 0; i < makesBody.Results.length; i++)
					{

						if (!unique_makes.includes(makesBody.Results[i].Make_Name) && makesBody.Results[i].Make_Name != null)
						{
							unique_makes.push(makesBody.Results[i].Make_Name);
						}

					}

				}
				resolve(bod);

			});

		})
	}).then(val =>
	{

		return res.render('pages/index',
		{
			unique_brands: unique_brands,
			unique_makes: unique_makes,
			makename: makename,
			year: "",
			make: "",
			model: "",
			flag: ""
		});
	})




});



app.get('/VIN/:vin', function (req, res)
{
	let year, make, model = "";
	var VIN = req.params.vin;
	return new Promise(resolve =>
	{
		request('https://vpic.nhtsa.dot.gov/api/vehicles/getallmanufacturers?format=json', function (error, response, body)
		{
			if (!error && response.statusCode == 200)
			{
				unique_brands = [];
				var san = JSON.parse(body)
				for (var i = 0; i < san.Results.length; i++)
				{

					if (!unique_brands.includes(san.Results[i].Mfr_CommonName) && san.Results[i].Mfr_CommonName != null)
					{
						unique_brands.push(san.Results[i].Mfr_CommonName);

					}

				}
				resolve(body);

			}
			else
			{
				return res.render('pages/error',
				{});
			}
		});
	}).then(value =>
	{
		return new Promise(resolve =>
		{


			request('https://vpic.nhtsa.dot.gov/api/vehicles/decodevin/' + VIN + '?format=json', function (err, resp, bod)
			{
				if (!err && resp.statusCode == 200)
				{
					var VINObj = JSON.parse(bod)
					year = VINObj.Results[9].Value;
					make = VINObj.Results[8].Value;
					model = VINObj.Results[6].Value;
				}

				resolve(bod);

			});

		})
	}).then(val =>
	{

		return res.render('pages/index',
		{
			unique_brands: unique_brands,
			year: year,
			make: make,
			model: model,
			makename: "",
			unique_makes: [],
			flag: "response"
		});
	})



});




app.listen(process.env.PORT || 5000);
console.log('Server is listening on port 8080');