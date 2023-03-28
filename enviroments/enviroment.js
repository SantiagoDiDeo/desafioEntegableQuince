const dotenv = require('dotenv').config();
const cluster = require('cluster');
const PORT = process.argv.slice(2)[0] ?? 8081;
const mongoUrl = process.env.MONGO_URI;


module.exports =  {mongoUrl, PORT};
