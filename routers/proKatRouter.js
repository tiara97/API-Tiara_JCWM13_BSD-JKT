const router = require('express').Router()
const {proKatController} = require('../controllers')

router.post('/produk-kategori/add', proKatController.addProKat)
router.delete('/produk-kategori/delete/:id', proKatController.deleteProKat)
router.patch('/produk-kategori/update/:id', proKatController.editProKat)
router.get('/produk-kategori/get', proKatController.getProKat)
router.get('/produk-kategori/get/:id', proKatController.getProKatByID)

module.exports = router