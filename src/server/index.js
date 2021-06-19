const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

//Middleware
app.use(bodyParser.json());
app.use(cors());

const apis = require('./../router/apis');
app.use('/apis', apis);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log('server started on port ${port}'));