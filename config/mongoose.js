const mongoose = require('mongoose');
require('dotenv').config();
// Use DB_URL from the .env file
const uri = process.env.DB_URL;

mongoose.set('strictQuery', false);

mongoose.connect(uri);

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'Error in database connection!!!'));

db.once('open', () => {
    console.log('Connection to database is succesfull.');
});

module.exports = db;