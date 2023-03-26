const Sauce = require('../models/Sauce')
const fs = require('fs')

// Création d'une sauce
exports.createSauce = (req, res, next) => {
    const sauceObjet = JSON.parse(req.body.sauce)
    delete sauceObjet._id
    delete sauceObjet._userId
    const sauce = new Sauce({
        ...sauceObjet,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        likes: 0,
        dislikes: 0,
        usersLiked: [' '],
        usersDisliked: [' ']
    })
    sauce.save()
        .then(() => res.status(201).json({ message : 'Sauce created' }))
        .catch((error) => res.status(400).json({ error }))
}

// Modification d'une sauce
exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body}

    delete sauceObject._userId
    Sauce.findOne({_id: req.params.id})
        .then((sauce) => {
            if (sauce.userId != req.auth.userId) {
                res.status(403).json({ message : 'Unauthorized request'})
            }
            Sauce.updateOne({ _id : req.params.id}, { ...sauceObject, _id: req.params.id})
                .then(() => res.status(200).json({message : 'Sauce modified'}))
                .catch(error => res.status(401).json({ error }))
        })
        .catch( (error) => {
            res.status(400).json({ error })
        })
}

// Suppression d'une sauce
exports.deleteSauce= (req, res, next) => {
    Sauce.findOne({_id: req.params.id})
        .then(sauce => {
            if (sauce.userId != req.auth.userId) {
                res.status(403).json({message: 'Unauthorized request'})
            }
            const filename = sauce.imageUrl.split('/images/')[1]
            fs.unlink(`images/${filename}`, () => {
                sauce.deleteOne({_id: req.params.id})
                    .then(() => {res.status(200).json({message: 'Sauce deleted'})})
                    .catch(error => res.status(401).json({ error }))
            })
        })
        .catch( error => res.status(500).json({ error }))
}

// Récuperation d'une sauce
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
      .then(sauce => res.status(200).json( sauce ))
      .catch(error => res.status(404).json({ error }))
}

// Récuperation de toutes les sauces
exports.getAllSauce = (req, res, next) => {
    Sauce.find()
      .then(sauces => res.status(200).json( sauces ))
      .catch(error => res.status(404).json({ error }))
}

exports.likeDislike = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then((sauce) => {
            const {userId,like} = req.body

            if(like === 1 && !sauce.usersLiked.includes(userId)){
                Sauce.updateOne({ _id : req.params.id},{
                    $inc: {likes: 1},
                    $push: { usersLiked: userId}
                })
                    .then(() => {res.status(200).json({message: 'Like accepted'})})
                    .catch(error => res.status(500).json({ error }))
            }

            if(like === 0 && sauce.usersLiked.includes(userId)){
                Sauce.updateOne({ _id : req.params.id},{
                    $inc: {likes: -1},
                    $pull: { usersLiked: userId}
                })
                    .then(() => {res.status(200).json({message: 'Like accepted'})})
                    .catch(error => res.status(500).json({ error }))
            }

            if(like === -1 && !sauce.usersDisliked.includes(userId)){
                Sauce.updateOne({ _id : req.params.id},{
                    $inc: {dislikes: 1},
                    $push: { usersDisliked: userId}
                })
                    .then(() => {res.status(200).json({message: 'Like accepted'})})
                    .catch(error => res.status(500).json({ error }))
            }

            if(like === 0 && sauce.usersDisliked.includes(userId)){
                Sauce.updateOne({ _id : req.params.id},{
                    $inc: {dislikes: -1},
                    $pull: { usersDisliked: userId}
                })
                    .then(() => {res.status(200).json({message: 'Like accepted'})})
                    .catch(error => res.status(500).json({ error }))
            }

        })
        .catch(error => res.status(404).json({ error }))
}

// Req ou res est toujours avec body, params, header
// Stocker req.body.userId dans une variable
// et req.body.like

// PersonModel.update(
//     { _id: person._id }, 
//     { $push: { friends: friend } },
//     done
// );