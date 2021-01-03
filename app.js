const express = require('express');
const app = express();
const path = require('path')


app.use(express.static(path.join(__dirname, 'public')))

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'hbs')

const router = require('./routes/routes')
app.use('/', router)


const port = process.env.PORT || 3000;

app.listen(port, () => console.log('My first app listening on port 3000! '));