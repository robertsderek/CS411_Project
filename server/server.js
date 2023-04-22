const express = require("express");
const cors = require("cors");
const mongoose = require('mongoose')
const { OAuth2Client } = require('google-auth-library');
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

  // Check to see if the collection exist and return it as a response
  const currentDateCollectionName = currentMonth + "-" + currentYear;
  try {
    await dbManager.check_collection(currentDateCollectionName);
    const data = await dbManager.grab_collection_data(currentDateCollectionName);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({error: "Internal serveral error"});
  }
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

// verify and get user data
async function verify(client_id, jwtToken) {
  const client = new OAuth2Client(client_id);
  // Call the verifyIdToken to
  // varify and decode it
  const ticket = await client.verifyIdToken({
      idToken: jwtToken,
      audience: client_id,
  });
  // Get the JSON with all the user info
  const payload = await ticket.getPayload();
  // This is a JSON object that contains
  // all the user info
  return payload;
}

app.post('/oauth', async (req, res) => {
  let oauth = req.body;
  let cred = oauth['credential']
  let client_id = oauth['client_id']
  let userData = await verify(client_id, cred)
  res.json(userData)
})

app.listen(3001, () => console.log("Server started on port 3001"));
