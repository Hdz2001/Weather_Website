//import { 
//    checkTime 
//} from './time.js';

const apiKey = "77e88b916f4da4cfcd02ba787ae4e0cf";
// URL for currentWeather
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";
// URL for forecast
const fcUrl = "https://api.openweathermap.org/data/2.5/forecast?units=metric&"

const searchBox = document.querySelector(".search input");
const searchBtn = document.querySelector(".search button");
const searchValue = document.querySelector(".result-box");
const weatherIcon = document.querySelector(".weather-icon");

async function checkTime(lat, lng)
{
    // using timezonedb api to get the data, only 1 request per second

    const response = await fetch("https://api.timezonedb.com/v2.1/get-time-zone?key=8SWBKTNIMAG3&format=json&by=position" + `&lat=${lat}` + `&lng=${lng}`);

    var data = await response.json();

    console.log("CHECK TIME");
    console.log(data);

    let dateTime =  data.formatted;

    // get date and time as array
    const myArray = dateTime.split(" ");
    const timeArray = myArray[1].split(":");

    // converting time to seconds
    let curTime = Number(timeArray[0])*60*60 + Number(timeArray[1])*60 + Number(timeArray[2]);

    // Original idea: checking curTime in UNIX with sunset and sunrise time, but doesn't seem to be working.
    // Will have a look in the future. 
    if (curTime > 6*60*60 & curTime < 18*60*60){
        // converting 6AM and 18PM to seconds
        // if current time is between 6AM and 6PM, then it's daytime
        document.body.style.setProperty('background', "url('images/day_time.gif')");
        document.body.style.setProperty('background-size', 'cover');

        document.querySelector(".card").style.background = "linear-gradient(135deg, #0098fe, #8a8654)";

        // can be cleaner? 
        document.querySelector(".weather").style.background = "url('images/day_time.gif')";
        document.querySelector(".weather").style.backgroundSize = "cover";

        var elems = document.querySelectorAll(".dayBox");
        var index = 0, length = elems.length;
        for ( ; index < length; index++) {
            elems[index].style.background = "linear-gradient(200deg, #8ac95d, #ffd1dc)";
        }
    } 
    else{
        // else it's night time 
        document.body.style.setProperty('background', "url('images/night_time.gif')");
        document.body.style.setProperty('background-size', "cover");

        document.querySelector(".card").style.background = "linear-gradient(200deg, #5b548a,#0044fe)";

        document.querySelector(".weather").style.background = "url('images/night_time.gif')";
        document.querySelector(".weather").style.backgroundSize = "cover";

        var elems = document.querySelectorAll(".dayBox");
        var index = 0, length = elems.length;
        for ( ; index < length; index++) {
            elems[index].style.background = "linear-gradient(0deg, #808080, #a9a9a9)";
        }
    }

    // change timeDate value in html accordinngly
    document.querySelector(".timeDate").innerHTML = "Current date and time 🕰️: " + data.formatted;   
    document.querySelector(".timeDate").style.display = "block";
}

// export {checkTime};

async function forecastWeather(lat, lng){
    // 5 days/3hrs forecast
    const response = await fetch(fcUrl + `&lat=${lat}` + `&lon=${lng}` + `&appid=${apiKey}`);
    var data = await response.json();
    console.log("FORECAST");
    console.log(data);

    // make an array to store forecast values
    // this array always has length of 40
    let fcArray = data.list;
    console.log(fcArray);

    // new day start at array 5 
    // end day from 5->12

    // arrays to store time, degree, weather values
    let time = [];
    let degree = [];
    let weather = [];

    for (let i = 0; i < 40; i++) {
        time.push(fcArray[i].dt_txt);
        degree.push(fcArray[i].main.temp);
        weather.push(fcArray[i].weather[0].main);
    }

    console.log(time);
    console.log(degree);
    console.log(weather);

    for (let i = 1; i <= 40; i++) {
        let splitTime = time[i-1].split(" ");
        let splitDay = splitTime[0].split("-");

        document.querySelector(".time" +i).innerHTML = splitDay[2] + "/" + splitDay[1] + "\n" + splitTime[1].slice(0, -3);
        document.querySelector(".degree" +i).innerHTML = degree[i-1] + "°C";

        if (weather[i-1] == "Clouds"){
            document.querySelector(".weather" +i).src = "images/clouds.png";
        }
        else if (weather[i-1] == "Clear"){
            document.querySelector(".weather" +i).src = "images/clear.png";
        }
        else if (weather[i-1] == "Rain"){
            document.querySelector(".weather" +i).src = "images/rain.png";
        }
        else if (weather[i-1] == "Drizzle"){
            document.querySelector(".weather" +i).src = "images/drizzle.png";
        }
        else if (weather[i-1] == "Mist"){
            document.querySelector(".weather" +i).src = "images/mist.png";
        }
        else if (weather[i-1] == "Snow"){
            document.querySelector(".weather" +i).src = "images/snow.png";
        }
    }
}

async function checkWeather(city){
    const response = await fetch(apiUrl + city + `&appid=${apiKey}`);

    if (response.status == 404 || response.status == 400){
        document.querySelector(".error").style.display = "block";
        document.querySelector(".weather").style.display = "none";
        document.querySelector(".timeDate").style.display = "none";
        document.querySelector(".main").style.display = "none";
        document.querySelector(".details").style.display = "none";
    } 
    else{
        var data = await response.json();

        console.log(data);

        var lat = data.coord.lat;
        var lng = data.coord.lon;

        // change values for card
        document.querySelector(".city").innerHTML = data.name;
        document.querySelector(".howWeather").innerHTML = data.weather[0].main;
        document.querySelector(".temp").innerHTML = data.main.temp + "°C";  
        document.querySelector(".feelLike").innerHTML = "Feels like " + data.main.feels_like + "°C";
        document.querySelector(".humidity").innerHTML = data.main.humidity +"%";
        document.querySelector(".wind").innerHTML = Math.round(data.wind.speed * 3.6 * 100) / 100 + " km/h";
        document.querySelector(".minTemp").innerHTML = data.main.temp_min + "°C";
        document.querySelector(".maxTemp").innerHTML = data.main.temp_max + "°C";

        if (data.weather[0].main == "Clouds"){
            weatherIcon.src = "images/clouds.png";
        }
        else if (data.weather[0].main == "Clear"){
            weatherIcon.src = "images/clear.png";
        }
        else if (data.weather[0].main == "Rain"){
            weatherIcon.src = "images/rain.png";
        }
        else if (data.weather[0].main == "Drizzle"){
            weatherIcon.src = "images/drizzle.png";
        }
        else if (data.weather[0].main == "Mist"){
            weatherIcon.src = "images/mist.png";
        }
        else if (data.weather[0].main == "Snow"){
            weatherIcon.src = "images/snow.png";
        }

        document.querySelector(".weather").style.display = "inline-block";
        document.querySelector(".error").style.display = "none";
        document.querySelector(".main").style.display = "flex";
        document.querySelector(".details").style.display = "flex";
        document.querySelector(".timeDate").style.display = "block";

        // check current time 
        checkTime(lat,lng);
        forecastWeather(lat,lng);
    }            
}  

// on-click function for search btn
searchBtn.addEventListener("click", ()=> {
    checkWeather(searchBox.value);
    searchBox.value = '';
})

// on-click function for search box's value
searchValue.addEventListener("click", ()=> {
    checkWeather(searchBox.value);
    searchBox.value = '';
})

// on-click function for enter btn of search box 
searchBox.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        checkWeather(searchBox.value);
        searchBox.value = '';
    }
});