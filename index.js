const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes/routes');
const connectDB = require('./db/db');

const app = express();
const PORT = process.env.PORT || 4000;

connectDB;

app.use(bodyParser.json());

app.use('/api', routes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

