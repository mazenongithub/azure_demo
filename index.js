const express = require("express");
const sql = require('mssql')
const PORT = 8081;
const keys = require('./keys');
const mongoose = require("mongoose");
const session = require('express-session');
const CivilEngineer = require('./classes/civilengineer')

//const checkUser = require('./middleware/checkuser');
const app = express();
app.use(session({
    secret: keys.SECRETKEY,
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 8640000, sameSite:true, httpOnly:false },  
  }))

  const cors = {
    origin: [
        "http://localhost:3000",
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


const ChatUser = require("./classes/ChatUser");
const wsExpress = require("express-ws")(app);

app.ws("/chat/:roomName", function (ws, req, next) {
    console.log("websocket running")
    // setTimeout(()=> {
    //     ws.send(Math.random())
    // }, 2000)

    // setTimeout(()=> {
    //     ws.close()
    // }, 4000)

    // ws.on("message", function (data) {
    //     try {
          
    //       console.log("message received")
    //     //   let msg = JSON.parse(data);
    //      console.log(data)
   
    //       ws.send(data)
    //     } catch (err) {
    //       console.error(err);
    //     }
    //   });
      

    try {
        const user = new ChatUser(
          ws.send.bind(ws), // fn to call to message this user
          req.params.roomName // name of room for user
        );

        const userid = Math.random();

        user.handleJoin(userid)
    
        // register handlers for message-received, connection-closed
    
        ws.on("message", function (data) {
            try {
                
                user.handleMessage(data);
              } catch (err) {
                console.error(err);
              }
            });
            
        
            ws.on("close", function () {
              try {
                user.handleClose();
              } catch (err) {
                console.error(err);
              }
            });
          } catch (err) {
            console.error(err);
          }
        


   

})

;



app.get('/azure', (req, res) => {
  const civilengineer = new CivilEngineer();
  const connect =  civilengineer.dbConnect()
  .then(()=> {
  
  const request = new sql.Request();
  request.query('select * from MyUsers')
  .then((results)=> {
    res.json({ response: results.recordset })
  })





})

})


require('./routes/test')(app);
require('./routes/myuser')(app)
require('./routes/company')(app)




app.listen(process.env.PORT || PORT, () => {
    console.log(`Example app listening on port ${PORT}`)
})