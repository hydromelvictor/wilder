
module.exports = (user, organism = '') => {

    const perform = organism !== '' ? user.level.performs.filter(
        perform => perform.organism === organism
    )[0] : {}

    const auth = organism !== '' ? user.role.auths.filter(
        auth => auth.organism === organism
    )[0] : {}

    return {
        status: {
            isActive: user.status === 'active' ? true : false,
            isWaiting: user.status === 'waiting' ? true : false,
            isInactive: user.status === 'inactive' ? true : false,
            isDelete: user.status === 'delete' ? true : false,
            isSuspend: user.status === 'suspend' ? true : false
        },
        size: {
            isView: perform?.access.includes('v'),
            isRead: perform?.access.includes('v') && perform.access.includes('r'),
            isBuild: perform?.access.includes('v') && perform.access.includes('r') && perform?.access.includes('c') && perform.access.includes('u'),
            isDelete: perform?.access.includes('v') && perform.access.includes('d'),
            isExec: perform?.access.includes('v') && perform.access.includes('x')
        },
        auth: {
            isRead: auth?.access.includes('r'),
            isWrite: auth?.access.includes('r') && auth?.access.includes('w'),
            isExec: auth?.access.includes('r') && auth?.access.includes('x')
        }
    }
}
