const express = require('express');
const router = express.Router();

const authCrtl = require('../../controllers/user/auth')



router.post('/signup', authCrtl.signup)

router.post('/login', authCrtl.login)

router.get('/logout', authCrtl.logout)

router.post('/forgot', authCrtl.forgot)

router.post('/refresh', authCrtl.refresh)

router.put('/reset', authCrtl.reset)
