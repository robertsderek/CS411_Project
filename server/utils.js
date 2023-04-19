async function daysInMonth(month, year) {
    return new Date(month, year, 0).getDate()
}

module.exports = {
    daysInMonth,
}
