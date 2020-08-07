const router = require('express').Router()
const {produkController} = require('../controllers')

router.get('/produk/get', produkController.getProducts)
router.get('/produk/get/:id', produkController.getProductsByID)
router.get('/produk/get/page/:limit/:page', produkController.getPage)
router.post('/produk/add', produkController.addProduct)
router.delete('/produk/delete/:id', produkController.deleteProduct)
router.patch('/produk/edit/:id', produkController.editProduct)

module.exports = router