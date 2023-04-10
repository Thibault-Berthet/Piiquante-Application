/* ------------ JS de la gestion des images avec multer ------------ */

// Importation des outils
const multer = require('multer')

// Importation des formats
const MIME_TYPES = {
    'image/jpg':  'jpg',
    'image/jpeg': 'jpeg',
    'image/png':  'png'
}

// Stockage et changement du nom du fichier
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'images')
    },
    filename: (req, file, callback) => {
        const name = file.originalname.split(' ').join('_')
        const extension = MIME_TYPES[file.mimetype]
        callback(null, name + Date.now() + '.' + extension)
    }
})

module.exports = multer({ storage }).single('image')