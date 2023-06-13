const express = require('express');

const { setTokenCookie, restoreUser } = require('../../utils/auth');
const { handleValidationErrors } = require('../../utils/validation');
const { requireAuth } = require('../../utils/auth')

const { Spot , SpotImage, Review, User, ReviewImage, Booking} = require('../../db/models');

const router = express.Router();

router.get('/current', requireAuth, async (req, res, next) => {
    const bookings = await Booking.findAll({
        where: {userId: req.user.id},
        include: {model: Spot, attributes: {exclude: ['createdAt', 'updatedAt', 'description']}, include: {model: SpotImage}}
    })

    const newData = bookings.map(spot => {
        const spotObj = spot.toJSON()

        spotObj.Spot.previewImage = 'No Images'

        spotObj.Spot.SpotImages.forEach(img => {
            spotObj.Spot.previewImage = img.url
        })
        delete spotObj.Spot.SpotImages
        return spotObj
    })


    res.json(newData)
})


module.exports = router;
