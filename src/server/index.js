require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const fetch = require('node-fetch')
const path = require('path')

const app = express()
const port = 3000

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use('/', express.static(path.join(__dirname, '../public')))

// your API calls

app.get('/getPerseveranceData', async (req, res) => {
    try {
        const data = await fetch(
            `https://api.nasa.gov/mars-photos/api/v1/rovers/perseverance/latest_photos?api_key=${process.env.API_KEY}`
        ).then((res) => res.json());
        res.send(data);
        console.log(data);
    } catch (err) {
        console.log('error: ', err);
    }
});

app.get('/getOpportunityData', async (req, res) => {
    try {
        const data = await fetch(
            `https://api.nasa.gov/mars-photos/api/v1/rovers/opportunity/latest_photos?api_key=${process.env.API_KEY}`
        ).then((res) => res.json());
        res.send(data);
        console.log(data);
    } catch (err) {
        console.log('error: ', err);
    }
});

app.get('/getCuriosityData', async (req, res) => {
    try {
        const data = await fetch(
            `https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/latest_photos?api_key=${process.env.API_KEY}`
        ).then((res) => res.json());
        res.send(data);
        console.log(data);
    } catch (err) {
        console.log('error: ', err);
    }
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))