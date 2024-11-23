module.exports = (user, entity = '') => {

    if (!user) {
        throw new Error('User is required');
    }

    const auth = entity
        ? user.group?.auths?.find(auth => auth.entity === entity)
        : null;

    const hasAccess = (access, ...permissions) =>
        permissions.every(permission => access?.includes(permission));

    return {
        status: {
            isActive: user.status === 'active',
            isWaiting: user.status === 'waiting',
            isInactive: user.status === 'inactive',
            isDelete: user.status === 'delete',
            isSuspend: user.status === 'suspend'
        },
        group: {
            isRead: hasAccess(auth?.access, 'r'),
            isWrite: hasAccess(auth?.access, 'r', 'w'),
            isExec: hasAccess(auth?.access, 'r', 'x')
        },
        isVisible: () => {
            const { state, _id, friends = [], followers = [], customers = [] } = user;

            switch (state) {
                case 'all':
                    return true;
                case 'hidden':
                    return false;
                case 'protected':
                    return friends.includes(_id) || followers.includes(_id);
                case 'private':
                    return friends.includes(_id);
                default:
                    return false;
            }
        }
    };
};
