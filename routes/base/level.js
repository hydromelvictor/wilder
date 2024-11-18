const express = require('express');
const router = express.Router();

const levelCrtls = require('../../controllers/base/level')


// create
router.post('/', levelCrtls.createLevel)
// read
router.get('/:id?', levelCrtls.getLevel)
// update
router.put('/:id', levelCrtls.updateLevel)
// delete
router.delete('/:id?', levelCrtls.deleteLevel)

// find, deleteFind
router.post('/find', levelCrtls.getFindLevel)
router.post('/delete', levelCrtls.deleteFindLevel)

// count
router.post('/count', levelCrtls.countLevel)

module.exports = router
