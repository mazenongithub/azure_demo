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
    url:String,
    accounts: [{
        accountid: String,
        user_id: String,
        accountname: String,
        stripe:String
    }],
    employees: [{
        user_id: String,
        title: String,
        workinghours: Number,
        benefits: [{
            benefitid: String,
            benefit: String,
            amount: Number,
            frequency:String,
            accountid:String
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
                hourly:String,
                daily:String,
                weekly:String,
                monthly:String
            },
            ownership: {
                workinghours: Number,
                purchasedate: String,
                loaninterest: Number,
                resalevalue:Number,
                saledate: String,
                salvage: Number,
                purchase: Number,
                cost: [{
                    costid: String,
                    cost: Number,
                    detail: String,
                    timein: String,
                    reoccurring:{
                        frequency:String
                    }
                }]
            }
        }
    ]


})

const companys = mongoose.model("companys", companySchema);

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

    async createCompany(newcompany) {
        try {
            const db = await this.connectMongoDB();
            const getcompany = await companys.create(newcompany);
            const close = await this.closeMongoDB();
            return getcompany;

        } catch(err) {
            return ({Error: `Could not create company ${err} `})
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

            const dbconnect = await this.connectMongoDB();
            const getcompany = await companys.findByIdAndUpdate(filter, company, options)
            const close = await this.closeMongoDB();
            return getcompany;

        } catch (err) {
            return ({Error:`Could not update company ${err}`})
        }


    }

    async removeCompanyByID(company_id) {
        try {

            const db = await this.connectMongoDB();
            const getcompany = await companys.findByIdAndDelete({ _id: company_id })
            const close = await this.closeMongoDB();
            return getcompany;


        } catch(err) {
            return ({Error: `Could not remove Company ${err}`})
        }
        
    }

    async fetchCompanybyUserID (user_id) {
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
           const db = await this.connectMongoDB();
            const getcompany = await companys.findById({ _id: company_id })
            const close = await this.closeMongoDB();
            return getcompany;

        } catch (err) {
            return(err)

        }
    }

    async getCompanyByID(company_id) {
        try {
            const dbConnect = await this.connectMongoDB();
            const company = await this.fetchCompanyByID(company_id)
            const dbDisconnect = await this.closeMongoDB();
            return company;


        } catch (err) {
            console.log(err)
        }
    }

    async getCompanys() {
        try {
            const dbConnect = await this.connectMongoDB();
            const companys = await this.fetchCompanys();
            const dbDisconnect = await this.closeMongoDB();
            return companys;


        } catch (err) {
            console.log(`Could not Get Companys ${err}`)
        }
    }

    async closeMongoDB() {
        try {
            let closedb = await mongoose.connection.close()
            console.log(`Mongo DB connection closed`)
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

        } catch (err) {
            console.log(`Could not close db ${err}`)

        }


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
            return ({user_id, title,workinghours})
        }

        try {
         
            const company = await this.fetchCompanyByID(companyid)
           
            if(company.employees) {
                const employee = newemployee(user_id,"",0)
                company.employees.push(employee)
           
             
                const updatecompany = await this.updateCompanyByID(companyid,company)
                const getcompany = await this.fetchCompanyByID(companyid);
                return(getcompany)
            

            } else {
                console.log("employees not found")
            }
     

        } catch(err) {
            return({Error:`Could not add user to company ${err}`})
        }
    }

    async updateUserCompanyID(user_id, company_id) {
        const connectdb = await this.dbConnect();
        const request = new sql.Request()
        const mysql = `UPDATE MyUsers SET MyUsers.CompanyID = '${company_id}'
        WHERE (((MyUsers._ID)='${user_id}'))`
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
            WHERE (((MyUsers._ID)='${myuser._id}'))`
            const results = await request.query(mysql)
            const fetchuser = await this.getUserByID(_id)
            const disconnect = await this.dbDisconnect();
            return fetchuser;


        } catch (err) {
            console.log(`Error: Could not update user ${err}`)
        }


    }

    async getUserByID(_id) {
        try {
            const dbConnect = await this.dbConnect();
            const request = new sql.Request();
            const mysql = `SELECT * FROM MyUsers WHERE (((MyUsers._ID)='${_id}')) AND MyUsers._ID IS NOT NULL`
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
            const mysql = `DELETE FROM MyUsers WHERE _ID='${_id}' AND _ID IS NOT NULL`
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
            const mysql = `INSERT INTO MyUsers (_ID, FirstName, LastName, EmailAddress, PhoneNumber, Apple, Google, ProfileURL, UserID) VALUES ('${_id}','${firstname}','${lastname}','${emailaddress}','${phonenumber}','${apple}','${google}','${profileurl}','${userid}')`
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