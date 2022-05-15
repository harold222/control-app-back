const { Router } = require('express')
const { check } = require('express-validator');
const {
    createNewRegistration,
    updateOpeningTime,
    updateClosingTime,
    getOperatorsByRecord
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

router.post('/opening', [
    validateJWT,
    verifyRoles('ADMIN_ROLE', 'SUPERVISOR_ROLE'),
    check('idOperator', 'El id del operador es obligatorio').not().isEmpty(),
    check('idOperator', 'id operario invalido').isMongoId(),
    check('idSupervisor', 'El id del supervisor es obligatorio').not().isEmpty(),
    check('idSupervisor', 'id supervisor invalido').isMongoId(),
    validateFields
],updateOpeningTime)

router.post('/closing', [
    validateJWT,
    verifyRoles('ADMIN_ROLE', 'SUPERVISOR_ROLE'),
    check('idOperator', 'El id del operador es obligatorio').not().isEmpty(),
    check('idOperator', 'id operario invalido').isMongoId(),
    check('idSupervisor', 'El id del supervisor es obligatorio').not().isEmpty(),
    check('idSupervisor', 'id supervisor invalido').isMongoId(),
    validateFields
],updateClosingTime)

router.post('/getOperatorsByRecord', [
    validateJWT,
    verifyRoles('ADMIN_ROLE', 'SUPERVISOR_ROLE'),
    check('idSupervisor', 'El id del supervisor es obligatorio').not().isEmpty(),
    check('idSupervisor', 'id supervisor invalido').isMongoId(),
    check('idStation', 'El id de estacion es obligatorio').not().isEmpty(),
    check('idStation', 'id estacion invalido').isMongoId(),
    check('createdTime', 'El tiempo de creacion es obligatorio').not().isEmpty(),
    check('schedule', 'El horario es obligatorio').not().isEmpty(),
    validateFields
], getOperatorsByRecord)


module.exports = router;