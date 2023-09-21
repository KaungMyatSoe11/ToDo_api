require("dotenv").config();
require("express-async-errors");
const express = require("express");
const cors = require("cors");
const requestIp = require('request-ip')

const connectDB = require("./db/connect");

const app =express()

// Define a sample route
app.get('/', (req, res) => {
    res.json({ message: 'Hello, World!' });
  });
  
  // Set the port for your server
  const PORT = process.env.PORT || 3000;
  
  // Start the server
  app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
  });