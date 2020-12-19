////////////////////////////////////////////
///////////MODULOS  IMPORTADOS//////////////
////////////////////////////////////////////
const express = require('express')
const cors = require('cors')
const counter = require('./routes/counter');
const translation = require('./routes/translation');


const app = express();
var bodyParser = require("body-parser"); // middleware  to handle HTTP POST request


app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // to support URL-encoded bodies
///////////////////////////////////////////////////////////////////////////////////////////


app.use(cors())

app.use(counter);
app.use(translation);

app.listen(process.env.NODE_ENV_PORT, () => {
  console.log(`Server listening on port ${process.env.NODE_ENV_PORT}!`)
});

