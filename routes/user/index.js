const express = require('express');
const router = express.Router();


const userCrtls = require('../../controllers/user/index')
const getUserCrtls = require('../../controllers/user/get')
const use = require('../../middlewares/use')
const img = require('../../middlewares/img')


router.get('/:id?', use, userCrtls.getUsers)
router.put('/', use, img, userCrtls.updateUser)
router.delete('/', userCrtls.deleteOneUser)
router.get('/count', userCrtls.countUsers)


router.get('/:id/friends', use, getUserCrtls.getUserFriends)
router.get('/:id/friends/requests', use, getUserCrtls.getUserRequests)
router.get('/:id/followers', use, getUserCrtls.getUserFollowers)
router.get('/:id/followings', use, getUserCrtls.getUserFollowings)
router.get('/:id/blockeds', use, getUserCrtls.getUserBlockeds)




router.post('/search', userCrtls.getSearchedUsers)

router.put('/:id', userCrtls.updateOneUser)

router.put('/:id/critical', userCrtls.criticalUpdate)



router.delete('/', userCrtls.deleteAllUsers)

router.delete('/search', userCrtls.deleteSearchedUsers)



module.exports = router
