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
    else {
        const err = new Error()
        err.status = 403
        err.message = 'Forbidden'
        next(err)
    }
})


router.put('/:reviewId', requireAuth, async(req, res, next) => {
    const foundReview = await Review.findByPk(req.params.reviewId)
    if (!foundReview) {
        const err = new Error(`Review couldn't be found`)
        err.status = 404
        next(err)
    }

    if (foundReview.userId === req.user.id) {
        const { review, stars } = req.body
        const errors = {}
        if (!review) errors.review = 'Review text is required'
        if (!stars || (stars < 1 || stars > 5)) errors.stars = 'Stars must be an integer from 1 to 5'
        if (Object.keys(errors).length) {
            const err = new Error()
            err.message = 'Bad Request'
            err.errors = errors
            err.status = 400
            next(err)
        }
        foundReview.review = review
        foundReview.stars = stars

        await foundReview.save()
        res.json(foundReview)
    }
    else {
        const err = new Error()
        err.status = 403
        err.message = 'Forbidden'
        next(err)
    }
})


router.delete('/:reviewId', requireAuth, async(req, res, next) => {
    const foundReview = await Review.findByPk(req.params.reviewId)
    if (!foundReview) {
        const err = new Error(`Review couldn't be found`)
        err.status = 404
        next(err)
    }

    if (foundReview.userId === req.user.id) {
        await foundReview.destroy()
        res.json({message: 'Successfully deleted'})
    }
    else {
        const err = new Error()
        err.status = 403
        err.message = 'Forbidden'
        next(err)
    }

})


module.exports = router;
