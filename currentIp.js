// import {checkWeather} from './script.js';

var geocoder;

function initialize() {
    geocoder = new google.maps.Geocoder();
}

function codeLatLng(lat, lng) {
    var latlng = new google.maps.LatLng(lat, lng);
    geocoder.geocode({'latLng': latlng}, function(results, status) {
      if(status == google.maps.GeocoderStatus.OK) {
          console.log(results)
          if(results[1]) {
              //formatted address
              var address = results[0].formatted_address;
              alert("address = " + address);
          } else {
              alert("No results found");
          }
      } else {
          alert("Geocoder failed due to: " + status);
      }
    });
}

const ipKey = "2af8cb72be4ae4";
const ipUrl = "https://ipinfo.io/json?token=";

async function checkCurrentWeather(){
    // get current location's weather using ipinfo.io api
    let response = await fetch("https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=37.42159&longitude=-122.0837&localityLanguage=en"
    );
    var ipData = await response.json();

    console.log(ipData);

    // checkWeather(ipData.city)
}

// checkCurrentWeather();
