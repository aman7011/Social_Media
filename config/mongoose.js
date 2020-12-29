const mongoose = require('mongoose');
const env = require('./environment');

mongoose.connect(`mongodb://localhost/${env.db}`);

const db = mongoose.connection;

db.on('error', console.error.bind(console,"Error Connecting To MongoDB"));

db.once('open', function(){
    console.log('Connected To The Database :: MongoDB'); //services are getting stopped again and again
});
module.exports = db;