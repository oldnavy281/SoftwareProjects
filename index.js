// const express = require('express');
// const pug = require('pug');
// const routes = require('./routes/routes');
// const path = require('path');
// // const discord = require('./Discord/discord');

// const app = express();


// app.set('view engine', 'pug');
// app.set('views', __dirname + '/views');



const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const routes = require('./routes/routes');

const PORT = 3000;
const path = require('path');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, './views'));
app.locals.dasedir = app.get('./views');

app.get('/', routes.index);
app.get('/gmail', routes.index);

app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));