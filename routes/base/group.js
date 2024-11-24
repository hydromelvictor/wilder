const express = require('express');
const router = express.Router();

const use = require('../../middlewares/use')

const groupCrtls = require('../../controllers/base/group')


// create
router.post('/', use, groupCrtls.createGroup)
// read
router.get('/:id?', use, groupCrtls.getGroup)
// update
router.put('/:id', use, groupCrtls.updateGroup)
// delete
router.delete('/:id?', use, groupCrtls.deleteGroup)
// count
router.post('/count', use, groupCrtls.countGroup)

module.exports = router
