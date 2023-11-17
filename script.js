//import { 
//    checkTime 
//} from './time.js';

async function checkTime(lat, lng)
{
    // using timezonedb api to get the data, only 1 request per second

    const response = await fetch("https://api.timezonedb.com/v2.1/get-time-zone?key=8SWBKTNIMAG3&format=json&by=position" + `&lat=${lat}` + `&lng=${lng}`);

    var data = await response.json();

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
    } 
    else{
        // else it's night time 
        document.body.style.setProperty('background', "url('images/night_time.gif')");
        document.body.style.setProperty('background-size', "cover");

        document.querySelector(".card").style.background = "linear-gradient(135deg, #1100fe, #5b548a)";

        document.querySelector(".weather").style.background = "url('images/night_time.gif')";
        document.querySelector(".weather").style.backgroundSize = "cover";
    }

    // change timeDate value in html accordinngly
    document.querySelector(".timeDate").innerHTML = "Current date and time: " + data.formatted;   
    document.querySelector(".timeDate").style.display = "block";
}

// export {checkTime};

const apiKey = "77e88b916f4da4cfcd02ba787ae4e0cf";
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";

const searchBox = document.querySelector(".search input");
const searchBtn = document.querySelector(".search button");
const weatherIcon = document.querySelector(".weather-icon");

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
        document.querySelector(".temp").innerHTML = data.main.temp + "°C";
        document.querySelector(".feelLike").innerHTML = "Feels like " + data.main.feels_like + "°C";
        document.querySelector(".humidity").innerHTML = data.main.humidity +"%";
        document.querySelector(".wind").innerHTML = data.wind.speed + " km/h";
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
    }            
}  
        
searchBtn.addEventListener("click", ()=> {
    checkWeather(searchBox.value);
})

searchBox.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        checkWeather(searchBox.value);
    }
});

//export {checkWeather};