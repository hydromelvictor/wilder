const express = require('express');
const router = express.Router();


const userCrtl = require('../../controllers/user/user')
const use = require('../../middlewares/user')


router.get('/:id?', userCrtl.getUsers)
router.get('/:id/friends', userCrtl.getUserFriends)
router.get('/:id/friends/requests', userCrtl.getUserFriendsRequests)
router.get('/:id/followers', userCrtl.getUserFollowers)
router.get('/:id/followings', userCrtl.getUserFollowings)
router.get('/:id/blockeds', userCrtl.getUserBlockeds)

router.post('/:id/friends/requests', userCrtl.getUserFriendRequests)



router.post('/search', userCrtl.getSearchedUsers)

router.put('/:id', userCrtl.updateOneUser)

router.put('/:id/critical', userCrtl.criticalUpdate)

router.delete('/:id', userCrtl.deleteOneUser)

router.delete('/', userCrtl.deleteAllUsers)

router.delete('/search', userCrtl.deleteSearchedUsers)

router.get('/count', userCrtl.countUsers)

module.exports = router
