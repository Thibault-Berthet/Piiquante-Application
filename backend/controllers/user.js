/* ------------ JS des controllers users ------------ */

// Importation des outils
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const emailValidator = require('email-validator')
const passwordValidator = require('password-validator')

// Création du schema de mot de passe et des conditions
const passwordSchema = new passwordValidator()
passwordSchema
.is().min(8)            // Possède au moins 8 caractères
.is().max(40)           // Possède au plus 40 caractères
.has().uppercase(1)     // Contient au moins une majuscule
.has().lowercase(1)     // Contient au moins une minuscule
.has().digits(1)        // Contient au moins 1 chiffre
.has().not().spaces()   // Ne contient pas d'espaces

// Fonction de l'enregistrement d'un utilisateur
exports.signup = (req, res, next) => {
    // Validation de l'email avec email validator et du mot de passe avec password validator
    if(!emailValidator.validate(req.body.email)) {              
        throw  "Email not correct"
    } else if (!passwordSchema.validate(req.body.password)) {
        throw  "Password not correct"
    } else {
        // Cryptage du mot de passe et sauvegarde de l'utilisateur
        bcrypt.hash(req.body.password, 10)
            .then(hash => {
                const user = new User({
                    email: req.body.email,
                    password: hash
                })
                user.save()
                    .then(() => res.status(201).json({ message: 'User create.' }))
                    .catch(error => { res.status(400).json({ error })})
            })
            .catch(error => res.status(500).json({ error }))
    }
}

// Fonction de la connexion d'un utilisateur
exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email})
        .then(user => {
            if (user === null) {
                res.status(401).json({message: 'identifier/password not correct'})
            }
            bcrypt.compare(req.body.password, user.password)
                    .then(valid => {
                        if (!valid) {
                            res.status(401).json({message: 'identifier/password not correct'})
                        }
                        res.status(200).json({
                            userId: user._id,
                            token: jwt.sign(
                                { userId: user._id},
                                '"}">HUTy08+gYm~-uVOOee@aJo-4#s',
                                { expiresIn: '24h' }
                            )
                        })
                    })
                    .catch(error => res.status(500).json({ error }))
        })
        .catch(error => res.status(500).json({ error }))
}