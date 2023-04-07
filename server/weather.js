//put key here
let weatherAPI = 9999

async function getWeather(q){
    weatherCall = await fetch("http://api.weatherapi.com/v1/forecast.json?key="+key+"&q="+q+"&days=10&aqi=no&alerts=no")
    weatherData = await weatherCall.json()

    return weatherData
}
