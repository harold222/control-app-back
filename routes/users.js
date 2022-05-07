const { Router } = require('express')
const { check } = require('express-validator')
const {
    getAllUsers,
    getSpecificUser,
    postUser,
    putUser,
    deleteUser,
    changeStateUser
} = require('../controllers/users');
const { validateRol, validateEmail, validateUser } = require('../helpers/db-validators');
const { validateJWT, verifyRoles, validateFields } = require('../middlewares');

const router = Router();

router.get('/', [
    validateJWT,
    verifyRoles('ADMIN_ROLE', 'HUMAN_RESOURCES_ROLE', 'USER_ROLE', 'SUPERVISOR_ROLE'),
], getAllUsers)

router.get('/:id', [
    validateJWT,
    verifyRoles('ADMIN_ROLE', 'HUMAN_RESOURCES_ROLE', 'USER_ROLE', 'SUPERVISOR_ROLE'),
    check('id', 'id usuario invalido').isMongoId(),
    check('id').custom(validateUser),
    validateFields
], getSpecificUser)

router.get('/newstate/:id', [
    validateJWT,
    verifyRoles('ADMIN_ROLE', 'SUPERVISOR_ROLE'),
    check('id', 'id usuario invalido').isMongoId(),
    check('id').custom(validateUser),
], changeStateUser)

router.post('/', [
    validateJWT,
    verifyRoles('ADMIN_ROLE', 'SUPERVISOR_ROLE'),
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'La contraseña es obligatorio').not().isEmpty(),
    check('email', 'El correo no es valido.').custom(validateEmail),
    check('rol', 'El rol es requerido').not().isEmpty(),
    check('rol', 'No es un rol valido').custom(validateRol),
    check('birthDate', 'Fecha de cumpleaños es obligatoria').not().isEmpty(),
    validateFields
],postUser)

router.put('/:id', [
    validateJWT,
    verifyRoles('ADMIN_ROLE', 'HUMAN_RESOURCES_ROLE', 'USER_ROLE', 'SUPERVISOR_ROLE'),
    check('id', 'id usuario invalido').isMongoId(),
    check('id').custom(validateUser),
    check('rol', 'No es un rol valido').custom(validateRol),
    validateFields
], putUser)

router.delete('/:id', [
    validateJWT,
    verifyRoles('ADMIN_ROLE', 'SUPERVISOR_ROLE'),
    check('id', 'id usuario invalido').isMongoId(),
    check('id').custom(validateUser),
], deleteUser)

module.exports = router;