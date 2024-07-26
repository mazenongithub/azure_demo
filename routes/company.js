const express = require("express");
const CivilEngineer = require('../classes/civilengineer');
const ChatUser = require("../classes/ChatUser");
const CompareCompany = require("../classes/comparecompany")
const app = express();
const wsExpress = require("express-ws")(app);
const checkUser = require('../middleware/checkuser');
const checkCompany = require('../middleware/checkcompanyjs')

module.exports = app => {

    app.ws("/company/:companyID/websocketapi", checkCompany, function (ws, req, next) {
        console.log("websocket running")


        // console.log("myuser", req.session.myuser)
        const _id = req.session.myuser._id;


        try {
            const user = new ChatUser(
                ws.send.bind(ws), // fn to call to message this user
                req.params.companyID // name of room for user
            );


            // register handlers for message-received, connection-closed

            ws.on("message", function (data) {
                try {

                    //console.log("message", data)

                    // compare saved company to data

                    // save company
                    user.handleMessage(data, _id);

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

    app.get('/company/:companyid/updateusercompanyid', checkUser, (req, res) => {
        const civilengineer = new CivilEngineer();
        const userid = req.session.myuser._id
        const companyid = req.params.companyid;
        civilengineer.updateUserCompanyID(userid, companyid)
            .then((succ) => {
                const myuser = succ.recordset[0]
                civilengineer.addUsertoCompany(companyid, userid)
                    .then((succ_1) => {
                        res.send({ myuser: succ.recordset[0], company: succ_1 })

                    })
                    .catch((err_1) => {
                        res.send({ Error: `Could not fetch company by id ${err_1}` })

                    })

            })
            .catch((err) => {
                res.send({ Error: `Could not update user companyid ${err}` })
            })
    })

    app.get('/company/findmycompany', checkUser, (req, res) => {
        const _id = req.session.myuser._id
        const civilengineer = new CivilEngineer();
        civilengineer.getUserByID(_id)
            .then((succ) => {
                const myuser = succ.recordset[0];
                console.log(myuser)
                if (myuser.CompanyID) {
                    const companyid = myuser.CompanyID

                    civilengineer.fetchCompanyByID(companyid)
                        .then((succ_1) => {



                            res.send({ myuser, company: succ_1 })



                        })

                        .catch((err_1) => {
                            res.send({ Error: `Could not get company ${err_1}` })
                        })

                } else {
                    res.send({ Error: `No user company found` })
                }
            })

            .catch((err) => {
                let message = `Could not fetch user by ID ${err}`
                res.json({ Error: message })
            })

    })

    app.post('/company/createcompany', checkUser, (req, res) => {
        const userid = req.session.myuser._id
        const companyid = req.body.companyid;

        const newcompany = (user_id, companyid) => {

            return ({
                companyid,
                company: '',
                address: '',
                city: '',
                contactstate: '',
                zipcode: '',
                url: '',
                employees: [{
                    user_id,
                    title: 'Manager',
                    workinghours: 0
                }]
            })
        }

        const civilengineer = new CivilEngineer();
        const getcompany = newcompany(userid, companyid)
        civilengineer.createCompany(getcompany)
            .then((succ) => {

                const companyid = succ._id;
                civilengineer.updateUserCompanyID(userid, companyid)
                    .then((succ_1) => {
                        res.send({ myuser: succ_1.recordset[0], company: succ })
                    })

                    .catch((err_1) => {

                        res.send({ Error: `Could not Update User CompanyID ${err_1}` })

                    })

            })
            .catch((err) => {
                res.send({ Error: `Could not create company ${err}` })
            })

    })

    app.post('/company/:companyid/updatecompany', checkUser, (req, res) => {
        const civilengineer = new CivilEngineer();
        const companyid = req.params.companyid;

        const getcompany = req.body.company
        civilengineer.updateCompanyByID(companyid, getcompany)
            .then(succ => {
                res.send({ company: succ })
            })
            .catch((err) => {
                res.send({ Error: `Could not Fetch Company ${err}` })

            })


    })

    app.get('/company/:companyid/removecompany', checkUser, (req, res) => {
        const civilengineer = new CivilEngineer();
        const companyid = req.params.companyid;
        civilengineer.removeCompanyByID(companyid)
            .then(succ => {
                res.send(succ)
            })
            .catch((err) => {
                res.send({ Error: `Could not Fetch Company ${err}` })

            })


    })


    app.get('/company/:companyid/findcompany', checkUser, (req, res) => {
        const civilengineer = new CivilEngineer();
        const companyid = req.params.companyid;
        civilengineer.fetchCompanyByID(companyid)
            .then(succ => {
                res.send(succ)
            })
            .catch((err) => {
                res.send({ Error: `Could not Fetch Company ${err}` })

            })


    })

    app.get('/company/findallcompanys', checkUser, (req, res) => {

        const civilengineer = new CivilEngineer();

        const companys = civilengineer.getCompanys()
            .then((succ) => {
                res.send(succ)

            })
            .catch((err) => {
                console.log(`Could not get Company ${err}`)
            })



    })


}