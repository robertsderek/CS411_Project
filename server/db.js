const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://jameswong:jwong123@cluster0.pjc6myt.mongodb.net/?retryWrites=true&w=majority";

const utils = require("./utils")
const weather = require("./API/weather")

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
async function check_collection(collectionName) {
  // Check to see if the collection exist in the db and connect to it
  const collections = await db.listCollections().toArray();
  const collectionExists = collections.some(col => col.name == collectionName);
  
  if (!collectionExists) {
    await db.createCollection(collectionName);
    create_month(collectionName);
  }
  
  return db.collection(collectionName);
}

/**
 * Automatically create a month based on given API input from weather as well as an empty content for future update.
 * @param {*} collectionName 
 */
async function create_month(collectionName) {
  const selectedCollection = db.collection(collectionName);
  const currentDate = new Date();
  const month = ('0' + (currentDate.getMonth() + 1)).slice(-2);
  const year = currentDate.getFullYear();

  const num_days = await utils.daysInMonth(month, year);

  for (let i = 1; i <= num_days; i++) {
    // // Formats the date to yyy-mm-dd
    const day = ('0' + i).slice(-2);
    formattedDate = `${year}-${month}-${day}`;
    const payload = {
      date: formattedDate,
      content: "",
      weather: await weather.getWeatherAtDate(formattedDate, "Boston")
    };

    selectedCollection.insertOne(payload)
  }
}

async function grab_collection_data(collectionName) {
  const docs = await db.collection(collectionName).find({}).toArray();

  return docs;
}

module.exports = {
  check_collection,
  grab_collection_data
};
