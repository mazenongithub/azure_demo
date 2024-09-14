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

        // req.session.myuser = {};
        // req.session.myuser._id = 'RX28A8I1MA3SRLS4'
        // req.session.myuser.userid = 'maison'
        // req.session.myuser.companyid ='661d45d677fdcfa48c8e8ed1'

        // console.log("myuser", req.session.myuser)
        const user_id = req.session.myuser.userid;
        const company_id = req.params.companyID;
        const _id = req.session.myuser.user_id




        try {
            const user = new ChatUser(
                ws.send.bind(ws), // fn to call to message this user
                company_id,
                company_id // name of room for user
            );


            // register handlers for message-received, connection-closed

            ws.on("message", function (jsonData) {
                try {


// console.log("message", jsonData)

                    // compare saved company to data

                    // save company
                    user.companyHandler(jsonData,_id, user_id, company_id)
                   

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
        const userid = req.session.myuser.user_id
        const companyid = req.params.companyid;
        civilengineer.updateUserCompanyID(userid, companyid)
            .then((succ) => {
                const myuser = succ.recordset[0]
                civilengineer.addUsertoCompany(companyid, userid)
                    .then((succ_1) => {
                        req.session.myuser.companyid = companyid;
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
        // req.session.myuser.user_id = 'RX28A8I1MA3SRLS4';
        // const _id = req.session.myuser.user_id;
        // req.session.myuser = {};
        // req.session.myuser.user_id = 'RX28A8I1MA3SRLS4'
        // req.session.myuser.userid = 'maison'
        // req.session.myuser.companyid ='661d45d677fdcfa48c8e8ed1'
      
        const companyid = req.session.myuser.companyid;
       
        const civilengineer = new CivilEngineer();
        console.log("107", companyid)
                    civilengineer.fetchCompanyByID(companyid)
                        .then((succ_1) => {
                        console.log("110", succ_1)


                            res.send({ company:succ_1.company, allprojects:succ_1.allprojects })



                        })

                        .catch((err_1) => {
                            res.send({ Error: `Could not get company ${err_1}` })
                        })

              
       

         

    })

    app.post('/company/createcompany', checkUser, (req, res) => {
        const userid = req.session.myuser.user_id
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

    app.get('/company/:companyid/removecompany', (req, res) => {
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

    app.get('/company/:company_id/projects/:project_id/deleteproject', (req, res) => {
        const civilengineer = new CivilEngineer();
        const project_id = req.params.project_id;
        civilengineer.deleteProjectByID(project_id)
            .then(succ => {

                res.send({ succ })
            })

            .catch(err => {
                console.log(`Could not delete project ${err}`)
            })
    })


    app.get('/company/:company_id/projects/findall', (req, res) => {
        const civilengineer = new CivilEngineer();
        civilengineer.findAllProjects()
            .then(succ => {
                res.send({ myprojects: succ })

            })

            .catch(err => {
                console.log(`Could not show all projects  ${err}`)
            })
    })


    app.get('/company/:company_id/projects/:project_id/createproject', (req, res) => {
        const company_id = req.params.company_id;
        const project_id = req.params.project_id;
        const myproject = {
            company_id,
            project_id,
            schedule :{
                labor:[],
                equipment:[],
                materials:[],
                bidschedule:[],
                proposals:[]

            },
            actual:{
                labor:[],
                equipment:[],
                materials:[],
                bid:[],
                invoices:[]

            }
        
        }


        const civilengineer = new CivilEngineer();
        civilengineer.createProject(myproject)
            .then(succ => {

                res.send({ myproject: succ })

            })

            .catch(err => {
                alert(`Could not create project ${err}`)
            })



    })



    app.get('/company/:company_id/projects/:project_id/showall', (req, res) => {
        const company_id = req.params.company_id;
        const civilengineer = new CivilEngineer();
        civilengineer.getProjectsByCompany(company_id)
            .then(getprojects => {

                res.end({ allprojects: getprojects.recordset })

            })

            .catch((err) => {
                res.send({ Error: ` Could not find all project ${err}` })
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

    app.get('/company/findallcompanys',  (req, res) => {

        const civilengineer = new CivilEngineer();

        const companys = civilengineer.getCompanys()
            .then((succ) => {
                res.send(succ)

            })
            .catch((err) => {
                console.log(`Could not get Company ${err}`)
            })



    })


    app.get('/company/:companyid/showallprojects', (req,res) => {
        const companyid = req.params.companyid;
       
        const civilengineer = new CivilEngineer();
        civilengineer.getProjectsByCompany(companyid)
        .then(getprojects=> {
           
           res.send({allprojects:getprojects.recordset})
         
        })

        .catch((err) => {
            res.send({Error:` Could not find all project ${err}`})
        })
     

    })



}