const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const calendar_schema = Schema({
    date: {
        type: String,
        require: true
    },
    content: {
        type: String,
        require: true
    },

})

const calendar_model = mongoose.model("calendar_model", calendar_schema);

module.exports(calendar_model);