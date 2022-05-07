const { Router } = require('express')
const { check } = require('express-validator');
const {
    createNewRegistration
} = require('../controllers/registrations');
const { validateStation } = require('../helpers/db-validators');
const { validateJWT, verifyRoles, validateFields } = require('../middlewares');

const router = Router();

router.post('/create', [
    validateJWT,
    verifyRoles('SUPERVISOR_ROLE'),
    check('idStation', 'El id de la estacion es obligatorio').not().isEmpty(),
    check('idStation').custom(validateStation),
    validateFields
], createNewRegistration)

module.exports = router;