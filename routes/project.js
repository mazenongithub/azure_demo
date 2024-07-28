
const CivilEngineer = require('../classes/civilengineer');
module.exports = app => {


    app.get('/projects/:companyid/showall', (req,res) => {
        const companyid = req.params.companyid;
        const civilengineer = new CivilEngineer();
        civilengineer.getProjectsByCompany(companyid)
        .then( getprojects=> {
           
           res.send({allprojects:getprojects.recordset})
         
        })

        .catch((err) => {
            res.send({Error:` Could not find all project ${err}`})
        })
     

    })




}