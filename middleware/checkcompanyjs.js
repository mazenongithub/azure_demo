module.exports = (ws, req, next) => {
    if (req.session) {

        if (req.session.myuser) {

            return next();

        } else {

            console.log({ Error: ' User is not Logged In ! ' })

        }
    }

}