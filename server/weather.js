//put key here
const { WEATHER_API_KEY } = require('./credentials.js')
let key =  WEATHER_API_KEY

async function getWeather(q){
    weatherCall = await fetch("http://api.weatherapi.com/v1/forecast.json?key="+key+"&q="+q+"&days=10&aqi=no&alerts=no")
    weatherData = await weatherCall.json()

    return weatherData
}