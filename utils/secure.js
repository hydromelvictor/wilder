const Log = require('../models/audit/log');
const logger = require('../logger');


async function createLog(action, resName, resId, user) {

    const log = new Log({
        owner: user._id,
        action: action,
        ipAddress: user.engine.ipAddress,
        device: {
            name: user.engine.appareil,
            navigator: user.engine.navigator,
            os: user.engine.os,
            version: user.engine.versionDevice
        },
        ressource: {
            name: resName,
            id: resId
        }
    })

    console.log(log)

    log
        .save()
        .then()
        .catch(err => {
            logger.error(err)
        })
}

module.exports = {
    createLog
}
