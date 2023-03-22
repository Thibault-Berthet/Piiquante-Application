const express = require('express')
const auth = require('../middleware/auth')
const saucesCtrl = require('../controllers/sauces')
const multer = require('../middleware/multer-config')

const router = express.Router()

router.get('/', auth, saucesCtrl.getAllSauce);
router.get('/:id', auth, saucesCtrl.getOneSauce);
router.post('/', auth, multer, saucesCtrl.createSauce);
router.put('/:id', auth, multer, saucesCtrl.modifySauce);
router.delete('/:id', auth, saucesCtrl.deleteSauce);
router.post('/:id/like', auth, saucesCtrl.likeDislike);

module.exports = router