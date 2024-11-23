const express = require('express');
const router = express.Router();

const authCrtl = require('../../controllers/user/auth');
const use = require('../../middlewares/use');


router.post('/signup', use, authCrtl.signup)

router.post('/login', authCrtl.login)

router.get('/logout', use, authCrtl.logout)

router.post('/forgot', authCrtl.forgot)

router.post('/refresh', use, authCrtl.refresh)

router.put('/reset', use, authCrtl.reset)

module.exports = router;
