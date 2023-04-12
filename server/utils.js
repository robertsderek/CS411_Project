async function daysInMonth(month, year) {
    return new Date(month, year, 0).getDate()
}

console.log(daysInMonth(4, 2023))