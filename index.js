//Load env variables
require('dotenv').config() // ONLY FOR LOCAL TESTING
const fetch = require('node-fetch');

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



//Get Isochrone
app.post('/GoCallIso', async (req, res) => {
  //console.log('I got a post request');
  //console.log(req.body.navitiaUrl);
  //console.log(req.body.coords);

  try {
    let result = await callIso(req.body.navitiaUrl);
    //console.log(result)
    res.json(result);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'An error occured', error: err })
  }
});

async function callIso(url){
  const options = {
    method: 'GET',
    headers: {
      //Authorization: 'Basic ' + btoa(navitiaToken)
       Authorization: 'Basic ' + Buffer.from(process.env.navitiaToken).toString('base64')
       },
    dataType: 'json'
    };
    try {
      const response = await fetch(url, options);
      const json = await response.json();
      return json;
    } catch (err) {
      console.log(err);
    }
}


//Get Metro
app.post('/GoCallMetro', async (req, res) => {
  //console.log('I got a post request');
  //console.log(req.body.navitiaUrl);

  try {
    let result = await callMetro(req.body.navitiaUrl);
    //console.log(result)
    res.json(result);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'An error occured', error: err })
  }
});

async function callMetro(url){
  const options = {
    method: 'GET',
    headers: {
      //Authorization: 'Basic ' + btoa(navitiaToken)
       Authorization: 'Basic ' + Buffer.from(process.env.navitiaToken).toString('base64')
       },
    dataType: 'json'
    };
    try {
      const response = await fetch(url, options);
      const json = await response.json();
      return json;
    } catch (err) {
      console.log(err);
    }
}