const { Router } = require('express')
const { check } = require('express-validator');
const {
    getAllStations,
    deleteStation,
    getSpecificStation,
    postStation,
    putStation,
    getStationsBySupervisor
} = require('../controllers/stations');
const { validateStation } = require('../helpers/db-validators');
const { validateJWT, verifyRoles, validateFields } = require('../middlewares');

const router = Router();

router.get('/', [
    validateJWT,
    verifyRoles('ADMIN_ROLE', 'HUMAN_RESOURCES_ROLE', 'OPERATOR_ROLE', 'SUPERVISOR_ROLE'),
], getAllStations)

router.get('/getStation/:id', [
    validateJWT,
    verifyRoles('ADMIN_ROLE', 'HUMAN_RESOURCES_ROLE', 'OPERATOR_ROLE', 'SUPERVISOR_ROLE'),
    check('id', 'id estacion invalido').isMongoId(),
    validateFields
], getSpecificStation)

router.get('/getStationsBySupervisor', [
    validateJWT,
], getStationsBySupervisor)

router.post('/', [
    validateJWT,
    verifyRoles('ADMIN_ROLE', 'SUPERVISOR_ROLE'),
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    validateFields
], postStation)

router.put('/:id', [
    validateJWT,
    verifyRoles('ADMIN_ROLE', 'HUMAN_RESOURCES_ROLE'),
    check('id', 'id estacion invalido').isMongoId(),
    check('id').custom(validateStation),
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    validateFields
], putStation)

router.delete('/:id', [
    validateJWT,
    verifyRoles('ADMIN_ROLE', 'SUPERVISOR_ROLE'),
    check('id', 'id estacion invalido').isMongoId(),
    check('id').custom(validateStation),
], deleteStation)

module.exports = router;