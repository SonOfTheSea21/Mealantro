const {Client} = require('pg')


const client = new Client({
    host: "localhost",
    user: "postgres",
    port: 5432,
    password: "Raiyan2411",
    database: "Mealantro2"

})

client.connect();

module.exports = client;