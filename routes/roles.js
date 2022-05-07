const { Router } = require('express')
const { check } = require('express-validator');
const { getAllRoles, createNewRoles } = require('../controllers/rol');
const { validateJWT, verifyRoles, validateFields } = require('../middlewares');

const router = Router();

router.get('/', [
    validateJWT,
    verifyRoles('ADMIN_ROLE', 'HUMAN_RESOURCES_ROLE', 'OPERATOR_ROLE', 'SUPERVISOR_ROLE'),
], getAllRoles)

router.post('/', [
    validateJWT,
    verifyRoles('ADMIN_ROLE'),
    check('roles', 'Debe enviar un array de roles: ["rol1", "rol2"]').isArray(),  
    validateFields
], createNewRoles)

module.exports = router;