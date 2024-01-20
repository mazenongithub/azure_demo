const express = require("express");
const sql = require('mssql')
const app = express();
const PORT = 8081;
const keys = require('./keys');

const bodyParser = require("body-parser");
app.use(bodyParser.json());

const config = {
    user: keys.USER,
    password: keys.PASSWORD,
    server: keys.SERVER,    // don't add tcp & port number
    database: keys.DATABASE,
    options: {
        encrypt: true
    }
};

sql.connect(config, (err) => {
    if (err) {
        console.log(err);

    } else {

    }
})


app.get('/', (req, res) => {
    const request = new sql.Request();
    request.query('select * from MyUsers', function (err, results) {
        if (err) {
            console.log(err)



        } else {

            // send records as a response

            res.json({ response: results.recordset });



        }


    });


})

app.get('/insert', (req, res) => {
    const request = new sql.Request();
    request.query("INSERT INTO MyUsers (_ID, FirstName, LastName) VALUES ('DEF','John','Sanders')", function (err, results) {
        if (err) {
            console.log(err)



        } else {

            // send records as a response

            res.json({ response: results });



        }


    });


})


app.get('/delete', (req, res) => {
    const request = new sql.Request();
    request.query("DELETE FROM MyUsers WHERE _ID='DEF' AND _ID IS NOT NULL", function (err, results) {
        if (err) {
            console.log(err)



        } else {

            // send records as a response

            res.json({ response: results });




        }


    });


})


app.get('/update', (req, res) => {
    const request = new sql.Request();
    request.query("UPDATE MyUsers SET FirstName='Mazenn' WHERE _ID='XYZ'", function (err, results) {
        if (err) {
            console.log(err)

        } else {

            // send records as a response

            res.json({ response: results });

        }

    });


})



app.listen(process.env.PORT || PORT, () => {
    console.log(`Example app listening on port ${PORT}`)
})