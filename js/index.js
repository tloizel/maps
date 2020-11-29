//Load env variables
//require('dotenv').config() // ONLY FOR LOCAL TESTING

const express = require('express');
const app = express();
const port = process.env.PORT || 4000; //3000 FOR LOCAL TESTING process.env.PORT || 

app.listen(port, () => {
  console.log(`Server running`);
});

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');//THIS * MUST BE CHANGED TO NOTYOUTUBE WEBSITE ONLY //https://notyoutube.dev
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Accept');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  next();
});

app.use(express.static('public')); //ability to host static files
app.use(express.json()); //ability to parse data as json
