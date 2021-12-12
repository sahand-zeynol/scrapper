const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");
const dates = [],
  high = [],
  low = [],
  json = [],
  // add months in this array to print weather
  months = ["august", "september", "october", "november"];

async function fetchHTML(url) {
  const { data } = await axios.get(url);
  return cheerio.load(data);
}

async function test(month) {
  const $ = await fetchHTML(
    `https://www.accuweather.com/en/gb/london/ec4a-2/${month}-weather/328328`
  );
  $(".monthly-daypanel .date").each(function () {
    dates.push($(this).text().trim());
  });
  $(".monthly-daypanel .high").each(function () {
    high.push($(this).text().trim());
  });
  $(".monthly-daypanel .low").each(function () {
    low.push($(this).text().trim());
  });

  for (let i = 0; i < dates.length; i++) {
    let obj = {
      date: dates[i],
      high: high[i],
      low: low[i],
    };
    json.push(obj);
  }
  // write jsons on file
  fs.writeFile(
    `${month}.json`,
    JSON.stringify(json, null, 3),
    function (error) {
      if (!error) {
        console.log(
          `File ${month}.json successfully written with ${month} data`
        );
      } else {
        console.log(
          error,
          `occurred while trying to write ${month} data to ${month}.json`
        );
      }
    }
  );
}
Promise.all(months.map(test));
