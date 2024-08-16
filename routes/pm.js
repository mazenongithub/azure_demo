const MyProjects = require('../classes/myprojects');
const checkUser = require('../middleware/checkuser');

module.exports = app => {

app.get('/pm/:user_id/loadmyprojects', checkUser, (req,res)=> {

    const _ID = req.params.user_id;
    const myprojects = new MyProjects(_ID)
    myprojects.loadMyProjects()
    .then(succ=> {
        res.send({myprojects:succ})
    })
    .catch(err=> {
        console.log(`Error: could not find projects ${err}`)
    })
    

})

app.post('/pm/:user_id/handlemyprojects', (req,res)=> {
    const user_id = req.params.user_id;
    console.log("23", user_id)
    const myProjects = new MyProjects(user_id)
    const myprojects = req.body.myprojects;
    
    myProjects.handleMyProjects(myprojects)
    .then(succ=> {

       myProjects.loadMyProjects()
       .then(succ_1=> {

        res.send({myprojects:succ_1, response:succ.response})

       })

       .catch(err_1=> {
        console.log(`Error could not load myproject ${err}`)
       })

      

    })

    .catch(err=> {
        console.log(`Error: Could Not Handle Project ${err}`)
    })





})


}