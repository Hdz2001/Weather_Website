let keywords = [];
let csvUrl = 'https://hdz2001.github.io/SimpleMaps_WorldCities_DB/worldcities.csv'

// Fetch data from Simple Maps API CSV
// there will be some datas conflict with OpenWeather API
// however, OpenWeather API doesn't offer country/cities datas, so this is a way around 

// Fetch the CSV file and parse it using Papa Parse
fetch(csvUrl)
.then(response => response.text())
.then(csvText => {
    Papa.parse(csvText, {
        complete: function(results) {
        // Access the parsed data here
        const csvData = results.data;

        for (let i=0; i<csvData.length; i++){
            // add countries
            keywords.push(csvData[i].country)
            // add cities
            keywords.push(csvData[i].city + ", " + csvData[i].country)
        }   

        // remove duplicates
        keywords = [...new Set(keywords)];
        
        // filter undefined and empty items
        keywords = keywords.filter(item => item !== undefined);
        keywords = keywords.filter(item => item !== '');
    },
    header: true, // Set to true if your CSV has a header row
  });
})
.catch(error => console.error('Error fetching CSV:', error));

// ... 
const resultBox = document.querySelector(".result-box");
const inputBox = document.getElementById("input-box");

inputBox.onkeyup = function(){
    let result = [];
    let input = inputBox.value;

    if (input.length){
        result = keywords.filter((keyword) => {
            let joinInput = input.replace(/\s/g, "");
            let joinKeyword = keyword.replace(/\s/g, "");

            if (keyword[0].toLowerCase().includes(input[0].toLowerCase()))
            {
                return joinKeyword.toLowerCase().includes(joinInput.toLowerCase());
            }
        });
        console.log(result);
    }

    display(result);

    if (!result.length)
    {
        resultBox.innerHTML = '';
    }
}

// display search result box
function display(result){
    const content = result.map((list)=>{
        return "<li onclick = selectInput(this)>" + list + "</li>"; 
    })

    resultBox.innerHTML = "<ul>" + content.join('') + "</ul>";
}

// function for each item in result box on-click
// will put inputBox's value = the item's on-click value 
// then clean result box
function selectInput(list){
    inputBox.value = list.innerHTML;
    resultBox.innerHTML = '';
}

