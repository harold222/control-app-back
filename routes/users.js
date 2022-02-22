const { Router } = require('express')
const { check } = require('express-validator')
const { validateFields } = require('../middlewares/validate-fields');
const {
    getUsers,
    deleteUser,
    postUser,
    putUser
} = require('../controllers/users')

const router = Router();

router.get('/', getUsers)
router.post('/', postUser)
router.put('/:id', putUser)
router.delete('/', deleteUser)

module.exports = router;