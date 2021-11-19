const express = require('express')
const app = express();
const axios = require('axios');
const cors = require('cors');

const PORT = process.env.PORT || 4000

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
	res.send("Welcome to the Turners API")
})

app.get('/plate', (req, res) => {
	console.log(req.query.plate)
	const plate = req.query.plate + ""
	const regex = /(?<=Report - )(.*)(?=\| CARJAM)/g;

	axios.get('https://www.carjam.co.nz/car/?plate=' + plate)
	.then(response => {
		const htmlData = response.data + ""
		const carData = htmlData.match(regex)[0]
		res.send(carData.split('-')[1].trim())
	})
	// .then(response => res.send(response))
	.catch(() => {
		console.log("There was a catch error")
		res.status(400)
	})
})

app.listen(PORT, () => console.log("App running on port: " + PORT))