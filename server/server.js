const express = require("express");
const cors = require("cors");
const { OAuth2Client } = require('google-auth-library');
const { MongoClient, ServerApiVersion } = require("mongodb")
const uri = "mongodb+srv://jameswong:jwong123@cluster0.pjc6myt.mongodb.net/?retryWrites=true&w=majority"

const app = express();

app.use(cors());
app.use(express.json());

const dbManager = require("./db")

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

/**
 * Finds all the available data within the calendar
 */
app.get('/calendar', async (req, res) => {
  const userEmail = req.query.userEmail;
  const location = req.query.location;

  // Date Variables
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();

  try {
    await dbManager.check_collection(userEmail, currentMonth, currentYear, location);
    const data = await dbManager.grab_collection_data(userEmail, currentMonth, currentYear);
    res.json(data);
  } catch (err) {
    console.error(err); 
    res.status(500).json({error: "Internal serveral error"});
  }
});

/**
 * Create a new content for calendar day
 */
app.post('/calendar/new', async (req, res) => {
  try {
    const email = req.query.email;
    const month = req.query.month
    const day = req.query.day;
    const year = req.query.year;
    const contentName = req.query.contentName;
    const contentAddress = req.query.contentAddress;

    dbManager.set_content(email, month, day, year, contentName, contentAddress);
    
    const data = await dbManager.grab_collection_data(email);
    res.json(data);
  } catch(error) {
    console.log(error);
    res.status(500).send("Server Error");
  }
});

/**
 * Delete existing calendar date by id
 */
app.delete('/calendar/delete/:id', async (req, res) => {
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

app.post('/api/location', (req, res) => {
  // log the incoming request data to the console
  console.log(req.body); 
  res.send({ message: 'Data received successfully!' });
});

app.listen(3001, () => console.log("Server started on port 3001"));
