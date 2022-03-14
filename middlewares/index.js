const validateFields = require('./validate-fields');
const validateJWT = require('./validate-jwt')
const verifyRoles = require('./validate-rol')

module.exports = {
    ...validateFields,
    ...validateJWT,
    ...verifyRoles
}