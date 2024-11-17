const express = require('express');
const router = express.Router();

const groupCrtls = require('../../controllers/base/group')


// create
router.post('/', groupCrtls.createGroup)
// read
router.get('/:id?', groupCrtls.getGroup)
// update
router.put('/:id', groupCrtls.updateGroup)
// delete
router.delete('/:id?', groupCrtls.deleteGroup)

// find, deleteFind
router.post('/find', groupCrtls.getFindGroup)
router.post('/delete', groupCrtls.deleteFindGroup)

// count
router.post('/count', groupCrtls.countGroup)

module.exports = router
