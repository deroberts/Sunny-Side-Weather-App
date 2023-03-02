$(document).ready(function () {
  console.log("hooray it works, finally");
  // openweathermap api key
  const APIKEY = "41ea4a85cfbbfb9d089175fe1df741b6";
  // local storage create array
  let cityHistory = [];
  if (localStorage.getItem("cityHistory")) {
    cityHistory = JSON.parse(localStorage.getItem("cityHistory"));
    createHistoryList(cityHistory);
  }

  // check if geolocation is available in browser
  if ("geolocation" in navigator) {
    // geolocation is available /
    navigator.geolocation.getCurrentPosition(
      function (position) {
        // hide progress bar and show main content
        $("progress").attr("style", "display:none");
        $("#main").removeAttr("style");
        getCurrentFromCoordinates(
          position.coords.latitude,
          position.coords.longitude
        );
      },
      function (error) {
        // If user doesn't want to use current location
        if (error.code === error.PERMISSION_DENIED) {
          $("#progressBar").attr("style", "display:none");
          $("#main").removeAttr("style");
          if (cityHistory[0]) {
            getCurrentWeather(cityHistory[cityHistory.length - 1]);
            getFiveDayForecast(cityHistory[cityHistory.length - 1]);
          } else {
            getCurrentWeather("Kansas City");
            getFiveDayForecast("Kansas City");
          }
        }
      }
    );
  } else {
    // geolocation IS NOT available //
    $("#progressBar").attr("style", "display:none");
    $("#main").removeAttr("style");
    if (cityHistory[0]) {
      getCurrentWeather(cityHistory[cityHistory.length - 1]);
      getFiveDayForecast(cityHistory[cityHistory.length - 1]);
    } else {
      getCurrentWeather("Kansas City");
      getFiveDayForecast("Kansas City");
    }
  }

  function createHistoryList(historyArray) {
    for (let i = 0; i < historyArray.length; i++) {
      let newAtag = $("<a>");
      newAtag.attr("class", "panel-block");
      newAtag.text(historyArray[i]);
      newAtag.attr("id", historyArray[i]);
      $("#cityHistoryContainer").prepend(newAtag);
    }
  }

  function getCurrentFromCoordinates(lat, lon) {
    $.ajax({
      url:
        "https://api.openweathermap.org/data/2.5/weather?" +
        "lat=" +
        lat +
        "&lon=" +
        lon +
        "&units=imperial" +
        "&APPID=" +
        APIKEY,
      method: "GET",
    }).then(function (response) {
      getFiveDayForecast(response.name);
      // addToHistory(response.name)
      getUVIndex(response.coord.lat, response.coord.lon);
      $("#headerCity").text("Current location: " + response.name);
      $("#currentIcon").attr(
        "src",
        "https://openweathermap.org/img/wn/" +
          response.weather[0].icon +
          "@2x.png"
      );
      $("#currentCity").text(response.name);
      $("#currentDate").text(moment().format("MMMM Do, YYYY"));
      $("#currentTemperature").text(
        "Current Temperature: " + response.main.temp.toFixed() + "°"
      );
      $("#currentHumidity").text("Humidity: " + response.main.humidity + "%");
      $("#currentWindSpeed").text(
        "Wind Speed: " + response.wind.speed + " mph"
      );
    });
  }

  function getCurrentWeather(cityName) {
    $.ajax({
      url:
        "https://api.openweathermap.org/data/2.5/weather?q=" +
        cityName +
        "&units=imperial" +
        "&APPID=" +
        APIKEY,
      method: "GET",
    }).then(function (response) {
      getUVIndex(response.coord.lat, response.coord.lon);
      $("#currentIcon").attr(
        "src",
        "https://openweathermap.org/img/wn/" +
          response.weather[0].icon +
          "@2x.png"
      );
      $("#currentCity").text(response.name);
      $("#currentDate").text(moment().format("MMMM Do, YYYY"));
      $("#currentTemperature").text(
        "Current Temperature: " + response.main.temp.toFixed() + "°"
      );
      $("#currentHumidity").text("Humidity: " + response.main.humidity + "%");
      $("#currentWindSpeed").text(
        "Wind Speed: " + response.wind.speed + " mph"
      );
    });
  }

  // getFiveDayForecast("https://api.openweathermap.org/data/2.5/forecast?q=" + "miami" + "&units=imperial" + "&APPID=" + APIKEY)
  function getFiveDayForecast(cityName) {
    $.ajax({
      url:
        "https://api.openweathermap.org/data/2.5/forecast?q=" +
        cityName +
        "&units=imperial" +
        "&APPID=" +
        APIKEY,
      method: "GET",
    }).then(function (response) {
      let fiveDayForecast = [];
      for (let i = 0; i < response.list.length; i++) {
        let hr = response.list[i].dt_txt.split(" ")[1];
        //00:00:00 is 7:00 PM eastern time
        //I want to set each day's data to around noon, so 18:00 is 1:00pm
        if (hr === "18:00:00") {
          fiveDayForecast.push(response.list[i]);
        }
      }
      for (let j = 0; j < fiveDayForecast.length; j++) {
        $("#day" + (j + 1)).empty();
        const newDayOfWeek = $("<div>");
        newDayOfWeek.text(moment(fiveDayForecast[j].dt_txt).format("dddd"));
        newDayOfWeek.attr("style", "font-weight:600");
        const newDivDate = $("<div>");
        newDivDate.text(moment(fiveDayForecast[j].dt_txt).format("MM/DD/YYYY"));
        const newImgIcon = $("<img>").attr(
          "src",
          "https://openweathermap.org/img/wn/" +
            fiveDayForecast[j].weather[0].icon +
            "@2x.png"
        );
        const newDivTemp = $("<div>");
        newDivTemp.text(fiveDayForecast[j].main.temp.toFixed() + "°");
        const newHumidityDiv = $("<div>");
        newHumidityDiv.text(fiveDayForecast[j].main.humidity + "% Humidity");
        $("#day" + (j + 1)).append(
          newDayOfWeek,
          newDivDate,
          newImgIcon,
          newDivTemp,
          newHumidityDiv
        );
      }
    });
  }

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

  function addToHistory(cityName) {
    cityHistory.push(cityName);
    localStorage.setItem("cityHistory", JSON.stringify(cityHistory));
    let newAtag = $("<a>");
    newAtag.attr("class", "panel-block");
    newAtag.text(cityName);
    newAtag.attr("id", cityName);
    $("#cityHistoryContainer").prepend(newAtag);
  }

  function clear() {
    $("#cityHistoryContainer").text("");
    localStorage.clear();
  }

  //event handlers
  // https://www.hashbangcode.com/article/prevent-enter-key-submitting-forms-jquery
  // now allows for both a click and enter key to search
  function searchCityWeather() {
    let cityName = $("#citySearch").val();
    $("#citySearch").val("");
    const queryURL =
      "https://api.openweathermap.org/data/2.5/weather?q=" +
      cityName +
      "&units=imperial" +
      "&APPID=" +
      APIKEY;
    addToHistory(cityName);
    getCurrentWeather(cityName);
    getFiveDayForecast(cityName);
  }

  $("#citySearch").on("keydown", function (e) {
    if (e.keyCode == 13) {
      e.preventDefault();
      searchCityWeather();
    }
  });

  $("#searchButton").on("click", function (e) {
    e.preventDefault();
    searchCityWeather();
  });
  $("#cityHistoryContainer").on("click", function (e) {
    if (e.target.matches("a")) {
      e.preventDefault();
      // change this later to data id?
      let cityName = e.target.id;
      getCurrentWeather(cityName);
      getFiveDayForecast(cityName);
    }
  });

  //clear history button
  $("#clear").on("click", function (e) {
    clear();
  });
});
