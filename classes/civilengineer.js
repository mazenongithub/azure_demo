const sql = require('mssql')
const bcrypt = require('bcryptjs')
const keys = require('../keys');
const mongoose = require("mongoose");

const companySchema = ({
    companyid: String,
    company: String,
    address: String,
    city: String,
    contactstate: String,
    zipcode: String,
    url: String,
    accounts: [{
        accountid: String,
        user_id: String,
        accountname: String,
        stripe: String
    }],
    employees: [{
        user_id: String,
        title: String,
        workinghours: Number,
        benefits: [{
            benefitid: String,
            benefit: String,
            amount: Number,
            frequency: String,
            accountid: String
        }]
    }],
    materials: [{
        materialid: String,
        accountid: String,
        material: String,
        unit: String,
        unitcost: Number

    }],
    equipment: [
        {
            equipmentid: String,
            equipment: String,
            accountid: String,
            rented: {
                hourly: String,
                daily: String,
                weekly: String,
                monthly: String
            },
            ownership: {
                workinghours: Number,
                purchasedate: String,
                loaninterest: Number,
                resalevalue: Number,
                saledate: String,
                salvage: Number,
                purchase: Number,
                cost: [{
                    costid: String,
                    cost: Number,
                    detail: String,
                    timein: String,
                    reoccurring: {
                        frequency: String
                    }
                }]
            }
        }
    ]


})



const companys = mongoose.model("companys", companySchema);

const constructionSchema  = ({ 
    company_id: String,
    project_id: String,
    schedule: {
        proposals: [{
            proposalid: String,
            dateproposal: String,
            updated: String,
            approved: String,
            bidschedule: [{
                csiid: String,
                unit: String,
                quantity: String

            }]
        }],
        labor: [{
            laborid: String,
            user_id: String,
            milestoneid: String,
            csiid: String,
            laborrate: Number,
            timein: String,
            timeout: String,
            profit: Number,
            proposalid: String
        }],
        materials: [{
            materialid: String,
            mymaterialid: String,
            csiid: String,
            milestoneid: String,
            timein: String,
            quantity: String,
            unit: String,
            unitcost: Number,
            profit: Number,
            proposalid: String


        }],

        equipment: [{
            equipmentid: String,
            myequipmentid: String,
            csiid: String,
            milestoneid: String,
            timein: String,
            timeout: String,
            equipmentrate: Number,
            profit: Number,
            proposalid: String
        }],
        bidschedule: [{
            csiid: String,
            quantity: String,
            unit: String
        }]
    },
    actual: {
        invoices: [{
            invoiceid: String,
            dateinvoice: String,
            updated: String,
            approved: String,
            bid: [{
                csiid: String,
                unit: String,
                quantity: String

            }]
        }],
        labor: [{
            laborid: String,
            user_id: String,
            milestoneid: String,
            csiid: String,
            laborrate: Number,
            timein: String,
            timeout: String,
            profit: Number,
            invoiceid: String
        }],
        materials: [{
            materialid: String,
            mymaterialid: String,
            csiid: String,
            milestoneid: String,
            timein: String,
            quantity: String,
            unit: String,
            unitcost: Number,
            profit: Number,
            invoiceid: String
        }],
        equipment: [{
            equipmentid: String,
            myequipmentid: String,
            csiid: String,
            milestoneid: String,
            timein: String,
            timeout: String,
            equipmentrate: Number,
            profit: Number,
            invoiceid: String
        }],
        bid: [{
            csiid: String,
            quantity: String,
            unit: String
        }]

    } // end of actual

})


const designSchema = ({
    design: [{
        company_id: String,
        costestimate: {
            labor: [{

                laborid: String,
                userid: String,
                milestoneid: String,
                csiid: String,
                laborrate: Number,
                timein: String,
                timeout: String,
                profit: Number,
                invoiceid: String
            }],
            materials: [{
                materialid: String,
                mymaterialid: String,
                csiid: String,
                milestoneid: String,
                timein: String,
                quantity: String,
                unit: String,
                unitcost: Number,
                profit: Number,
                invoiceid: String
            }],
            equipment: [{
                equipmentid: String,
                myequipmentid: String,
                csiid: String,
                milestoneid: String,
                timein: String,
                timeout: String,
                equipmentrate: Number,
                profit: Number,
                invoiceid: String
            }],
            bid: [{
                csiid: String,
                quantity: String,
                unit: String
            }],
            specifications: [{
                csiid: String,
                paragraph: {
                    listType: String,
                    list: [{
                        contentid: String, // part 1 General
                        content: String,
                        sublist: {
                            listType: String,
                            list: [{
                                contentid: String, /// 1.01 Measure and Payment
                                content: String,
                                sublist: {
                                    listType: String,
                                    list: [{
                                        contentid: String, // A. Lump Sum Price Offered in Schedule
                                        content: String,
                                        sublist: {
                                            listType: String,
                                            list: [{
                                                contentid: String, // 1. As determined in the field
                                                content: String,
                                                sublist: {
                                                    listType: String,
                                                    list: [{
                                                        contentid: String, // a. otherwise noted
                                                        content: String,
                                                        sublist: {
                                                            listType: String,
                                                            list: [{
                                                                contentid: String, // i
                                                                content: String,

                                                            }]
                                                        }

                                                    }]
                                                }

                                            }]
                                        }

                                    }]
                                }

                            }]
                        }
                    }]

                }


            }]

        }
    }] // end of design
})

const projectSchema = ({
    user_id: String,
    project_id: String,
    charges: [{
        chargeid: String,
        created: String,
        amount: String,

    }],
    milestones: [{
        milestoneid: String,
        milestone: String,
        start: String,
        completion: String
    }]



}) // end of project schema

const projectsdb = mongoose.model("projects", projectSchema);
const constructiondb = mongoose.model("construction", constructionSchema)

class CivilEngineer {



    async fetchUsers() {
        try {

            const dbconnect = await this.dbConnect();
            const request = new sql.Request();
            const response = await request.query('select * from MyUsers')
            const dbDisconnect = await this.dbDisconnect();
            return response.recordset;

        } catch (err) {
            console.log(err)
        }


    }

    async fetchCompanys() {

        try {

            const getcompanys = await companys.find({})
            return getcompanys;

        } catch (err) {
            console.log(`Error could not get companys ${err}`)

        }



    }



    async findAllProjects() {
        // const db = await this.connectMongoDB();
        const allprojects = await constructiondb.find({});
        const close = await this.closeMongoDB();
        return allprojects;

    }

    async deleteProjectByID(project_id) {

        // const db = await this.connectMongoDB();
        const deleteproject = await constructiondb.deleteOne({ project_id });
        const close = await this.closeMongoDB();
        return deleteproject;

    }

    getCompanyProjectfromProject(myproject, company_id) {


        let getmyproject = false;
        let user_id = "";
        let project_id = "";

        if (myproject) {


            user_id = myproject.user_id;
            project_id = myproject.project_id;

            if (myproject.construction) {
                for (let project of myproject.construction) {

                    if (project.company_id === company_id) {
                        getmyproject = project
                    }

                }


                if (!getmyproject) {
                    getmyproject = {
                        user_id,
                        project_id,
                        company_id,
                        schedule: {
                            proposals: [{

                                bidschedule: [{

                                }]
                            }],
                            labor: [],
                            materials: [],

                            equipment: [],
                            bidschedule: []

                        },
                        actual: {
                            invoices: [{

                                bid: []
                            }],
                            labor: [],
                            materials: [],
                            equipment: [],
                            bid: []

                        }
                    }
                }

            }

        }

        return getmyproject;

    }

    async findAllProjectsByID(project_id) {
        try {

            let construction = await constructiondb.find({project_id})
            return construction

        } catch(err) {
            console.log(`Error: Could not find all projects by ID ${err}`)
        }
    }

    async updateProjectByID(company_id, project_id, myproject) {
        try {


            const options = {
                strict: false,
                new: true,
                upsert: true,
                useFindAndModify: false
            }
            const filter = { project_id, company_id }
         

            const updateproject = await constructiondb.findOneAndUpdate(filter, myproject, options)
        
            return updateproject;

        } catch (err) {
            console.log(`Could not Update Project By ID ${err}`)
        }

    }



    async findMyProjectByID( company_id, project_id) {

        //  const db = await this.connectMongoDB();
        const findproject = await constructiondb.findOne({ company_id, project_id });
        // const close = await this.closeMongoDB();
        return findproject;

    }

    async createProject(myproject) {
        try {
            //  const db = await this.connectMongoDB();
            const createproject = await constructiondb.create(myproject);
            const close = await this.closeMongoDB();
            return createproject;

        } catch (err) {
            return ({ Error: `Could not create company ${err} ` })
        }


    }

    async createCompany(newcompany) {
        try {
            //  const db = await this.connectMongoDB();
            const getcompany = await companys.create(newcompany);
            const close = await this.closeMongoDB();
            return getcompany;

        } catch (err) {
            return ({ Error: `Could not create company ${err} ` })
        }


    }

    async updateCompanyByID(company_id, company) {



        const filter = { _id: company_id }

        const options = {
            strict: false,
            new: true,
            upsert: true,
            useFindAndModify: false
        }


        try {

            //  const dbconnect = await this.connectMongoDB();
            const getcompany = await companys.findByIdAndUpdate(filter, company, options)
           // const close = await this.closeMongoDB();
            return getcompany;

        } catch (err) {
            return ({ Error: `Could not update company ${err}` })
        }


    }

    async removeCompanyByID(company_id) {
        try {

            //  const db = await this.connectMongoDB();
            const getcompany = await companys.findByIdAndDelete({ _id: company_id })
            const close = await this.closeMongoDB();
            return getcompany;


        } catch (err) {
            return ({ Error: `Could not remove Company ${err}` })
        }

    }

    async fetchCompanybyUserID(user_id) {
        try {

            let myuser = await this.getUserByID(user_id)
            const companyid = myuser.recordset[0].CompanyID;
            const company = await this.fetchCompanyByID(companyid)
            return company;

        } catch (err) {
            console.log("fetch company", err)
        }

    }

    async fetchCompanyByID(company_id) {
        try {
            let allprojects = {};
            // const db = await this.connectMongoDB();
            const getcompany = await companys.findById({_id:company_id})
            const result = await this.getProjectsByCompany.call(this, company_id)
            if (result.recordset.length > 0) {
                allprojects = result.recordset;
            }
           // const close = await this.closeMongoDB();
            return ({ company: getcompany, allprojects });

        } catch (err) {
            console.log({Error:`Cannot find Company ${company_id} ${err}`})

        }
    }

    async getCompanyByID(company_id) {
        try {
            // const dbConnect = await this.connectMongoDB();
            const company = await this.fetchCompanyByID(company_id)
            // const dbDisconnect = await this.closeMongoDB();
            return company;


        } catch (err) {
            console.log(err)
        }
    }

    async getCompanys() {
        try {
            //  const dbConnect = await this.connectMongoDB();
            const companys = await this.fetchCompanys();
            //  const dbDisconnect = await this.closeMongoDB();
            return companys;


        } catch (err) {
            console.log(`Could not Get Companys ${err}`)
        }
    }

    async closeMongoDB() {
        try {
            //  let closedb = await mongoose.connection.close()
            //  console.log(`Mongo DB connection closed`)
        } catch (err) {
            console.log(`Error could not close MongoDB ${err}`)

        }
    }

    async connectMongoDB() {
        const MONGODB = keys.MONGODB;
        try {

            const connect = await mongoose.connect(MONGODB);
            console.log(`Success MongoDB connected`)

        } catch (err) {
            console.log(`Error could not connect to DB ${err}`)

        }

    }

    async dbDisconnect() {

        try {
            let closedb = await sql.close()
            console.log(`db disconnected `)
            return closedb;

        } catch (err) {
            console.log(`Could not close db ${err}`)

        }


    }

    async closeDBs() {

        await this.closeMongoDB();
        await this.closedb();
    }

    async dbConnect() {


        const DB = {
            user: keys.USER,
            password: keys.PASSWORD,
            server: keys.SERVER,    // don't add tcp & port number
            database: keys.DATABASE,
            options: {
                encrypt: true
            }
        };

        try {

            const connect = await sql.connect(DB)
            console.log(`db connected`)
            return (connect)

        } catch (err) {
            console.log(`Error could not connect to db ${err} `)

        }


    }

    makeID(length) {
        let result = '';
        let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let charactersLength = characters.length;
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }

    hashPassword(password) {

        return bcrypt.hashSync(password, 10);
    }

    async addUsertoCompany(companyid, user_id) {
        const newemployee = (user_id, title, workinghours) => {
            return ({ user_id, title, workinghours })
        }

        try {

            const company = await this.fetchCompanyByID(companyid)

            if (company.employees) {
                const employee = newemployee(user_id, "", 0)
                company.employees.push(employee)


                const updatecompany = await this.updateCompanyByID(companyid, company)
                const getcompany = await this.fetchCompanyByID(companyid);
                return (getcompany)


            } else {
                console.log("employees not found")
            }


        } catch (err) {
            return ({ Error: `Could not add user to company ${err}` })
        }
    }

    async updateUserCompanyID(user_id, company_id) {
        const connectdb = await this.dbConnect();
        const request = new sql.Request()
        const mysql = `UPDATE MyUsers SET MyUsers.CompanyID = '${company_id}'
        WHERE (((MyUsers.User_ID)='${user_id}'))`
        const results = await request.query(mysql)
        const fetchuser = await this.getUserByID(user_id)
        const disconnect = await this.dbDisconnect();
        return fetchuser;

    }

    async updateUser(myuser) {

        try {

            const firstname = myuser.firstname;
            const lastname = myuser.lastname;
            const _id = myuser._id;
            const emailaddress = myuser.emailaddress;
            const phonenumber = myuser.phonenumber;
            const apple = myuser.apple;
            const userid = myuser.userid;
            const profileurl = myuser.profileurl;
            const connectdb = await this.dbConnect();
            const request = new sql.Request()
            const mysql = `UPDATE MyUsers SET MyUsers.FirstName = '${firstname}',  MyUsers.LastName='${lastname}', MyUsers.EmailAddress='${emailaddress}', MyUsers.PhoneNumber='${phonenumber}', MyUsers.Apple='${apple}', MyUsers.UserID='${userid}', MyUsers.ProfileURL='${profileurl}'
            WHERE (((MyUsers.User_ID)='${myuser._id}'))`
            const results = await request.query(mysql)
            const fetchuser = await this.getUserByID(_id)
            const disconnect = await this.dbDisconnect();
            return fetchuser;


        } catch (err) {
            console.log(`Error: Could not update user ${err}`)
        }


    }

    async getProjectByProjectID(projectid) {

        try {

            const dbConnect = await this.dbConnect();
            const request = new sql.Request();
            let getproject = false
            const mysql = `SELECT Projects.Project_ID, Projects.ProjectID, Projects.User_ID
FROM Projects
WHERE (((Projects.ProjectID)='${projectid}' And (Projects.ProjectID) Is Not Null))`

                ;
            let results = await request.query(mysql)
            const disconnect = await this.dbDisconnect();
            if (results.recordset) {
                getproject = results.recordset[0]
            }

            return getproject;


        } catch (err) {
            console.log(`Error could not fetch projects ${err}`)
        }

    }

    async getProjectsByCompany(company_id) {

        try {

            const dbConnect = await this.dbConnect();
            const request = new sql.Request();
            const mysql = `SELECT MyUsers.CompanyID, Projects.Project_ID, Projects.User_ID, Projects.ProjectID, Projects.Title, Projects.ProjectNumber, Projects.Address, Projects.City, Projects.ProjectState, Projects.Zipcode
FROM Projects INNER JOIN (MyUsers INNER JOIN MyTeam ON MyUsers.User_ID = MyTeam.User_ID) ON Projects.Project_ID = MyTeam.Project_ID
WHERE (((MyUsers.CompanyID)='${company_id}' And (MyUsers.CompanyID) Is Not Null))`

console.log("794", mysql)

            const results = await request.query(mysql)
            const disconnect = await this.dbDisconnect();
            return results;


        } catch (err) {
            console.log(`Error could not fetch projects ${err}`)
        }


    }

    async getUserByID(_id) {
        try {
            const dbConnect = await this.dbConnect();
            const request = new sql.Request();
            const mysql = `SELECT * FROM MyUsers WHERE (((MyUsers.User_ID)='${_id}')) AND MyUsers.User_ID IS NOT NULL`
            const results = await request.query(mysql)
            const disconnect = await this.dbDisconnect();
            return results;

        } catch (err) {

            console.log(`Could not get User By ID ${err}`)
        }

    }

    async createUserID() {


        try {

            let userid = false;
            while (!userid) {
                userid = this.makeID(16)
                let myuser = await this.getUserByID(userid)
                if (myuser.rowsAffected[0] > 0) {
                    userid = false;
                }

            }

            return userid;

        } catch (err) {
            console.log(`Could not Create UserID ${err}`)
        }

    }

    async deleteUser(_id) {
        try {

            const dbconnect = await this.dbConnect();
            const request = new sql.Request();
            const mysql = `DELETE FROM MyUsers WHERE User_ID='${_id}' AND User_ID IS NOT NULL`
            const response = await request.query(mysql)
            const dbDisconnect = await this.dbDisconnect();
            return response

        } catch (err) {
            console.log(err)
        }
    }

    async registerUser(myuser) {
        try {


            const _id = await this.createUserID();
            const firstname = myuser.firstname;
            const lastname = myuser.lastname;
            const emailaddress = myuser.emailaddress;
            const phonenumber = myuser.phonenumber;
            const apple = this.hashPassword(myuser.apple);
            const google = this.hashPassword(myuser.google);
            const profileurl = myuser.profileurl;
            const userid = myuser.userid;
            const dbConnect = await this.dbConnect();
            const request = new sql.Request();
            const mysql = `INSERT INTO MyUsers (User_ID, FirstName, LastName, EmailAddress, PhoneNumber, Apple, Google, ProfileURL, UserID) VALUES ('${_id}','${firstname}','${lastname}','${emailaddress}','${phonenumber}','${apple}','${google}','${profileurl}','${userid}')`
            const results = await request.query(mysql)
            const getuser = await this.getUserByID(_id)
            const disconnect = await this.dbDisconnect();
            return getuser

        } catch (err) {
            return ({ Error: `Could not register user ${err}` })
        }

    }




    async loginUser(myuser) {


        const google = myuser.google;
        const apple = myuser.apple;


        try {

            const db = await this.dbConnect();
            const request = new sql.Request();
            const results = await request.query('select * from MyUsers')

            let myuser = false;
            results.recordsets[0].map(user => {
                if (google) {
                    if (!user.Google) {
                        user.Google = ""
                    }
                    if (bcrypt.compareSync(google, user.Google)) {

                        myuser = user;

                    }

                } else if (apple) {

                    if (!user.Apple) {
                        user.Apple = "";
                    }

                    if (bcrypt.compareSync(apple, user.Apple)) {

                        myuser = user;

                    }
                }
            });



            let response = {};
            if (!myuser) {
                response = { Error: ` No user found ` }
            } else {
                response = myuser;

            }
            const dbdisconnect = await this.dbDisconnect();
            return response;



        } catch (err) {
            console.log(err)

        }

    }


}





module.exports = CivilEngineer;