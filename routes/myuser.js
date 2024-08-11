const sql = require('mssql')
const bcrypt = require('bcryptjs');
const CivilEngineer = require('../classes/civilengineer');
const checkUser = require('../middleware/checkuser');
const { response } = require('express');
module.exports = app => {

   app.get('/myuser/showallusers',  (req, res) => {
      const civilengineer = new CivilEngineer();
      civilengineer.fetchUsers()
         .then((succ) => {

            res.send(succ)

         })
         .catch((err) => {
            res.status(404).send({ Error: `Could not Fetch all users ` })
         })
   })

   // login Register

   app.get('/myuser/logout', (req, res) => {
      req.session.destroy();
      if (!req.session) {
         res.send({ Success: `User has been logged out ` })
      }
   })

   app.get('/myuser/checkuser', checkUser, (req, res) => {
      // req.session.myuser = {};
      // req.session.myuser._id = 'RX28A8I1MA3SRLS4'
      // req.session.myuser.userid = 'maison'
      // req.session.myuser.companyid ='661d45d677fdcfa48c8e8ed1'
      const _id = req.session.myuser._id;
      const civilengineer = new CivilEngineer();
      const myuser = civilengineer.getUserByID(_id)
         .then((succ) => {
            res.json({ myuser: succ.recordset[0] })
         })

         .catch((err) => {
            let message = `Could not fetch user by ID ${err}`
            res.json({ Error: message })
         })

   })
   app.post('/myuser/loginuser', (req, res) => {

      const { firstname, lastname, emailaddress, phonenumber, profileurl, apple, google, userid } = req.body
      const myuser = { firstname, lastname, emailaddress, phonenumber, profileurl, apple, google, userid }

      const civilengineer = new CivilEngineer();
      civilengineer.loginUser(myuser)
         .then((succ) => {

            if (succ) {

               req.session.myuser = { _id: succ._ID, userid:succ.UserID, companyid:succ.CompanyID }
               res.send({ myuser: succ })

            } else if (myuser.userid && (myuser.apple || myuser.google)) {

                  civilengineer.registerUser(myuser)
                     .then((succ_1) => {

                        if(succ_1.rowsAffected[0]>0) {

                        const getuser = succ_1.recordset[0]

                        req.session.myuser = { _id: getuser._ID, userid:getuser.UserID }
                        res.send({ myuser: getuser })
                        

                     }


                     })

                     .catch((err) => {

                        res.send({ Error: `Could not register User ${err}` })

                     })

               } 
            
         })
         .catch((err) => {

            res.send({ Error: `Could not login user ${err}` })
         })


      //  .then((succ)=> {
      //      console.log(succ)
      //    //   res.send(succ)

      //  })
      //  .err((err)=> {

      //      res.status(404).send({Error:`User could not be logged ${err}`})

      //  })


      // check to see if myuser exists, if so login user, if not check userid

      // if theres a userid and no user register user

      // if not throw an error


   })


   app.post('/myuser/saveuser', checkUser, (req, res) => {

      const myuser = req.body.myuser;
      const civilengineer = new CivilEngineer();
      civilengineer.updateUser(myuser)
      .then((succ)=> {

         res.send({myuser:succ.recordset[0]})

      })

      .catch((err)=> {

         res.send({Error: `Could not save user ${err}`})

      })

      // save update myuser



   })

   app.get('/myuser/deleteuser/:userid', checkUser, (req, res) => {
      let _id = req.params.userid;
      const civilengineer = new CivilEngineer();
       civilengineer.deleteUser(_id)
         .then((succ) => {
            res.send(succ)

         })
         .catch((err) => {

            res.send({ Error: `Could not Delete User ${err} ` })

         })



   })


}