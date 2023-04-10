/* ------------ JS de l'application ------------ */

// Importation des différents outils
const express = require('express')
const mongoose = require('mongoose')
const userRoutes = require('./routes/user')
const saucesRoutes = require('./routes/sauces')
const path = require('path')
const rateLimit = require('express-rate-limit')
const helmet = require('helmet')

const app = express()
app.use(express.json())

// Connexion avec MongoDB
mongoose.connect('mongodb+srv://ThibaultB:Berthet38@cluster0.oeyiv7x.mongodb.net/?retryWrites=true&w=majority',
    {useNewUrlParser: true,
        useUnifiedTopology: true })
        .then(() => console.log('MongoDB connection : succeed'))
        .catch(() => console.log('MongoDB connection : fail'))


// Limitation du nombre de requete
const limiter = rateLimit({
    windowMs: 60 * 60 * 1000,   // 1 heure
	max: 100,                    // Limite chaque IP à 100 requete par fenetre de temps (ici 1h)
	// standardHeaders: true,      // Return rate limit info in the `RateLimit-*` headers
	// legacyHeaders: false,       // Disable the `X-RateLimit-*` headers
})
app.use(limiter)

// Middleware pour le CORS, autorisation d'acces, utilisation de certaines entêtes et méthodes
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS')
    next()
})

// Definition des routes
app.use('/api/sauces', saucesRoutes)
app.use('/api/auth', userRoutes)
app.use('/images', express.static(path.join(__dirname, 'images')))
app.use(helmet())

module.exports = app