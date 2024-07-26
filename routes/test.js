const checkUser = require('../middleware/checkuser');
module.exports = app => {


    app.get('/',  (req, res) => {

        let message = " hello user";
        // if(req.session) {
        //     if(req.session.userid) {
        //         message += ` You are Logged In as ${req.session.userid}`
        //     }
        // }
     
        res.json({ message })
    
    
    })

    app.get('/login', (req,res)=> {

        req.session.userid = 'mazen';
        res.redirect('/')
    })

    app.get('/logout', (req,res)=> {
        req.session.destroy();
        res.redirect('/');
    })

    
    



}