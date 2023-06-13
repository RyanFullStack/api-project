const express = require('express');

const { requireAuth } = require('../../utils/auth')

const { Review, ReviewImage } = require('../../db/models');

const router = express.Router();

router.delete('/:imageId', requireAuth, async (req, res, next) => {
    const image = await ReviewImage.findByPk(req.params.imageId)
    if (!image) {
        const err = new Error()
        err.status = 404
        err.message = `Review Image couldn't be found`
        return next(err)
    }
    const review = await Review.findByPk(image.reviewId)
    if (review.userId === req.user.id) {
        await image.destroy()
        return res.json({ message: 'Successfully deleted' })
    } else {
        const err = new Error()
        err.status = 403
        err.message = 'Forbidden'
        return next(err)
    }

})

module.exports = router;
