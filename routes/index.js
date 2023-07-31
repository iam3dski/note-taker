//import express router
const express = require('express').Router;
const notes = require('./notes.js');

// Import our modular routers 
const api = express();

api.use('/api', notes);
//epxport the router 
module.exports = api;