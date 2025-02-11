const fs = require("fs");
const countriesDialInfo = require("./countryDialCode");
const allCountries = require("./allCountries");

const completeCountries = countriesDialInfo.map((country) => {
  const countryDetails = allCountries.find((c) => c.code2 === country.code);
  
  return {
    name: country.name,
    flag: country.flag,
    code: country.code,
    dial_code: country.dial_code,
    states: countryDetails?.states?.length > 0
      ? countryDetails.states
      : [{ code: country.code, name: country.name, subdivision: null }],
  };
});

fs.writeFileSync("complete_countries.json", JSON.stringify(completeCountries, null, 2));

console.log("complete_countries.json has been generated!");
