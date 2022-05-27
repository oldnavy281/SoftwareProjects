const express = require('express');
const pug = require('pug');
const routes = require('./routes/routes');
const path = require('path');
// const discord = require('./Discord/discord');

const app = express();
const PORT = 3000;


app.set('view engine', 'pug');
app.set('views', __dirname+ '/views');

app.get('/', routes.index);
app.get('/gmail', routes.index);

app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));