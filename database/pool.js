const { Pool } = require("pg");

module.exports = new Pool({
    host: "localhost",
    user: "Enter your username here",
    database: "enter database name here",
    password: "Enter password here",
    port: 5432 //default port
});
