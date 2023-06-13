const express = require('express');

const { setTokenCookie, restoreUser } = require('../../utils/auth');
const { handleValidationErrors } = require('../../utils/validation');
const { requireAuth } = require('../../utils/auth')

const { Spot , SpotImage, Review, User, ReviewImage } = require('../../db/models');

const router = express.Router();


router.get('/current', requireAuth, async (req, res, next) => {
    const reviewData = await Review.findAll({
        where: {userId: req.user.id},
        include: [{model: User, attributes: ['id', 'firstName', 'lastName']}, {model: Spot, attributes: {exclude: ['createdAt', 'updatedAt', 'description']}}, {model: ReviewImage, attributes: ['id', 'url']}]
    })

    const newData = []
    reviewData.forEach(spot => {
        const spotObj = spot.toJSON()
        newData.push(spotObj)
        })
    newData.forEach(spot => {
        spot.Spot.previewImage = 'No Images'
        if (spot.ReviewImages.length) {
            spot.ReviewImages.forEach(review => {
                spot.Spot.previewImage = review.url
            })
        }
    })


    res.json({Reviews: newData})
})




module.exports = router;
