const express = require('express');
const router = express.Router();


const prdCrtls = require('../controllers/product');
const use = require('../middlewares/use');
const img = require('../middlewares/img');


router.get('/:id?', use, prdCrtls.getCategories);
router.get('/products/:id?', use, prdCrtls.getProducts);

router.put('/:id', use, img, prdCrtls.updateProduct);
router.put('/products/:id', use, img, prdCrtls.updateProduct);

router.delete('/:id', use, prdCrtls.deleteCategories)
router.delete('/products/id', use, prdCrtls.deleteProducts);

router.get('/count', use, prdCrtls.countCategories);
router.get('/products/count', use, prdCrtls.countProducts);

router.post('/', use, prdCrtls.createCategory);
router.post('/products', use, img, prdCrtls.createProduct);

router.post('/:id/attrs', use, prdCrtls.addCategoryAttribute);
router.put('/:id/attrs/:name', use, prdCrtls.updateCategoryAttribute);
router.delete('/:id/attrs/:name', use, prdCrtls.deleteCategoryAttribute);


module.exports = router;
