import fs from 'fs';
import bodyParser from 'body-parser';
import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';


dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

let data = {};
let currencyCodes = [];
let countryNames = [];

try {
    data = JSON.parse(fs.readFileSync('data.json', 'utf8'));
    if (data.Country) {
        currencyCodes = Object.keys(data.Country);
        countryNames = Object.keys(data.Country).map((key) => data.Country[key].Name);
    } else {
        console.error("Error: 'Country' key is missing in data.json");
    }
} catch (error) {
    console.error("Error reading or parsing data.json:", error.message);
}

app.get('/', (req, res) => {
    res.render('index.ejs', { code : currencyCodes, country : countryNames });
});

app.post('/calculate', async (req, res) => {
    try{
        const result =  await axios.get(`https://v6.exchangerate-api.com/v6/${apiKey}/pair/${req.body.base_code}/${req.body.target_code}`);
        const rate = result.data.conversion_rate;
        res.render('index.ejs', {rate: rate, base: req.body.base_code, target: req.body.target_code, code : currencyCodes, country : countryNames, base_amount: req.body.base_amount});
    } catch (error) {
        console.error("Error fetching exchange rate:", error.message);
        res.status(500).send("Error fetching exchange rate");
    }
   
   
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});