const express = require('express');
const routeLogin = require('./routes/routeLogin');
const routeUser = require('./routes/routeUser');
const routeCategories = require('./routes/routeCategories');
const routePost = require('./routes/routePost');
const errorMiddleware = require('./middlewares/errorMiddleware');
// ...

const app = express();

app.use(express.json());

app.use('/login', routeLogin);
app.use('/user', routeUser);
app.use('/categories', routeCategories);
app.use('/post', routePost);
app.use(errorMiddleware);

// ...

// É importante exportar a constante `app`,
// para que possa ser utilizada pelo arquivo `src/server.js`
module.exports = app;
