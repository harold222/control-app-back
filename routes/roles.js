const { Router } = require('express')
const { check } = require('express-validator');
const { getAllRoles, createNewRoles } = require('../controllers/rol');
const { validateFields } = require('../middlewares/validate-fields');

const router = Router();

router.get('/', getAllRoles)
router.post('/', [
    check('roles', 'Debe enviar un array de roles: ["rol1", "rol2"]').isArray(),  
    validateFields
], createNewRoles)

module.exports = router;