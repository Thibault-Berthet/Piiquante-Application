/* ------------ JS de la création du token d'authentification ------------ */

// Importation des outils
const jwt = require('jsonwebtoken')

// Verification du bon token
module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1]
        const decodedToken = jwt.verify(token, '"}">HUTy08+gYm~-uVOOee@aJo-4#s')
        const userId = decodedToken.userId
        req.auth = {
            userId: userId
        }
        next()
    } catch(error) {
        res.status(401).json({ error })
    }
}