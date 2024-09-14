
const CivilEngineer = require('../classes/civilengineer');
const sql = require('mssql')
const mongoose = require("mongoose");

const projectSchema = ({
    project_id: String,
    milestones: [{
        milestoneid: String,
        milestone: String,
        start: String,
        completion: String,
        predessors: [{
            predessor: String,
            type: String
        }]
    }]

})

const myprojectsdb = mongoose.model("myprojects", projectSchema);

class MyProjects {

    constructor(user_id) {

        this.user_id = user_id;



    }

    async removeProjectByID(project_id) {
        try {

            //  const db = await this.connectMongoDB();
            const getcompany = await myprojectsdb.findOneAndDelete({ project_id })
            // const close = await civi.closeMongoDB();
            return getcompany;


        } catch (err) {
            return ({ Error: `Could not remove Company ${err}` })
        }

    }

    async findAllProjects() {

        //  const db = await this.connectMongoDB();
        const findproject = await myprojectsdb.find({});
        // const close = await this.closeMongoDB();
        return findproject;

    }

    async findProjectByID(project_id) {

        //  const db = await this.connectMongoDB();
        const findproject = await myprojectsdb.findOne({ project_id });
        // const close = await this.closeMongoDB();
        return findproject;

    }


    async updateProjectByID(project_id, myproject) {
        try {


            const options = {
                strict: false,
                new: true,
                upsert: true,
                useFindAndModify: false
            }
            const filter = { project_id }


            const updateproject = await myprojectsdb.findOneAndUpdate(filter, myproject, options)

            return updateproject;

        } catch (err) {
            console.log(`Could not Update Project By ID ${err}`)
        }

    }


    async createTeamID() {
        const civilengineer = new CivilEngineer();
    
        try {
    
            let _id = false;
            while (!_id) {
                _id = civilengineer.makeID(16)
                let request = new sql.Request()
                let mysql = `SELECT MyTeam._ID
    FROM MyTeam
    WHERE (((MyTeam._ID)='${_id}' And (MyTeam._ID) Is Not Null))`
                let results = await request.query(mysql)
                if (results.rowsAffected[0] > 0) {
                    _id = false;
                }
    
            }
    
            return _id;
    
        } catch (err) {
            console.log(`Could not Create TeamID ${err}`)
        }
    
    }


    async createProjectID() {
        const civilengineer = new CivilEngineer();

        try {

            let project_id = false;
            while (!project_id) {
                project_id = civilengineer.makeID(16)
                let request = new sql.Request()
                let mysql = `SELECT Projects.Project_ID
FROM Projects
WHERE (((Projects.Project_ID)='${project_id}' And (Projects.Project_ID) Is Not Null))`
                let results = await request.query(mysql)
                if (results.rowsAffected[0] > 0) {
                    project_id = false;
                }

            }

            return project_id;

        } catch (err) {
            console.log(`Could not Create ProjectID ${err}`)
        }

    }

    async handleProjectTeam(project_id, myteams) {
        const civilengineer = new CivilEngineer();
     
     
        let response = {};
        response.insert = [];
        response.update = [];
        response.delete = [];
        let dbConnect = await civilengineer.dbConnect();
     
        let myteamsdb = await this.loadProjectTeamDB(project_id)
     
       
        if(!myteamsdb) {
            myteamsdb = [];
        }

        

        for (let myteamdb of myteamsdb) {
            let _iddb = myteamdb._ID;
            let user_iddb = myteamdb.User_ID;
            let roledb = myteamdb.Role;
            let deleteteam = true;

            for (let myteam of myteams) {


                let user_id = myteam.User_ID;
                let role = myteam.Role;


                if (user_id === user_iddb) {
                    deleteteam = false;

                    if (role != roledb) {

                        try {
                            let request = new sql.Request()
                            let mysql = `UPDATE MyTeam SET MyTeam.Role = '${role}'
WHERE MyTeam._ID='${_iddb}' AND MyTeam._ID IS NOT NULL`
                            let results = await request.query(mysql)
                            response.update.push({user_id:user_iddb, role})

                        } catch (err) {
                            console.log(`Error: Could not Update Team ${err}`)
                        }
                    }


                }


            }

            if (deleteteam) {

                try {

                    let request = new sql.Request()
                    let mysql = `DELETE FROM MyTeam WHERE MyTeam._ID='${_iddb}' AND MyTeam._ID IS NOT NULL`
                    let results = await request.query(mysql)
                   
                    response.delete.push({user_id:user_iddb})
                

                } catch (err) {
                    console.log(`Error: could not delete MyTeam ${err}`)
                }



            }


        } // end of update delete


        for (let myteam of myteams) {

    
            let user_id = myteam.User_ID;
            let role = myteam.Role;
            let insertteam = true;

            for (let myteamdb of myteamsdb) {

                let user_iddb = myteamdb.User_ID;

                if(user_iddb === user_id) {
                    insertteam = false;
                }


            }
             
            if(insertteam) {

                try {

                    let _id = await this.createTeamID();

                    let request = new sql.Request()
                    let mysql = `INSERT INTO MyTeam(_ID, User_ID, Project_ID, Role) VALUES ('${_id}','${user_id}','${project_id}','${role}')`
                
                    let results = await request.query(mysql)
                    response.insert.push({user_id:user_id, role})

                } catch(err) {
                    console.log(`Error: Could not Insert Team ${err}`)
                }


            }

            

        }
       
        let getteam = await this.loadProjectTeamDB(project_id) 
        let disconnected = await civilengineer.dbDisconnect();

        return ({response, myteam:getteam})


    }

    async loadProjectTeamDB(project_id) {

        try {

            let request = new sql.Request()
            let mysql = `SELECT MyTeam._ID, MyTeam.Project_ID, MyTeam.User_ID, MyTeam.Role
FROM MyTeam
WHERE (((MyTeam.Project_ID)='${project_id}' And (MyTeam.Project_ID) Is Not Null))`
console.log("286",mysql)
            let results = await request.query(mysql)
            console.log("292", results)
            return results.recordset;

        } catch (err) {
            console.log(`Error could not load project team ${err}`)
        }


    }


    async handleMyProjects(myprojects) {
        const civilengineer = new CivilEngineer();

        const myprojectsdb = await this.loadMyProjects();

        const dbConnect = await civilengineer.dbConnect();
        const user_id = this.user_id;
        let response = {};
        response.update = [];
        response.insert = [];
        response.delete = [];
        for (let myprojectdb of myprojectsdb) {


            let _iddb = myprojectdb.Project_ID;
            let projectiddb = myprojectdb.ProjectID;
            let titledb = myprojectdb.Title;
            let scopedb = myprojectdb.Scope;
            let addressdb = myprojectdb.Address;
            let citydb = myprojectdb.City;
            let projectstatedb = myprojectdb.ProjectState;
            let zipcodedb = myprojectdb.Zipcode;
            let projectnumberdb = myprojectdb.ProjectNumber;
            let deleteproject = true;

            for (let myproject of myprojects) {

                let _id = myproject.Project_ID;
                //  let projectid = myproject.ProjectID;
                let title = myproject.Title;
                let scope = myproject.Scope;
                let address = myproject.Address;
                let city = myproject.City;
                let projectstate = myproject.ProjectState;
                let zipcode = myproject.Zipcode;
                let projectnumber = myproject.ProjectNumber;

                if (_id === _iddb) {
                    deleteproject = false;

                    if (title != titledb || scope != scopedb || address != addressdb || city != citydb || projectstate != projectstatedb || zipcode != zipcodedb || projectnumber != projectnumber) {
                        let request = new sql.Request()
                        let mysql = `UPDATE Projects SET Projects.Title = '${title}' Projects.ProjectNumber = '${projectnumber}' Projects.Address = '${address}' Projects.City = '${city}' Projects.ProjectState = '${projectstate}' Projects.Zipcode = '${zipcode}"
WHERE (((Projects.Project_ID)='${_iddb}" And (Projects.Project_ID) Is Not Null))`

                        let results = await request.query(mysql)
                        response.update.push(myproject)
                    }
                }




            }

            if (deleteproject) {
                const request = new sql.Request();
                const mysql = `DELETE FROM Projects WHERE Project_ID='${_iddb}' AND Project_ID IS NOT NULL`

                let results = await request.query(mysql)
                response.delete.push({ projectid: projectiddb })


            }
        } // end of update delete


        for (let myproject of myprojects) {

            let _id = myproject.Project_ID;
            let projectid = myproject.ProjectID;
            let title = myproject.Title;
            let scope = myproject.Scope;
            let address = myproject.Address;
            let city = myproject.City;
            let projectstate = myproject.ProjectState;
            let zipcode = myproject.Zipcode;
            let projectnumber = myproject.ProjectNumber;

            let insertproject = true;

            for (let myprojectdb of myprojectsdb) {

                for (let myprojectdb of myprojectsdb) {

                    let _iddb = myprojectdb.Project_ID;

                    if (_id === _iddb) {
                        insertproject = false;
                    }

                }



            }

            if (insertproject) {
                const project_id = await this.createProjectID();
                if (project_id) {
                    const request = new sql.Request();
                    const mysql = `INSERT INTO Projects (Project_ID, ProjectID, User_ID, Title, ProjectNumber, Scope, Address, City, ProjectState, Zipcode) VALUES ('${project_id}','${projectid}','${user_id}','${title}','${projectnumber}','${scope}','${address}','${city}','${projectstate}','${zipcode}')`
                    const results = await request.query(mysql)
                    response.insert.push(myproject)
                }
            }

        } // end of insert





        const dbDisconnect = await civilengineer.dbDisconnect();

        return ({ myprojects, myprojectsdb, response })

    }


    async loadMyProjects() {
        const civilengineer = new CivilEngineer();
        const user_id = this.user_id;
        const dbConnect = await civilengineer.dbConnect();
        const request = new sql.Request();
        const response = await request.query(`select * from Projects WHERE User_ID='${user_id}'`)
        const myprojects = response.recordset;
        const dbDisconnect = await civilengineer.dbDisconnect();

        return myprojects;


    }


    async loadProjectByID(project_id) {

        const dbConnect = await civilengineer.dbConnect();
        const request = new sql.Request();
        const response = await request.query(`SELECT Projects.Project_ID, Projects.User_ID, Projects.ProjectID, Projects.ProjectID, Projects.Title, Projects.ProjectNumber, Projects.Address, Projects.City, Projects.ProjectState, Projects.Zipcode
FROM Projects
WHERE (((Projects.Project_ID)='${project_id}' And (Projects.Project_ID) Is Not Null))`)
        const myproject = response.recordset[0];

        const response_1 = await req
        const dbDisconnect = await civilengineer.dbDisconnect();

    }


}

module.exports = MyProjects;