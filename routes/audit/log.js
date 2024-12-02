const express = require('express');
const router = express.Router();

const use = require('../../middlewares/use')

const LogCrtls = require('../../controllers/audit/log')


router.post('/', use, LogCrtls.createLog)
router.get('/:id', use, LogCrtls.getLog)
router.get('/:owner', use, LogCrtls.geUserLogs)
router.delete('/:id', use, LogCrtls.deleteUserLogs)

module.exports = router
