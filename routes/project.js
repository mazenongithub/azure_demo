
const CivilEngineer = require('../classes/civilengineer');
const ChatUser = require("../classes/ChatUser");
module.exports = app => {

    app.ws("/projects/:projectid/websocketapi", function (ws, req, next) {

        // req.session.myuser = {};
        // req.session.myuser._id = 'RX28A8I1MA3SRLS4'
        // req.session.myuser.userid = 'maison'
        // req.session.myuser.companyid ='661d45d677fdcfa48c8e8ed1'

        // console.log("myuser", req.session.myuser)
        const user_id = req.session.myuser.userid;
        const projectid = req.params.projectid;
        const _id = req.session.myuser._id
        const company_id = req.session.myuser.companyid;
       
   
 
        try {
            const user = new ChatUser(
                ws.send.bind(ws), // fn to call to message this user
                req.params.projectid,
                company_id // name of room for user
            );


            // register handlers for message-received, connection-closed

            ws.on("message", function (jsonData) {
                try {

                    // console.log("message", jsonData)

                    // compare saved company to data

                    // save company
                   
                    user.projectHandler(jsonData, _id, user_id, company_id, projectid)


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

    

    app.post('/projects/:project_id/saveproject', (req, res) => {
    

        const myproject = req.body.myproject;
        const civilengineer = new CivilEngineer();
        const project_id = req.params.project_id;
        const company_id = myproject.company_id;

     

        civilengineer.findProjectByID(project_id)
        .then(succ => {
       

            if(succ) {

                if(succ.construction) {
                
                    let existing= false;
                    let key = false;
                    succ.construction.map((project,i)=> {
                     if(project.company_id === company_id) {
                        existing = true;
                        key = i;
                       
                     }   
                    })

                    if(existing) {
                          succ.construction[key].schedule = myproject.schedule;
                          succ.construction[key].actual = myproject.actual;
                          res.send({myproject:succ})
                    } else {
                       
                        succ.construction.push({company_id, schedule:myproject.schedule, actual:myproject.actual})
                       
                     
                    }

                    
                    civilengineer.updateProjectByID(succ)
                    .then(succ_1 => {

                        res.send({myproject:succ_1})

                    })

                    .catch(err_1=> {
                        console.log(`Error: Could not update company ${err_1}`)
                    })
                
                
                
                
                
                
                
                }
               
            
            
            }

        


        })


        .catch(err => {
            console.log(`Error: Could not Save Project ${project_id} ${err}`)
        })




    })



    app.get('/projects/:projectid/deleteproject', (req, res) => {
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

    app.get('/projects/:projectid/findproject', (req, res) => {
        const civilengineer = new CivilEngineer();
        const projectid = req.params.projectid;
        const company_id = req.session.myuser.companyid;
        civilengineer.getProjectByProjectID(projectid)
            .then(getproject => {

                const project_id = getproject._ID;

                civilengineer.findProjectByID(project_id)
                    .then(succ => {



                        const myproject = civilengineer.getCompanyProjectfromProject(succ, company_id)

                        res.send({ myproject })
                    })

                    .catch(err => {
                        console.log(`Could Not fetch Project ${err}`)

                    })

            })

            .catch(err => {
                console.log(`Could Not fetch Project ${err}`)
            })



    })

 


  




}