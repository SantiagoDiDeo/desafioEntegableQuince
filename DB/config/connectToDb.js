const express = require('express');
const session = require('express-session');
const { options } = require('yargs');
const  {mongoUrl}  = require('../../enviroments/enviroment');
const app = express();
const MongoStore = require('connect-mongo');


let isConnected;

const connectToDb = async () => {
  if(!isConnected) {
    await app.use(session({
      store: new MongoStore({
        mongoUrl: mongoUrl}),
        secret: 'secreto1',
        cookie: {maxAge: 60000},  
        resave: true,
        collection: 'sessions',
        saveUninitialized: true,
      }));
    
          isConected = true;
          console.log('MongoAtlasDB Connected');
           
    return;
  } else {
    
    console.log("Conexion existente")
    return;
  };
};


module.exports = connectToDb; 