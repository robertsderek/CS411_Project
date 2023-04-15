//put key here
const { WEATHER_API_KEY } = require('./credentials.js')
let key =  WEATHER_API_KEY

async function getWeather(q){
    weatherCall = await fetch("http://api.weatherapi.com/v1/forecast.json?key="+key+"&q="+q+"&days=14&aqi=no&alerts=no")
    weatherData = await weatherCall.json()

    return weatherData
}

async function get_current_weather(q) {
    weatherCall = await fetch("http://api.weatherapi.com/v1/current.json?key="+key+"&q="+q+"&aqi=no")
    weatherData = await weatherCall.json()

    return weatherData
}

/**
 * 
 * @param {*} date Should be of format yyyy-mm-dd 
 * @param {*} q 
 * @returns 
 */
async function getWeatherAtDate(date, q) {

    try {
        weatherCall = await fetch("https://api.weatherapi.com/v1/history.json?key=" + key + "&q=" + q + "&dt=" + date);
        weatherData = await weatherCall.json();
    
        parsedData = weatherData.forecast.forecastday[0].day;
        
        return parsedData    
    } catch(error) {
        return "No Data"
    }
}

// Testing
// getWeatherAtDate('2023-04-15', 'Boston').then(result => console.log(JSON.stringify(result.forecast.forecastday, null, 2)))
// getWeatherAtDate('2023-04-15', 'Boston').then(result => console.log(JSON.stringify(result, null, 2)))
// getWeatherAtDate('2023-04-30', 'Boston').then(result => console.log(result))

module.exports = {
    get_current_weather,
    getWeatherAtDate
};