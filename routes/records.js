const { Router } = require('express')
const { check } = require('express-validator');
const {
    updateStateRecordAndHistory,
    getRecordBySupervisor,
    getSpecificRecord,
    getFaultsByRecord
} = require('../controllers/records');
const { validateRecord } = require('../helpers/db-validators');
const { validateJWT, verifyRoles, validateFields } = require('../middlewares');


const router = Router();

router.post('/updateState', [
    validateJWT,
    verifyRoles('ADMIN_ROLE', 'SUPERVISOR_ROLE'),
    check('idRecord', 'El id del historial es obligatorio').not().isEmpty(),
    check('idRecord').custom(validateRecord),
    check('type', 'Debe enviar el tipo de registro si es ingress o exit').not().isEmpty(),
    validateFields
], updateStateRecordAndHistory)

router.get('/getRecordBySupervisor/:idSupervisor/:idStation', [
    validateJWT,
    verifyRoles('ADMIN_ROLE', 'SUPERVISOR_ROLE'),
    check('idSupervisor', 'El id del supervisor es obligatorio').not().isEmpty(),
    check('idSupervisor', 'id supervisor invalido').isMongoId(),
    check('idStation', 'El id de la estacion es obligatorio').not().isEmpty(),
    check('idStation', 'id estacion invalido').isMongoId(),
], getRecordBySupervisor)

router.get('/getRecord/:id', [
    validateJWT,
    verifyRoles('ADMIN_ROLE', 'HUMAN_RESOURCES_ROLE', 'SUPERVISOR_ROLE'),
    check('id', 'El id del historial es obligatorio').not().isEmpty(),
    check('id', 'id historial invalido').isMongoId(),
    validateFields
], getSpecificRecord)

router.post('/getFaultsByRecord', [
    validateJWT,
    verifyRoles('ADMIN_ROLE', 'SUPERVISOR_ROLE'),
    check('idOperator', 'El id de operador es obligatorio').not().isEmpty(),
    check('idOperator', 'id operador invalido').isMongoId(),
    check('idStation', 'El id de la estacion es obligatorio').not().isEmpty(),
    check('idStation', 'id estacion invalido').isMongoId(),
    validateFields
], getFaultsByRecord)

module.exports = router;