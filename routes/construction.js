
const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');
const CivilEngineer = require('../classes/civilengineer');
const keys = require('../keys');
module.exports = app => {




app.get("/construction/showcompanys", function (req, res) {
   

       })






app.get('/construction/createcompany', (req, res) => {
    const newCompany = () => {
        return ({
            companyid: 'civilengineer.io',
            company: 'civilengineer',
            address: '5611 Loyalty Way',
            city: 'Elk Grove',
            contactstate: 'CA',
            zipcode: '95757',
            url: 'civilengineer',
            accounts: [{
                accountid: '_accountid',
                user_id: 'XYZ',
                accountname: 'Salary'
            }],
            employees: [{
                user_id: 'XYZ',
                title: 'Project Manager',
                workinghours: '2080',
                benefits: [{
                    benefitid: '_benefitid',
                    benefit: 'Salary',
                    amount: 100000000,
                }]
            }],
            materials: [{
                materialid: '_materialid',
                accountid: '_accountid',
                material: 'Wood',
                Unit: '/ft',
                UnitCost: 5

            }],
            equipment: [
                {
                    equipmentid: '_equipmentid',
                    equipment: 'Car Charger',
                    accountid: '_account_id',
                    ownership: {
                        workinghours: 3000,
                        purchasedate: new Date(),
                        interest: 5.4,
                        saledate: new Date(),
                        salvage: 1000,
                        purchase: 7400,
                        cost: [{
                            costid: '_costid',
                            cost: 50,
                            detail: 'oil change',
                            timein: new Date()
                        }]
                    }
                }
            ]



        })
    }

    const newcompany = newCompany();
    companys.create(newcompany)
        .then(succ => {
            if (succ) {
                res.send(succ)
            }

        })
        .catch(err => {
            res.json({ Message: `There was an error creating Company ${err}` })
        })




})


app.get('/construction/findallusers', (req, res) => {

    const myuser = civilengineer.getUserByID(_id)
    .then((succ) => {
       const myuser = succ.recordset[0];
       if(myuser.companyid) {
      
       }
    })

    .catch((err) => {
       let message = `Could not fetch user by ID ${err}`
       res.json({ Error: message })
    })


})

app.get('/construction/createuser', (req, res) => {
    const civilengineer = new CivilEngineer();

   // const myuser = req.body.myuser;

   const myuser = {
    _id : 'abc123',
    apple:'000353.66d2a1610de24944b898df602ab5e7a7.0305',
    firstname:'mazen',
    lastname :'khenaisser',
    emailaddress:'mazen@civilengineer.io',
    phonenumber:'916-823-1652',
    google:'',
    profileurl:'',
    userid:'mazen'
   }

   myuser.apple = civilengineer.hashPassword(myuser.apple)

   // Try to Login User

   civilengineer.loginUser(myuser)
   .then((succ) => {
    res.json(succ)

   })
   .catch((err)=> {

    res.json(err)
   })


   // if successful return user

   // if fail and userid check userid if userid is valid register user

   // if login fail and userid fail send err msg

  // res.json(myuser)



   //  const request = new sql.Request();
    // request.query("INSERT INTO MyUsers (_ID, FirstName, LastName) VALUES ('DEF','John','Sanders')", function (err, results) {
    //     if (err) {
    //         console.log(err)



    //     } else {

    //         // send records as a response

    //         res.json({ response: results });



    //     }


    // });


})


app.get('/construction/deleteuser', (req, res) => {
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


app.get('/construction/updateuser', (req, res) => {

    const civilengineer = new CivilEngineer();

   // const myuser = req.body.myuser;

   const myuser = {
    _id : 'XYZ',
    apple:'000353.66d2a1610de24944b898df602ab5e7a7.0305',
    firstname:'mazen',
    lastname :'khenaisser',
    emailaddress:'mazen@civilengineer.io',
    phonenumber:'916-823-1652',
    google:'',
    profileurl:'',
    userid:'mazen'
   }

   myuser.apple = civilengineer.hashPassword(myuser.apple)

   // Try to Login User

   civilengineer.updateUser(myuser)
   .then((succ) => {

    res.json(succ)

   })
   .catch((err)=> {

    res.json(err)
   })

})

}