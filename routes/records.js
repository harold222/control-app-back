const { Router } = require('express')
const { check } = require('express-validator');
const {
    updateStateRecordAndHistory
} = require('../controllers/records');
const { validateRecord } = require('../helpers/db-validators');
const { validateJWT, verifyRoles, validateFields } = require('../middlewares');


const router = Router();

router.post('/updateState', [
    validateJWT,
    verifyRoles('ADMIN_ROLE', 'SUPERVISOR_ROLE'),
    check('idRecord', 'El id del historial es obligatorio').not().isEmpty(),
    check('idRecord').custom(validateRecord),
    validateFields
], updateStateRecordAndHistory)


module.exports = router;