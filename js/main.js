const cityElement = document.getElementById("citySelect");
const cityNameElement = document.getElementById("cityName");
let cityData = {};


fetchCityList();


async function fetchCityList() {
  const response = await fetch("./js/city_coordinates.json")
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        console.log("Not Succeseful");
      }
    })
    .then((data) => {
      cityData = data;
      cityElement.innerHTML = data.map(showCityList);
      fetchWeatherData(cityData[0]);
    })
    .catch((error) => {
      console.log(error);
    });
}

function showCityList(item) {
  const cityNames = '<option value="' + item.city + '">' + item.city + ", " + item.country + "</option>";
  return cityNames;
}

function change_select(city) {
  cityNameElement.innerHTML = city;
  const cityInfo = cityData.filter((item) => item.city === city);
  fetchWeatherData(cityInfo[0]);
}


async function fetchWeatherData(cityInfo) {
  resetWeather("today-card");
  resetWeather("weather-container");

  const { latitude, longitude, city, country } = cityInfo;
  cityNameElement.innerHTML = city;

  const sevenTimerUrl =
    "https://www.7timer.info/bin/api.pl?lon=" +
    longitude.toString() +
    "&lat=" +
    latitude.toString() +
    "&product=civillight&output=json";

    console.log(sevenTimerUrl);

  const response = await fetch(sevenTimerUrl)
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        console.log("Not Succeseful");
      }
    })
    .then((data) => {
      const dataSeries = data.dataseries;
      showWeather("today-card", dataSeries);
      showWeather("weather-container", dataSeries);
    })
    .catch((error) => {
      console.log(error);
    });
}

function showWeather(wrap, items) {
  let div = document.getElementById(wrap);

  for (let i = 0; i < div.children.length; i++) {
    let item = items[i];
    div.children[i].querySelector(".weather-date").innerHTML = dateFomat(item.date);
    div.children[i].querySelector(".weather-date").classList.remove("skeleton");
    div.children[i].querySelector(".weather-info").innerHTML = item.weather.toUpperCase();
    div.children[i].querySelector(".weather-info").classList.remove("skeleton");
    div.children[i].querySelector(".weather-high").innerHTML = item.temp2m.max +"°C";
    div.children[i].querySelector(".weather-high").classList.remove("skeleton");
    div.children[i].querySelector(".weather-high-low").innerHTML = "High:" + item.temp2m.max + "°C <br /> Low:" + item.temp2m.min + "°C";
    div.children[i].querySelector(".weather-high-low").classList.remove("skeleton");
    let image = document.createElement('img');
    image.setAttribute("src", "../images/" +item.weather + ".png");
    image.setAttribute("alt", item.weather);
    div.children[i].querySelector(".weather-image").appendChild(image);
    div.children[i].querySelector(".weather-image").classList.remove("skeleton");


  }
}

function resetWeather(name) {
  let div = document.getElementById(name);
  for (let i = 0; i < div.children.length; i++) {
      div.children[i].querySelector(".weather-date").innerHTML = "";
      div.children[i].querySelector(".weather-date").classList.add("skeleton");
      div.children[i].querySelector(".weather-info").innerHTML = "";
      div.children[i].querySelector(".weather-info").classList.add("skeleton");
      div.children[i].querySelector(".weather-high").innerHTML = "";
      div.children[i].querySelector(".weather-high").classList.add("skeleton");
      div.children[i].querySelector(".weather-high-low").innerHTML = "";
      div.children[i].querySelector(".weather-high-low").classList.add("skeleton");
      div.children[i].querySelector(".weather-image").classList.add("skeleton");
      div.children[i].querySelector(".weather-image").removeChild(div.children[i].querySelector(".weather-image").firstChild);
   
    }
}

function dateFomat(date) {
  const options = {
    weekday: "long",
  };
  let dateinfo = String(date);
  dateinfo = dateinfo.slice(4, 6) + "/" + dateinfo.slice(6, 8) + "/" + dateinfo.slice(0, 4);
  const todayDay = new Date().toLocaleDateString("en-US", options);
  let newFormat = new Date(dateinfo).toLocaleDateString("en-US", options);

  if(todayDay===newFormat){
    newFormat = "Today";
  }else{
    newFormat = new Date(dateinfo).toLocaleDateString("en-US", options);
  }
  return newFormat;
}
