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
  const existingUser = await db.collection("forecast").findOne({ userEmail: email });

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
async function create_month_collection(userEmail, month, year, location) {
  const num_days = await utils.daysInMonth(month, year);
  const forecastPromises = [];
  const contentPromises = [];

  for (let day = 1; day <= num_days; day++) {
    const formattedDate = `${year}-${month}-${day.toString().padStart(2, '0')}`;
    
    forecastPromises.push(db.collection("forecast").findOne({userEmail, formattedDate})
      .then(forecastExists => {
        if (!forecastExists) {
          return weatherAPI.getWeatherAtDate(formattedDate, location)
            .then(weather => {
              const forecast = {
                userEmail,
                month,
                year,
                formattedDate,
                location,
                weather
              }
              return forecast;
            });
        }
      }));

    contentPromises.push(db.collection("content").findOne({userEmail, formattedDate})
      .then(contentExists => {
        if (!contentExists) {
          const content = {
            userEmail,
            month,
            year,
            location,
            formattedDate,
            content: {
              name: "",
              address: ""
            },
          }
          return content;
        }
      }));
  }

  const forecasts = await Promise.all(forecastPromises).then(results => results.filter(Boolean));
  const contents = await Promise.all(contentPromises).then(results => results.filter(Boolean));

  if (forecasts.length > 0) {
    await db.collection("forecast").insertMany(forecasts);
  }

  if (contents.length > 0) {
    await db.collection("content").insertMany(contents);
  }
}


/**
 * Updates the weather within the database
 * @param {*} email 
 * @param {*} month 
 * @param {*} year 
 * @param {*} city 
 */
async function updateWeather(email, month, year, city) {
  const num_days = await utils.daysInMonth(month, year);
  const dates = [];

  for (let day = 1; day <= num_days; day++) {
    const formattedDate = `${year}-${month}-${day.toString().padStart(2, '0')}`;
    dates.push(formattedDate);
  }

  const existingForecasts = await db.collection('forecast').find({userEmail: email, formattedDate: {$in: dates}}).toArray();

  const forecastsToUpdate = existingForecasts.filter(forecast => forecast.weather === "No Data");

  const forecastUpdates = forecastsToUpdate.map(forecast => {
    const formattedDate = forecast.formattedDate;
    return weatherAPI.getWeatherAtDate(formattedDate, city)
      .then(weather => {
        if (weather !== "No Data") {
          return db.collection('forecast').updateOne(
            {userEmail: email, formattedDate: formattedDate},
            {$set: {weather: weather}}
          );
        }
      });
  });

  await Promise.all(forecastUpdates);
}


/**
 * Sets the content of a certain date
 * @param {*} email 
 * @param {*} month 
 * @param {*} day 
 * @param {*} year 
 * @param {*} content 
 */
async function set_content(email, month, day, year, name, address) {
  const formattedDay = ('0' + (day)).slice(-2);
  const formattedDate = `${year}-${month}-${formattedDay}`

  const existingUser = await db.collection('content').findOne({ userEmail: email, formattedDate: formattedDate});
  if (!existingUser) {
    throw new Error('User not found');
  }

  await db.collection('content').updateOne(
    { userEmail: email, formattedDate: formattedDate},
    { $set: { 'content.name': name, 'content.address': address } }
  );  
}

// Grab collection with the same month and year and combine their data
async function grab_collection_data(userEmail, month, year) {
  const docs = await db.collection('forecast').aggregate([
    {
      $lookup: {
        from: 'content',
        let: {
          formattedDate: '$formattedDate',
          userEmail: '$userEmail',
          month: '$month',
          year: '$year'
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ['$formattedDate', '$$formattedDate'] },
                  { $eq: ['$userEmail', '$$userEmail'] },
                  { $eq: ['$month', '$$month'] },
                  { $eq: ['$year', '$$year'] }
                ]
              }
            }
          },
          {
            $project: {
              content: 1
            }
          }
        ],
        as: 'content'
      }
    },
    {
      $unwind: '$content'
    },
    {
      $match: {
        userEmail: userEmail,
        month: month,
        year: year
      }
    },
    {
      $addFields: {
        content: '$content.content'
      }
    }
  ]).toArray();

  return docs;
}


// console.log(grab_collection_data('james@gmail.com', 4, 2023));
// check_collection('james@bu.com', 5, 2023, '42.3507377,-71.108586');
// updateWeather('james@gmail.com', 4, 2023, 'boston');
// set_content('james@gmail.com', 4, 29, 2023, 'name test', 'address test');


module.exports = {
  check_collection,
  set_content,
  grab_collection_data,
};
