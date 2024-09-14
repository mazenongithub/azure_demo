const MyProjects = require('../classes/myprojects');
const checkUser = require('../middleware/checkuser');

module.exports = app => {

    app.get('/pm/:user_id/loadmyprojects', checkUser, (req, res) => {

        const _ID = req.params.user_id;
        const myprojects = new MyProjects(_ID)
        myprojects.loadMyProjects()
            .then(succ => {
                res.send({ myprojects: succ })
            })
            .catch(err => {
                console.log(`Error: could not find projects ${err}`)
            })


    })

    app.post('/pm/:user_id/handlemyprojects', (req, res) => {
        const user_id = req.params.user_id;
        const myProjects = new MyProjects(user_id)
        const myprojects = req.body.myprojects;

        myProjects.handleMyProjects(myprojects)
            .then(succ => {

                myProjects.loadMyProjects()
                    .then(succ_1 => {

                        res.send({ myprojects: succ_1, response: succ.response })

                    })

                    .catch(err_1 => {
                        console.log(`Error could not load myproject ${err}`)
                    })



            })

            .catch(err => {
                console.log(`Error: Could Not Handle Project ${err}`)
            })





    })


    app.get('/pm/findallprojects', (req, res) => {
        const MYPROJECTS = new MyProjects("")
        MYPROJECTS.findAllProjects()
            .then(succ => {
                res.send({ myprojects: succ })

            })

            .catch(err => {
                console.log(`Error could not find projects ${err}`)
            })

    })

    app.get('/pm/:project_id/removeproject', (req, res) => {
        const MYPROJECTS = new MyProjects("")
        const project_id = req.params.project_id;
        MYPROJECTS.removeProjectByID(project_id)
            .then(succ => {
                res.send({ myprojects: succ })

            })

            .catch(err => {
                console.log(`Error could not find projects ${err}`)
            })

    })


}