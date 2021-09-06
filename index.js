const express = require("express");
const app = express();
const morgan=require('morgan');

console.log(process.env['NODE_ENV']);

app.use(morgan('combined'));
require("./startup/logging");
require("./startup/routes")(app);
require("./startup/db")();
require("./startup/config")();
require("./startup/validation")();

const port = process.env.PORT || 300;
const server=app.listen(port, () => console.log(`Listening on port ${port}...`));

module.exports=server; 
