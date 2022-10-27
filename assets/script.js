// GIVEN a weather dashboard with form inputs
// WHEN I search for a city
// THEN I am presented with current and future conditions for that city and that city is added to the search history
// WHEN I view current weather conditions for that city
// THEN I am presented with the city name, the date, an icon representation of weather conditions, the temperature, the humidity, and the wind speed
// WHEN I view future weather conditions for that city
// THEN I am presented with a 5-day forecast that displays the date, an icon representation of weather conditions, the temperature, the wind speed, and the humidity
// WHEN I click on a city in the search history
// THEN I am again presented with current and future conditions for that city

    $(document).ready(function () {
      console.log('loaded your mom');
     
      var button = document.querySelector('.button')
      var inputValue = document.querySelector('.inputValue')
      var cityName = document.querySelector ('.city-name')
      var desc = document.querySelector('.desc')
      var temp = document.querySelector('.temp');
  
      button.addEventListener('click', function(){
          fetch ('https://api.openweathermap.org/data/2.5/weather?q='+inputValue.value+'&appid=41ea4a85cfbbfb9d089175fe1df741b6')
      .then(response => response.json())
      .then(data => console.log(data))
  
      // returns incase city doesn't show up 
      .catch(err => alert("type gud bucko."))
      })
    });
  
      // get time using minutes maybe?
      // var date = moment().format("l");
  
      // var day1 = moment().add(1, "days").format("l");
      // var day2 = moment().add(1, "days").format("l");
      // var day3 = moment().add(1, "days").format("l");
      // var day4 = moment().add(1, "days").format("l");
      // var day5 = moment().add(1, "days").format("l");
  
      // console.log(day1);
  
      
      // var beg4Url = "api.openweathermap.org/data/2.5/forecast?q=" + city + "&units=iperial&appid=41ea4a85cfbbfb9d089175fe1df741b6";
  
  
  
  