const express = require('express')
const app = express();
const axios = require('axios');
const cors = require('cors');
const setCookie = require('set-cookie-parser');

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

app.get('/address', (req, res) => {
	const data = '{ prefix:\'141 Factory Rd 9024 \', topN:10}';
	let cookie;

	axios.get('https://verifyaddress.courierpost.co.nz')
		.then(res => {
			return cookies = setCookie.parse(res, {
				decodeValues: true
			})
		})
		.then(res => cookie = res)
		.then(() => {
			const config = {
				method: 'get',
				url: 'https://verifyaddress.courierpost.co.nz/AddressLookupServicePage.aspx?servicemethod=getaddresssuggestions',
				headers: {
					'Connection': 'keep-alive',
					'sec-ch-ua': '"Chromium";v="94", ";Not A Brand";v="99"',
					'Accept': 'application/json, text/javascript, */*',
					'Content-Type': 'application/json; charset=UTF-8',
					'X-Requested-With': 'XMLHttpRequest',
					'sec-ch-ua-mobile': '?0',
					'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.114 Safari/537.36',
					'sec-ch-ua-platform': '"macOS"',
					'Origin': 'https://verifyaddress.courierpost.co.nz',
					'Sec-Fetch-Site': 'same-origin',
					'Sec-Fetch-Mode': 'cors',
					'Sec-Fetch-Dest': 'empty',
					'Referer': 'https://verifyaddress.courierpost.co.nz/',
					'Accept-Language': 'en,en-GB;q=0.9,en-US;q=0.8',
					// 'Cookie': 'ASP.NET_SessionId=svsxtock5imtxwwbkavyfvy0; TS01c9af0a=0117e34adeebc3b15dd5ae48ee1714617db3b0aa97e98259f317d331301a58773f7fc6e7a71ea19cba9b3c43def2565432f7e1ab28;'
					'Cookie': `${cookie[0].name}=${cookie[0].value}; ${cookie[1].name}=${cookie[1].value};`
				},
				data: data
			};
			console.log(cookie)
			axios(config)
				.then((response) => {
					console.log(response.data)
				})
				.catch((error) => {
					console.log(error);
				});
		})
})











// const config = {
// 	method: 'get',
// 	url: 'https://verifyaddress.courierpost.co.nz/AddressLookupServicePage.aspx?servicemethod=getaddresssuggestions',
// 	headers: {
// 		'Connection': 'keep-alive',
// 		'sec-ch-ua': '"Chromium";v="94", ";Not A Brand";v="99"',
// 		'Accept': 'application/json, text/javascript, */*',
// 		'Content-Type': 'application/json; charset=UTF-8',
// 		'X-Requested-With': 'XMLHttpRequest',
// 		'sec-ch-ua-mobile': '?0',
// 		'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.114 Safari/537.36',
// 		'sec-ch-ua-platform': '"macOS"',
// 		'Origin': 'https://verifyaddress.courierpost.co.nz',
// 		'Sec-Fetch-Site': 'same-origin',
// 		'Sec-Fetch-Mode': 'cors',
// 		'Sec-Fetch-Dest': 'empty',
// 		'Referer': 'https://verifyaddress.courierpost.co.nz/',
// 		'Accept-Language': 'en,en-GB;q=0.9,en-US;q=0.8',
// 		'Cookie': 'ASP.NET_SessionId=svsxtock5imtxwwbkavyfvy0; TS01c9af0a=0117e34adeebc3b15dd5ae48ee1714617db3b0aa97e98259f317d331301a58773f7fc6e7a71ea19cba9b3c43def2565432f7e1ab28;'
// 	},
// 	data: data
// };

// axios(config)
// 	.then((response) => {
// 		// console.log(JSON.stringify(response.data));
// 		res.send(response.data)
// 	})
// 	.catch((error) => {
// 		console.log(error);
// 	});
// })

app.listen(PORT, () => console.log("App running on port: " + PORT))