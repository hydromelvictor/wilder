const express = require('express');
const router = express.Router();


const userCrtls = require('../../controllers/user/index')
const getUserCrtls = require('../../controllers/user/get')
const use = require('../../middlewares/use')
const img = require('../../middlewares/img')


router.get('/:id?', use, userCrtls.getUsers)
router.put('/', use, img, userCrtls.updateUser)
router.delete('/', use, userCrtls.deleteOneUser)
router.get('/count', use, userCrtls.countUsers)


// router.get('/:id/friends', use, getUserCrtls.getUserFriends)
// router.get('/:id/friends/requests', use, getUserCrtls.getUserRequests)
// router.get('/:id/followers', use, getUserCrtls.getUserFollowers)
// router.get('/:id/followings', use, getUserCrtls.getUserFollowings)
// router.get('/:id/blockeds', use, getUserCrtls.getUserBlockeds)




// router.post('/search', userCrtls.getSearchedUsers)

// router.put('/:id', userCrtls.updateOneUser)

// router.put('/:id/critical', userCrtls.criticalUpdate)



// router.delete('/', userCrtls.deleteAllUsers)

// router.delete('/search', userCrtls.deleteSearchedUsers)

// Gérer l'erreur en cas de fichier trop grand

router.use((err, req, res, next) => {
    if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ msg: 'Le fichier est trop volumineux. La taille maximale autorisée est de 2 Mo.' });
    }
    next(err);  // Si l'erreur n'est pas liée à la taille du fichier, on la passe à l'étape suivante
});


module.exports = router
