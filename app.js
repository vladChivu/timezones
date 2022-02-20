const express = require("express");
const country = require("country-state-city").Country;
const city = require("country-state-city").City;
const ejs = require("ejs");
const fs = require('fs');

const app = express();

app.use(express.json());
app.use(express.static(__dirname + '/public'));

// LATER ON WITH TEMPLATE ENGINE
// app.set("view engine", "ejs");
// app.set("views", "./views");

// set up two lists and populate them with what the 'country-state-city' package offers
console.log("-----------------WORKING------------------------------------------------");
let countries = [];
let cities = [];
function getCountriesAndCities() {
    countries = country.getAllCountries();
    cities = city.getAllCities();
}
getCountriesAndCities();
// ---------------- RESULTS ---------------------------------------------------------
console.log("-----------------RESULTS------------------------------------------------");
console.log("Countries list size: " + countries.length);
console.log("-----------------------------------------------------------------");
console.log("Country example: " + JSON.stringify(countries[0]));
console.log("-----------------------------------------------------------------");
console.log("City list size: " + cities.length);
console.log("-----------------------------------------------------------------");
console.log("City example: " + JSON.stringify(cities[0]));
console.log("-----------------------------------------------------------------");

// start cleaning some data about the countries in the lists
// const countriesFiltered = [];
let countriesFiltered = [];
let countriesCitiesTags = [];
function sanitizeCountriesList() {
    for (let i = 0; i < countries.length; ++i) {
        countriesCitiesTags.push(countries[i].isoCode);
        if (countries[i].flag) () => delete countries[i].flag;
        if (countries[i].phonecode) () => delete countries[i].phonecode;
        if (countries[i].currency) () => delete countries[i].currency;
        signIndexPlus = countries[i].timezones[0].gmtOffsetName.indexOf("+");
        signIndexMinus = countries[i].timezones[0].gmtOffsetName.indexOf("-");
        timeStepSign = countries[i].timezones[0].gmtOffsetName.indexOf(":");
        timeStephours = countries[i].timezones[0].gmtOffsetName.slice(timeStepSign-2, timeStepSign);
        timeStepminutes = countries[i].timezones[0].gmtOffsetName.slice(timeStepSign+1, timeStepSign+3);
        if (signIndexPlus != -1) {
            countries[i].operation = "+";
            countries[i].hours = timeStephours;
            countries[i].minutes = timeStepminutes;
            countries[i].timezone = countries[i].timezones[0].tzName;  
        } else {
            countries[i].operation = "-";
            countries[i].hours = timeStephours;
            countries[i].minutes = timeStepminutes;
            countries[i].timezone = countries[i].timezones[0].tzName;  
        }
        delete countries[i].timezones;
        countries[i].cities = [];
        countriesFiltered.push(countries[i]);
    }
}
console.log("-----------------WORKING------------------------------------------------");
sanitizeCountriesList();
console.log("-----------------RESULTS------------------------------------------------");
console.log("Countries list size: " + countriesFiltered.length);
console.log("-----------------------------------------------------------------");
console.log("Country example: " + JSON.stringify(countriesFiltered[0]));
console.log("-----------------------------------------------------------------");
console.log("COUNTRY CODES:");
console.log(countriesCitiesTags);
console.log("-----------------------------------------------------------------");


// start cleaning some data about the cities in the lists and add them to countries
function getCountryIndex (theList, propName, propWanted) {
    for (let i = 0; i < theList.length; ++i) {
        if (theList[i][propName] === propWanted) {
            return i;
        }
    }
}
function sanitizeCitiesListAndPushToCountry () {
    for (let i = 0; i < cities.length; ++i) {
        let countryIndex = getCountryIndex(countriesFiltered, "isoCode", cities[i].countryCode);
        countriesFiltered[countryIndex].cities.push(cities[i].name);
        delete cities[i].stateCode;
    }
}
console.log("-----------------WORKING------------------------------------------------");
sanitizeCitiesListAndPushToCountry();
console.log("-----------------RESULTS------------------------------------------------");
console.log("Countries list size: " + countriesFiltered.length);
console.log("-----------------------------------------------------------------");
console.log("Country example: " + JSON.stringify(countriesFiltered[0]));
console.log("-----------------------------------------------------------------");

// helper method    
String.prototype.escapeSpecialChars = function() {
    return this.replace(/\\n/g, "\\n")
               .replace(/\\'/g, "\\'")
               .replace(/\\"/g, '\\"')
               .replace(/\\&/g, "\\&")
               .replace(/\\r/g, "\\r")
               .replace(/\\t/g, "\\t")
               .replace(/\\b/g, "\\b")
               .replace(/\\f/g, "\\f");
};

app.get("/api/countries", (req, res) => {
    res.send({countries: countriesFiltered});
});

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/home.html")
});

app.get("/countries", (req, res) => {
    res.sendFile(__dirname + "/public/countries.html")
});

// LATER ON WITH TEMPLATE ENGINE
// app.get("/countries", (req, res) => {
//     res.render('countries', {title: 'Countries', countries: countries});
// });
// app.get('/countries', (req, res) => {
//     fs.readFile(__dirname + '/public/countries.html', 'utf-8', (err, html) => {
//       res.send(ejs.render(html, countriesFiltered));
//     });
// });

app.listen(() => { 
    console.log("The server is running");
});