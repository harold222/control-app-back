const { Router } = require('express')
const { check } = require('express-validator');
const { login } = require('../controllers/auth');
const { existEmail } = require('../helpers/db-validators');
const { validateFields } = require('../middlewares/validate-fields');

const router = Router();

router.post('/login',[
    check('email').custom(existEmail),
    check('password', 'The password is required').not().isEmpty(),
    validateFields
], login)

module.exports = router;