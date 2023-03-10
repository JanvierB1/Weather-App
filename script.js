var searchbutton = $('#search-btn');

function startSearch(event) {
    event.preventDefault();
    query = $('#search-city').val();
    getCoordinates(query);
}

var getCoordinates = function (query) {

    var apiUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${query}&appid=36e86471fab96e1301343f011372f254`;
    fetch(apiUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
            getFiveDayForecast(data[0].lat, data[0].lon);
            getCurrentWeather(data[0].lat, data[0].lon);
            storeCity(data[0].lat, data[0].lon);
        })
}

var getCurrentWeather = function (lat, lon) {
    var apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=36e86471fab96e1301343f011372f254`;
    fetch(apiUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
            var presentCity = $('#display-city');
            var presentDate = $('#display-date');
            var presentIcon = $('#display-icon');
            var presentTemp = $('#display-temp');
            var presentWind = $('#display-wind');
            var presentHumidity = $('#display-humidity');
            presentCity.text(data.name);
            presentDate.text(moment().format('MM/DD/YYYY'));
            presentIcon.html(`<img src="http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png">`);
            presentTemp.text('Temp: ' + data.main.temp + '°F');
            presentWind.text('Wind: ' + data.wind.speed + ' MPH');
            presentHumidity.text('Humidity: ' + data.main.humidity + '%');
        })
}

var getFiveDayForecast = function (lat, lon) {
    var apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=36e86471fab96e1301343f011372f254`;
    fetch(apiUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
        var dailyLabel = $('#Daily');
            dailyLabel.text('5-Day Forecast:');
        var Forecast = $('#daily-forecast');
            Forecast.empty();
            $('#form')[0].reset();
            for (var i = 0; i < data.list.length; i += 8) {
                var html = ` 
            <div class="card" style="width: 11rem; background-color:White; margin-bottom: 1em;">
            <div class="Box-body">
            <h5 class="Box-title" style="color:black;">${moment.unix(data.list[i].dt).format('MM/DD/YYYY')}</h5>
            <img src="http://openweathermap.org/img/wn/${data.list[i].weather[0].icon}.png">
            <p class="box-Text" style="color:black;">Temp: ${data.list[i].main.temp}°F</p>
            <p class="box-Text" style="color:black;">Wind: ${data.list[i].wind.speed} MPH</p>
            <p class="box-Text" style="color:black;">Humidity: ${data.list[i].main.humidity}%</p>
            </div>
            </div>
            `
                Forecast.append(html);
            }

        })
}

var saveCity = function (lat, lon) {
    var apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=36e86471fab96e1301343f011372f254`;
    fetch(apiUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);

            var cities = data.name;
            var storedCities = getCities();
                if (storedCities === null) {
            var cityarray = [];
                } else {
            var cityarray = storedCities;
            }
            
            console.log(!cityarray.includes(cities));
                if (!cityarray.includes(cities)) {
                cityarray.push(cities);
            }
            localStorage.setItem('cities', JSON.stringify(cityarray));
            init();
        })
}

function getCities() {
    return JSON.parse(localStorage.getItem('cities'));
}

function init() {
    $('#search-history').html('');
    var cityarray = getCities();
    console.log(cityarray);
    if (cityarray) {
        console.log("success");
        for (var i = 0; i < cityarray.length; i++) {
            var storedCityEl = $('<button class="btn btn-primary">');
            var storedCity = storedCityEl.text(cityarray[i]);
            $('#search-history').append(storedCity);
        }
    }
}
init();

searchbutton.on('click', startSearch);
$('#search-history').on('click', reSearch);

function reSearch(event) {
    getCoordinates(event.target.innerText)
}