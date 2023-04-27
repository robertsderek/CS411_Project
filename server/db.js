const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://jameswong:jwong123@cluster0.pjc6myt.mongodb.net/?retryWrites=true&w=majority";

const utils = require("./utils")
const weatherAPI = require("./API/weather");

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

const db = client.db();
/**
 * Checks to see if the collection exist in the db and connect to it.
 * If Collection does not exist then we create it
 * Format of collectionName should be m-yyyy
 */
async function check_collection(email, month, year, location) { 
  // Check to see if the user exists in the db
  const existingUser = await db.collection('forecast').findOne({ userEmail: email });
  const num_days = await utils.daysInMonth(month, year);

  if (!existingUser) {
    await create_month_collection(email, month, year, location);

  } else {
    // Check if the collection for current month exist
    const existingMonth = await db.collection('forecast').find({userEmail: email, month: month, year: year}).toArray();
    
    if (existingMonth.length === 0) {
      console.log('Month does not exist');
      await create_month_collection(email, month, year, location);
    } else {
      // Update forecast if "No Data"
      updateWeather(email, month, year, location);
    }
  }
}


/**
 * Automatically create a month based on given API input from weather as well as an empty content for future update.
 * @param {*} collectionName 
 */
async function create_month_collection(userEmail, month, year, city) {
  const num_days = await utils.daysInMonth(month, year);

  for (var i = 0; i < num_days; i++) {
    const day = ('0' + (i + 1)).slice(-2); // increment i by 1 to start at day 1
    const formattedDate = `${year}-${month}-${day}`;
    const weather = await weatherAPI.getWeatherAtDate(formattedDate, city);

    const forecast = {
      userEmail,
      month,
      year,
      formattedDate,
      city,
      weather
    }
    db.collection("forecast").insertOne(forecast);


    const content = {
      userEmail,
      month,
      year,
      city,
      formattedDate,
      content: "",
    }

    db.collection("content").insertOne(content);
  }
}

async function updateWeather(email, month, year, city) {
  const num_days = await utils.daysInMonth(month, year);

  for (var i = 0; i < num_days; i++) {
    const day = ('0' + (i + 1)).slice(-2); // increment i by 1 to start at day 1
    const formattedDate = `${year}-${month}-${day}`;
    const weather = await weatherAPI.getWeatherAtDate(formattedDate, city);

    // check database collection
    const collection = await db.collection('forecast').findOne({userEmail: email})
    if (collection.weather == "No Data" && weather != "No Data") {
      console.log("it works");
      await db.collection('forecast').updateOne(
        {userEmail: email, formattedDate: formattedDate},
        {$set: {weather: weather}}
      );
    }
  }
}

async function grab_collection_data(userEmail) {
  const docs = await db.collection('users').find( {"userEmail": userEmail} ).toArray();

  return docs;
}

async function set_content(email, day, content) {
  const existingUser = await db.collection('users').findOne({ "userEmail": email });
  if (!existingUser) {
    throw new Error('User not found');
  }

  const { monthDataObj } = existingUser;
  const index = day - 1; // adjust for 0-based array indexing

  // make sure the index is within the range of the array
  if (index < 0 || index >= monthDataObj.length) {
    throw new Error('Invalid date');
  }

  // update the content field at the specified index
  monthDataObj[index].content = content;

  await db.collection('users').updateOne(
    { "userEmail": email },
    { $set: { "monthDataObj": monthDataObj } }
  );
}


// check_collection('james@gmail.com', 4, 2023, 'boston');
updateWeather('james@gmail.com', 4, 2023, 'boston');

module.exports = {
  check_collection,
  grab_collection_data,
  set_content
};
