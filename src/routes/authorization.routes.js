const router = require('express').Router();
const userController = require('../controllers/authorization.controller');

router.post('/user/register', userController.register);
router.post('/user/login', userController.login);
router.get('/user/me', userController.me)

module.exports = router;