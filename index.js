const express = require("express");
const sql = require('mssql')

const keys = require('./keys');
const mongoose = require("mongoose");
const session = require('express-session');
const CivilEngineer = require('./classes/civilengineer')
const app = express();
const civilengineer = new CivilEngineer();
civilengineer.connectMongoDB();


app.use(session({
    secret: keys.SECRETKEY,
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 8640000, sameSite:true, httpOnly:false },  
  }))

  const cors = {
    origin: [
        "http://localhost:3000",
        "http://localhost:3001",
        "http://construction.civilengineer.io"

    ]
}

  app.all('*', function(req, res, next) {
    let origin = req.headers.origin;
    if (cors.origin.indexOf(origin) >= 0) {

        res.header("Access-Control-Allow-Origin", origin);

    }
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Credentials", "true")
    next();
});



const bodyParser = require("body-parser");
app.use(bodyParser.json());

const wsExpress = require("express-ws")(app);

app.get('/', (req,res)=> {
  res.send({message:'You are online'})
})




require('./routes/myuser')(app)
require('./routes/company')(app)
require('./routes/project')(app)
require('./routes/pm')(app)


app.listen(process.env.PORT || 8081, () => {
   if(process.env.PORT) {
    console.log(` App is listening to ${process.env.PORT}`)
   } else {
    console.log(` App is listening to 8081`)
   }
})