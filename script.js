$(document).ready(function () {
  console.log("hooray it works, finally");
  // openweathermap api key
  const APIKEY = "41ea4a85cfbbfb9d089175fe1df741b6";
  // local storage for city/village/civilization array
  let villageHistory = [];
  if (localStorage.getItem("villageHistory")) {
    villageHistory = JSON.parse(localStorage.getItem("villageHistory"));
    createVillageList(villageHistory);
  }
// removes styling from main element
    $("#main").removeAttr("style");

  function createVillageList(villageArray) {
    for (let i = 0; i < villageArray.length; i++) {
      // creates a new anchor tag element
      let newAtag = $("<a>");
      newAtag.attr("class", "panel-block");  // set the class attribute to panel-block
      newAtag.text(villageArray[i]);
      newAtag.attr("id", villageArray[i]);  // set the text content of the <a> element to the name of the "village"
      $("#villageHistoryContainer").prepend(newAtag); // inserts the <a> element at the beginning of the container element 
    }
  }

 

  function getCurrentWeather(civName) {
    $.ajax({
      // in this code civ is short for civilization
      // sends an AJAX request to the openweathermap api to get the current weather for the specified location
      url:
        "https://api.openweathermap.org/data/2.5/weather?q=" +
        civName +
        "&units=imperial" +
        "&APPID=" +
        APIKEY,
      method: "GET",
    }).then(function (response) { // Callback function to be executed when the API response is received
      getUVIndex(response.coord.lat, response.coord.lon);
      $("#weatherIcon").attr(
        "src",
        "https://openweathermap.org/img/wn/" +
          response.weather[0].icon +
          "@2x.png"
      );
      $("#currentCity").text(response.name);
      $("#currentDate").text(moment().format("MMMM Do, YYYY")); // uses moment.js to format the date
      $("#currentTemperature").text(  // set the text content of an element with id "currentTemperature" to display the current temperature in degrees Fahrenheit
        "Current Temperature: " + response.main.temp.toFixed() + "°"
      );
      $("#currentHumidity").text("Humidity: " + response.main.humidity + "%");
      $("#currentWindSpeed").text(
        "Wind Speed: " + response.wind.speed + " mph"
      );
    });
  }

 // function to get the 5 day forecast for the specified location 
  function getFiveDayForecast(civName) {
    $.ajax({
      url:
        "https://api.openweathermap.org/data/2.5/forecast?q=" +
        civName +
        "&units=imperial" +
        "&APPID=" +
        APIKEY,
        // makes a GET request to the openweathermap api
      method: "GET",
    }).then(function (response) {
      // empty array to store the forecast for the next five days
      let fiveDayForecast = [];
      // looping through the array
      for (let i = 0; i < response.list.length; i++) {
        let hr = response.list[i].dt_txt.split(" ")[1];
        // checks the api response for the time. If the time is 6pm, it will push the response to the fiveDayForecast array
        if (hr === "18:00:00") {
          fiveDayForecast.push(response.list[i]);
        }
      }
      for (let f = 0; f < fiveDayForecast.length; f++) {
        // empties div contents
        $("#day" + (f + 1)).empty();
        // creates new divs and appends them to the page
        const brandNewDay = $("<div>");
        brandNewDay.text(moment(fiveDayForecast[f].dt_txt).format("dddd"));
        brandNewDay.attr("style", "font-weight:600");
        // creates a new div element to display the date
        const newDivDate = $("<div>");
        newDivDate.text(moment(fiveDayForecast[f].dt_txt).format("MM/DD/YYYY"));
        // creates a new img element to display the weather icon provided by the openweathermap api
        const newWeatherIcon = $("<img>").attr(
          "src",
          "https://openweathermap.org/img/wn/" +
            fiveDayForecast[f].weather[0].icon +
            "@2x.png"
        );
        const newDivTemp = $("<div>");
        newDivTemp.text(fiveDayForecast[f].main.temp.toFixed() + "°");
        const newHumidityDiv = $("<div>");
        newHumidityDiv.text(fiveDayForecast[f].main.humidity + "% Humidity");
        $("#day" + (f + 1)).append(
          brandNewDay,
          newDivDate,
          newWeatherIcon,
          newDivTemp,
          newHumidityDiv
        );
      }
    });
  }
// function to get the UV index for the specified location
  function getUVIndex(lat, lon) {
    $.ajax({
      url:
        "https://api.openweathermap.org/data/2.5/uvi/forecast?&lat=" +
        lat +
        "&lon=" +
        lon +
        "&cnt=1" +
        "&APPID=" +
        APIKEY,
      method: "GET",
    }).then(function (response) {
      $("#currentUVIndex").text("UV Index: " + response[0].value);
    });
  }

  function addToHistory(civName) {
    villageHistory.push(civName);
    localStorage.setItem("villageHistory", JSON.stringify(villageHistory));
    let newAtag = $("<a>");
    newAtag.attr("class", "panel-block");
    newAtag.text(civName);
    newAtag.attr("id", civName);
    $("#villageHistoryContainer").prepend(newAtag);
  }

  // function to clear the local storage in the container. Event listener is at bottom
  function clear() {
    $("#villageHistoryContainer").text("");
    localStorage.clear();
  }

//  city search function that takes the input from the search bar and uses it to get the weather for that city

  function villageWeatherSearch() {
    let civName = $("#citySearch").val();
    $("#citySearch").val("");
    const apiLink =
      "https://api.openweathermap.org/data/2.5/weather?q=" +
      civName +
      "&units=imperial" +
      "&APPID=" +
      APIKEY;
    addToHistory(civName);
    getCurrentWeather(civName);
    getFiveDayForecast(civName);
  }

  // event listeners to search weather in a location

  $("#citySearch").on("keydown", function (e) {
    if (e.keyCode == 13) {
      e.preventDefault();
      villageWeatherSearch();
    }
  });

  $("#searchButton").on("click", function (e) {
    e.preventDefault();
    villageWeatherSearch();
  });

  //  allows user to click on a city in the history and get the weather for that city
  $("#villageHistoryContainer").on("click", function (e) {
    if (e.target.matches("a")) {
      e.preventDefault();
  
      let civName = e.target.id;
      getCurrentWeather(civName);
      getFiveDayForecast(civName);
    }
  });

  //clear history button
  $("#clear").on("click", function (e) {
    clear();
  });
});
