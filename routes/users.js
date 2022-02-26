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
} = require('../controllers/users')

const router = Router();

router.get('/', getAllUsers)
router.get('/:id', getSpecificUser)

router.post('/', postUser)

router.put('/:id', putUser)

router.delete('/', deleteUser)

module.exports = router;