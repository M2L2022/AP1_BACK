const router = require("express-promise-router")();

const {insertUser, updateUser, identificationUser, checkLoginStatus, checkSession, logout} = require("../controllers/users");

// Users ------------------------------------------------------------------------------------------------------------------------------------

router.route('/users')
    .post(insertUser)

router.route('/users/:id')
    .put(checkSession, updateUser)
    
// identification ------------------------------------------------------------------------------------------------------------------------------------

router.route('/identification')
    .post(identificationUser)
    .get(checkLoginStatus); // rajout

router.route("/logout") // rajout 
    .get(checkSession, logout);

router.route("/protect") // rajout

module.exports = router;