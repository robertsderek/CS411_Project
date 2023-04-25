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
  const userEmail = email;

  // Check to see if the user exists in the db
  const existingUser = await db.collection('users').findOne({ userEmail });

  if (!existingUser) {
    const monthDataObj = await create_month_data(month, year, location);
    const user = {userEmail, month, year, location, monthDataObj};

    await db.collection('users').insertOne(user)
  } else {
    // check if the collection exist
    const existingCollection = await db.collection('users').find({"userEmail": email, "month": month, "year": year}).toArray();

    // if not we replace the data
    if (existingCollection.length === 0) {
      const monthDataObj = await create_month_data(month, year, location);
      await db.collection('users').updateOne({ userEmail }, { $set: { "monthDataObj": monthDataObj } });
    } else {
      // Otherwise we update it with new information
      const monthDataObj = await create_month_data(month, year, location);

      await db.collection('users').updateOne({ "userEmail": userEmail, "calendar.month": month, "calendar.year": year }, { $set: { "monthDataObj": monthDataObj } });
    }
  }
}


/**
 * Automatically create a month based on given API input from weather as well as an empty content for future update.
 * @param {*} collectionName 
 */
async function create_month_data(month, year, city) {
  const num_days = await utils.daysInMonth(month, year);
  const month_data = [];

  for (let i = 1; i <= num_days; i++) {
    const day = ('0' + i).slice(-2);
    const formattedDate = `${year}-${month}-${day}`;
    const weather = await weatherAPI.getWeatherAtDate(formattedDate, city);

    const payload = {
      formattedDate,
      content: "",
      weather
    };

    month_data.push(payload);
  }

  return month_data;
}

async function grab_collection_data(userEmail) {
  const docs = await db.collection('users').find( {"userEmail": userEmail} ).toArray();

  return docs;
}

// async function insert_content(email, month, year, date, content) {
//   try {
//     // find the user's collection
//     const collection = await db.collection('users').findOne({ userEmail: email });
    
//     if (!collection) {
//       throw new Error(`User with email ${email} not found`);
//     }

//     // find the document for the specified date
//     const document = collection.calendar.find((item) => item.month === month && item.year === year)?.month_data[date];
    
//     if (!document) {
//       throw new Error(`Document for ${date} not found`);
//     }

//     // update the content
//     document.content = content;

//     // save the changes
//     await db.collection('users').updateOne({ userEmail: email }, { $set: { calendar: collection.calendar } });
    
//   } catch (err) {
//     console.log(err);
//   }
// }

check_collection('james@gmail.com', 5, 2023, 'boston');

module.exports = {
  check_collection,
  grab_collection_data
};
