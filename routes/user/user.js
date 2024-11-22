const express = require('express');
const router = express.Router();


const userCrtl = require('../../controllers/user/user')


router.get('/:id', userCrtl.getOneUser)

router.get('/', userCrtl.getAllUsers)

router.post('/search', userCrtl.searchUsers)

router.put('/:id', userCrtl.updateOneUser)

router.put('/:id/critical', userCrtl.criticalUpdate)

router.delete('/:id', userCrtl.deleteOneUser)

router.delete('/', userCrtl.deleteAllUsers)

router.delete('/search', userCrtl.deleteSearchedUsers)

router.post('/search', userCrtl.searchUsers)

router.get('/count', userCrtl.countUsers)

module.exports = router
