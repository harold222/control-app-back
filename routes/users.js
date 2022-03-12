const { Router } = require('express')
const { check } = require('express-validator')
const { validateFields } = require('../middlewares/validate-fields');
const {
    getAllUsers,
    getSpecificUser,
    getUnregisteredUsers,
    getRegisteredUsers,
    postUser,
    putUser,
    deleteUser,
} = require('../controllers/users');
const { validateRol, validateEmail } = require('../helpers/db-validators');


const router = Router();

router.get('/', getAllUsers)
router.get('/:id', getSpecificUser)

router.post('/', [
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'La contraseña es obligatorio').not().isEmpty(),
    check('email', 'El correo no es valido.').custom(validateEmail),
    check('rol', 'No es un rol valido').custom(validateRol),
    check('birthDate', 'Fecha de cumpleaños es obligatoria').not().isEmpty(),
    validateFields
],postUser)

router.put('/:id', putUser)

router.delete('/', deleteUser)

module.exports = router;