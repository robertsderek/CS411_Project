const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb")
const uri = "mongodb+srv://jameswong:jwong123@cluster0.pjc6myt.mongodb.net/?retryWrites=true&w=majority"

const app = express();

app.use(cors());
app.use(express.json());

const utils = require("./utils");
const dbManager = require("./db")

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

const Calendar_day = require('./models/calendar_model');

/**
 * Finds all the available data within the calendar
 */
app.get('/calendar', async (req, res) => {
  // Date Variables
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentDay = currentDate.getDate();
  const currentYear = currentDate.getFullYear();
  const num_days = await utils.daysInMonth(currentDate.getMonth(), currentDate.getFullYear());

  // Check to see if the collection exist in the db and connect to it
  const currentDateCollectionName = currentMonth + "-" + currentYear;
  currentCollection = dbManager.grab_collection(currentDateCollectionName)
  
  res.json(currentCollection);
});


/**
 * Create a new calendar_day data
 */
app.post('/calendar/new', async (req, res) => {
  const calendar_day = new Calendar_day( {
    date: current_date,
    content: req.body['content'],
    weather: req.body['weather']
  });

  calendar_day.save()

  res.json(calendar_day)
});

/**
 * Delete existing calendar date by id
 */
app.delete('/calendar/delete/:id', async (req, res) => {
	const result = await Calendar_day.findByIdAndDelete(req.params.id);

	res.json({result});
});

app.listen(3001, () => console.log("Server started on port 3001"));
