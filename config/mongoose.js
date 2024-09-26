const mongoose = require('mongoose');
require('dotenv').config(); // Ensure this is at the top

// Use DB_URL from the .env file
const uri = process.env.DB_URL;

console.log("Database URI: ", uri); // Check if DB_URL is correctly loaded

mongoose.set('strictQuery', false);

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connection to database is successful.'))
.catch((err) => console.error('Error in database connection!!!', err));

module.exports = mongoose.connection;
