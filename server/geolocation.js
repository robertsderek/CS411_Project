function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition)
    } else {
        return "Geolocation is not supported"
    }
}

function showPosition(position) {
    return "Lat:" + position.coords.latitude+ "<br> Lon: " + position.coords.longitude
}

module.exports = {
    getLocation
}