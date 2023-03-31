const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const calendar_schema = Schema({
    date: {
        type: String,
        require: true
    },
    content: {
        type: String
    },

})

const calendar_day = mongoose.model("calendar_day", calendar_schema);

module.exports = calendar_day;