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

module.exports = {
    get_current_weather
};