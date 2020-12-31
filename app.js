const express = require('express');
const app = express();
const path = require('path')
require('./config/hbs.config')

const trainers = require('./data/trainers.json');
const clients = require('./data/clients.json')


app.use(express.static(path.join(__dirname, 'public')))

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'hbs')

app.get('/home', (req, res, next) => {
  res.render('home')
});

app.get('/trainers-config', (req, res, next) => {
   const data = { trainers: trainers.trainers, clients: clients.clients }
   console.log(trainers)
    res.render('trainers', data)
  });

app.listen(3000, () => console.log('My first app listening on port 3000! '));