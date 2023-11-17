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
        document.body.style.setProperty('background-size', "cover");
        document.querySelector(".card").style.background = "linear-gradient(135deg, #0098fe, #8a8654)";
    } 
    else{
        // else it's night time 
        document.body.style.setProperty('background', "url('images/night_time.gif')");
        document.body.style.setProperty('background-size', "cover");
        document.querySelector(".card").style.background = "linear-gradient(135deg, #1100fe, #5b548a)";
    }

    // change timeDate value in html accordinngly
    document.querySelector(".timeDate").innerHTML = "Current date and time: " + data.formatted;   
    document.querySelector(".timeDate").style.display = "block";
}

// export {checkTime};