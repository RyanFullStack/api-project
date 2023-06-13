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
        if (spot.Spot) {
        spot.Spot.previewImage = 'No Images'
        }
        if (spot.ReviewImages.length) {
            spot.ReviewImages.forEach(review => {
                spot.Spot.previewImage = review.url
            })
        }
    })


    res.json({Reviews: newData})
})


router.post('/:reviewId/images', requireAuth, async(req, res, next) => {
    const review = await Review.findByPk(req.params.reviewId)
    if (!review) {
        const err = new Error(`Review couldn't be found`)
        err.status = 404
        next(err)
    }

    const revImgCount = await ReviewImage.count({
        where: {
            reviewId: req.params.reviewId
        }
    })
    if (revImgCount >= 10) {
        res.status(403)
        res.json({message: 'Maximum number of images for this resource was reached'})
    }

    if (review.userId === req.user.id) {
        const { url } = req.body
        const newReviewImage = await ReviewImage.create({
            reviewId: req.params.reviewId,
            url
        })
        const id = newReviewImage.id

        res.json({id, url})
    }

    res.status(403)
    res.json({message: 'Forbidden'})
})


module.exports = router;
