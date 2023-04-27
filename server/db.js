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
      await db.collection('forecast').updateOne(
        {userEmail: email, formattedDate: formattedDate},
        {$set: {weather: weather}}
      );
    }
  }
}
async function set_content(email, month, day, year, content) {
  const formattedDay = ('0' + (day)).slice(-2);
  const formattedDate = `${year}-${month}-${formattedDay}`

  const existingUser = await db.collection('content').findOne({ userEmail: email, formattedDate: formattedDate});
  if (!existingUser) {
    throw new Error('User not found');
  }

  await db.collection('content').updateOne(
    { userEmail: email, formattedDate: formattedDate},
    { $set: {content: content }}
  );
}

async function grab_collection_data(userEmail) {
  const docs = await db.collection('forecast').find( {"userEmail": userEmail} ).toArray();

  return docs;
}



// check_collection('james@gmail.com', 4, 2023, 'boston');
// updateWeather('james@gmail.com', 4, 2023, 'boston');
// set_content('james@gmail.com', 4, 25, 2023, 'hello');

module.exports = {
  check_collection,
  grab_collection_data,
  set_content
};
