const router = require('express-promise-router')();

const { bookReunionDetails, updateReunionDetails, deleteReunionDetails, getAllReunionDetails } = require('../controllers/reservations');
const { checkSession } = require('../controllers/users');


router.route('/reservations')
    .post(checkSession, bookReunionDetails)
    .put(checkSession,updateReunionDetails)
    .delete(checkSession, deleteReunionDetails)
    .get(checkSession, getAllReunionDetails)


module.exports = router;