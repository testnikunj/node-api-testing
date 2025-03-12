const express = require('express');
const { createDatabaseConnection } = require('./database/database');

const app = express();
const port = 3000;

app.use(express.json());

app.use((req, res, next) => {
    // TODO: change to live
    req.db = createDatabaseConnection("live");
    // req.db = createDatabaseConnection("dev");
    next();
});


const users_api = require('./apis/users_api');
app.use('/users', users_api);

const job_department_api = require('./apis/job_department_api');
app.use('/job_department', job_department_api);


app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});