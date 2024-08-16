
const CivilEngineer = require('../classes/civilengineer');
const sql = require('mssql')
class MyProjects {

    constructor(user_id) {

        this.user_id = user_id;



    }

    async createProjectID() {
        const civilengineer = new CivilEngineer();

        try {

            let user_id = false;
            while (!user_id) {
                user_id = civilengineer.makeID(16)
                let request = new sql.Request()
                let mysql = `SELECT Projects._ID
FROM Projects
WHERE (((Projects._ID)='${user_id}' And (Projects._ID) Is Not Null))`
                let results = await request.query(mysql)
                if (results.rowsAffected[0] > 0) {
                    user_id = false;
                }

            }

            return user_id;

        } catch (err) {
            console.log(`Could not Create ProjectID ${err}`)
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
            

            let _iddb = myprojectdb._ID;
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

                let _id = myproject._ID;
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
WHERE (((Projects._ID)='${_iddb}" And (Projects._ID) Is Not Null))`
                       
                        let results = await request.query(mysql)
                        response.update.push(myproject)
                    }
                }




            }

            if (deleteproject) {
                const request = new sql.Request();
                const mysql = `DELETE FROM Projects WHERE _ID='${_iddb}' AND _ID IS NOT NULL`
             
                let results = await request.query(mysql)
                response.delete.push({ projectid: projectiddb })


            }
        } // end of update delete


        for (let myproject of myprojects) {

            let _id = myproject._ID;
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
                    
                    let _iddb = myprojectdb._ID;

                    if (_id === _iddb) {
                        insertproject = false;
                    }

                }



            }

            if (insertproject) {
                const project_id = await this.createProjectID();
                if (project_id) {
                    const request = new sql.Request();
                    const mysql = `INSERT INTO Projects (_ID, ProjectID, UserID, Title, ProjectNumber, Scope, Address, City, ProjectState, Zipcode) VALUES ('${project_id}','${projectid}','${user_id}','${title}','${projectnumber}','${scope}','${address}','${city}','${projectstate}','${zipcode}')`
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
        const response = await request.query(`select * from Projects WHERE UserID='${user_id}'`)
        const myprojects = response.recordset;
        const dbDisconnect = await civilengineer.dbDisconnect();

        return myprojects;




    }


}

module.exports = MyProjects;