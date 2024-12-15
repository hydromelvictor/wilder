require('dotenv').config();
const action = require('../utils/action');
const logger = require('../logger');


exports.createCategory = (req, res, next) => {
    const { user } = req.auth

    if (!user) {
        return res.status(400).json({ msg: 'User not found' })
    }

    if (user && !user.staff) {
        res.status(403).json({ msg: 'You do not have permission to change status in delete' })
    }

    const actioner = action(user, 'product')

    if (!actioner.group.isWrite) {
        return res.status(403).json({ msg: 'You do not have permission to create product' })
    }

    fetch(process.env.PRDURL + '/categories', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(req.body)
    })
    .then(response => response.json())
    .then(() => res.status(201).json())
    .catch(err => {
        logger.error(err)
        res.status(500).json({ 
            msg: 'error', 
            err: err.message 
        })
    })
}


exports.updateCategory = (req, res, next) => {
    const { user } = req.auth
    const { id } = req.auth

    const actioner = action(user, 'product')

    if (!user) {
        return res.status(400).json({ msg: 'User not found' })
    }

    if (id && !actioner.group.isWrite) {
        return res.status(403).json({ msg: 'You do not have permission to read product' })
    }

    if (id && !user.staff) {
        res.status(403).json({ msg: 'You do not have permission to change status in delete' })
    }

    fetch(process.env.PRDURL + '/categories/' + id, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(req.body)
    })
    .then(response => response.json())
    .then(() => res.status(200).json())
    .catch(err => {
        logger.error(err)
        res.status(500).json({ 
            msg: 'error', 
            err: err.message 
        })
    })
}


exports.deleteCategories = (req, res, next) => {
    const { user } = req.auth
    const { id } = req.auth

    const actioner = action(user, 'product')

    if (!user) {
        return res.status(400).json({ msg: 'User not found' })
    }

    if (id && !actioner.group.isWrite) {
        return res.status(403).json({ msg: 'You do not have permission to read product' })
    }

    if (id && !user.staff) {
        res.status(403).json({ msg: 'You do not have permission to change status in delete' })
    }

    fetch(process.env.PRDURL + '/categories' + id ? '/' + id : '', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    .then(response => response.json())
    .then(() => res.status(200).json())
    .catch(err => {
        logger.error(err)
        res.status(500).json({ 
            msg: 'error', 
            err: err.message 
        })
    })
}


exports.getCategories = (req, res, next) => {
    const { user } = req.auth
    const { id } = req.auth

    if (!user) {
        return res.status(400).json({ msg: 'User not found' })
    }

    fetch(process.env.PRDURL + '/categories' + id ? '/' + id : '', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    .then(response => response.json())
    .then(data => res.status(200).json({
        store: data,
        msg: 'get categories'
    }))
    .catch(err => {
        logger.error(err)
        res.status(500).json({ 
            msg: 'error', 
            err: err.message 
        })
    })
}


exports.countCategories = (req, res, next) => {
    const { user } = req.auth

    if (!user) {
        return res.status(400).json({ msg: 'User not found' })
    }

    fetch(process.env.PRDURL + '/categories/count', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    .then(response => response.json())
    .then(data => res.status(200).json({
        store: data,
        msg: 'count categories'
    }))
    .catch(err => {
        logger.error(err)
        res.status(500).json({ 
            msg: 'error', 
            err: err.message 
        })
    })
}



exports.addCategoryAttribute = (req, res, next) => {
    const { user } = req.auth
    const { id } = req.auth

    const actioner = action(user, 'product')

    if (!user) {
        return res.status(400).json({ msg: 'User not found' })
    }

    if (id && !actioner.group.isWrite) {
        return res.status(403).json({ msg: 'You do not have permission to read product' })
    }

    if (id && !user.staff) {
        res.status(403).json({ msg: 'You do not have permission to change status in delete' })
    }

    fetch(process.env.PRDURL + '/categories/' + id + '/attributes', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(req.body)
    })
    .then(response => response.json())
    .then(() => res.status(201).json())
    .catch(err => {
        logger.error(err)
        res.status(500).json({ 
            msg: 'error', 
            err: err.message 
        })
    })
}


exports.updateCategoryAttribute = (req, res, next) => {
    const { user } = req.auth
    const { id, name } = req.auth

    const actioner = action(user, 'product')

    if (!user) {
        return res.status(400).json({ msg: 'User not found' })
    }

    if (id && !actioner.group.isWrite) {
        return res.status(403).json({ msg: 'You do not have permission to read product' })
    }

    if (id && !user.staff) {
        res.status(403).json({ msg: 'You do not have permission to change status in delete' })
    }

    fetch(process.env.PRDURL + '/categories/' + id + '/attributes/' + name, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(req.body)
    })
    .then(response => response.json())
    .then(() => res.status(200).json())
    .catch(err => {
        logger.error(err)
        res.status(500).json({ 
            msg: 'error', 
            err: err.message 
        })
    })
}


exports.deleteCategoryAttribute = (req, res, next) => {
    const { user } = req.auth
    const { id, name } = req.auth

    const actioner = action(user, 'product')

    if (!user) {
        return res.status(400).json({ msg: 'User not found' })
    }

    if (id && !actioner.group.isWrite) {
        return res.status(403).json({ msg: 'You do not have permission to read product' })
    }

    if (id && !user.staff) {
        res.status(403).json({ msg: 'You do not have permission to change status in delete' })
    }

    fetch(process.env.PRDURL + '/categories/' + id + '/attributes/' + name, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    .then(response => response.json())
    .then(() => res.status(200).json())
    .catch(err => {
        logger.error(err)
        res.status(500).json({ 
            msg: 'error', 
            err: err.message 
        })
    })
}



exports.createProduct = (req, res, next) => {
    const { user } = req.auth

    if (!user) {
        return res.status(400).json({ msg: 'User not found' })
    }

    const actioner = action(user, 'product')

    if (!actioner.group.isWrite) {
        return res.status(403).json({ msg: 'You do not have permission to create product' })
    }

    req.body.author = user._id

    fetch(process.env.PRDURL + '/products', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(req.body)
    })
    .then(response => response.json())
    .then(() => res.status(201).json())
    .catch(err => {
        logger.error(err)
        res.status(500).json({ 
            msg: 'error', 
            err: err.message 
        })
    })
}


exports.updateProduct = (req, res, next) => {
    const { user } = req.auth
    const { id } = req.auth

    const actioner = action(user, 'product')

    if (!user) {
        return res.status(400).json({ msg: 'User not found' })
    }

    if (id && !actioner.group.isWrite) {
        return res.status(403).json({ msg: 'You do not have permission to read product' })
    }

    fetch(process.env.PRDURL + '/products/' + id, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(req.body)
    })
    .then(response => response.json())
    .then(() => res.status(200).json())
    .catch(err => {
        logger.error(err)
        res.status(500).json({ 
            msg: 'error', 
            err: err.message 
        })
    })
}


exports.deleteProducts = (req, res, next) => {
    const { user } = req.auth
    const { id } = req.auth

    const actioner = action(user, 'product')

    if (!user) {
        return res.status(400).json({ msg: 'User not found' })
    }

    if (id && !actioner.group.isWrite) {
        return res.status(403).json({ msg: 'You do not have permission to read product' })
    }

    fetch(process.env.PRDURL + '/products' + id ? '/' + id : '', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    .then(response => response.json())
    .then(() => res.status(200).json())
    .catch(err => {
        logger.error(err)
        res.status(500).json({ 
            msg: 'error', 
            err: err.message 
        })
    })
}


exports.getProducts = (req, res, next) => {
    const { user } = req.auth
    const { id } = req.auth

    if (!user) {
        return res.status(400).json({ msg: 'User not found' })
    }

    fetch(process.env.PRDURL + '/products' + id ? '/' + id : '', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    .then(response => response.json())
    .then(data => res.status(200).json({
        store: data,
        msg: 'get product'
    }))
    .catch(err => {
        logger.error(err)
        res.status(500).json({ 
            msg: 'error', 
            err: err.message 
        })
    })
}


exports.countProducts = (req, res, next) => {
    const { user } = req.auth

    if (!user) {
        return res.status(400).json({ msg: 'User not found' })
    }

    fetch(process.env.PRDURL + '/products/count', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    .then(response => response.json())
    .then(data => res.status(200).json({
        store: data,
        msg: 'count products'
    }))
    .catch(err => {
        logger.error(err)
        res.status(500).json({ 
            msg: 'error', 
            err: err.message 
        })
    })
}
