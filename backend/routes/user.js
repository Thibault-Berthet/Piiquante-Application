/* ------------ JS des routes users ------------ */

// Importation des outils
const express = require('express')
const router = express.Router()
const userCtrl = require('../controllers/user')

// Liste des différentes routes user possible
router.post('/signup', userCtrl.signup)
router.post('/login', userCtrl.login)

module.exports = router