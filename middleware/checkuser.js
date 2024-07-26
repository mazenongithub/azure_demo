module.exports = (req, res, next) => {
    if(req.session) {

        if(req.session.myuser) {
     
            return next();
           
        }  else {

            res.json({Error: ' User is not Logged In ! '})

        }
    }

}