const express = require('express');

const { setTokenCookie, restoreUser } = require('../../utils/auth');
const { handleValidationErrors } = require('../../utils/validation');
const { requireAuth } = require('../../utils/auth')

const { Spot , SpotImage, Review, User, ReviewImage, Booking} = require('../../db/models');
const booking = require('../../db/models/booking');

const router = express.Router();

router.get('/current', requireAuth, async (req, res, next) => {
    const bookings = await Booking.findAll({
        where: {userId: req.user.id},
        include: {model: Spot, attributes: {exclude: ['createdAt', 'updatedAt', 'description']}, include: {model: SpotImage}}
    })

    const newData = bookings.map(spot => {
        const spotObj = spot.toJSON()

        if (spotObj.Spot) {
        spotObj.Spot.previewImage = 'No Images'


        spotObj.Spot.SpotImages.forEach(img => {
            spotObj.Spot.previewImage = img.url
        })
        delete spotObj.Spot.SpotImages
        return spotObj
    }
    })


    res.json(newData)
})

router.put('/:bookingId', requireAuth, async(req, res, next) => {
    const foundBooking = await Booking.findByPk(req.params.bookingId)
    if (!foundBooking) {
        const err = new Error(`Booking couldn't be found`)
        err.status = 404
        next(err)
    }

    if (foundBooking.endDate < new Date().toISOString().split('T')[0]) {
        const err = new Error(`Past bookings can't be modified`)
        err.status = 403
        return next(err)
    }

    if (foundBooking.userId === req.user.id) {
        const { startDate, endDate } = req.body
        const errors = {}
        if (!startDate) errors.startDate = 'Start Date must be provided'
        if (!endDate) errors.endDate = 'End Date must be provided'
        if (startDate < new Date().toISOString().split('T')[0] || endDate < new Date().toISOString().split('T')[0]) {
            errors.past = 'Date cannot be in the past'
        }
        if (startDate && endDate && startDate > endDate) errors.endData = 'endDate cannot be on or before startDate'
        if (Object.keys(errors).length) {
            const err = new Error()
            err.status = 400,
            err.message = 'Bad Request'
            err.errors = errors
            return next(err)
        }

        const bookings = await Booking.findAll({
            where: {
                spotId: foundBooking.spotId
            }
        })

        if (bookings.length) {
            let conflict = false
            let err;
            bookings.forEach(booking => {
                const bookingObj = booking.toJSON()
                const errors = {}

                if (booking.userId !== req.user.id) {
                if (startDate >= bookingObj.startDate && startDate <= bookingObj.endDate) {
                    errors.startDate = 'Start date conflicts with an existing booking'
                }
                if (endDate <= bookingObj.endDate && endDate >= bookingObj.startDate) {
                    errors.endDate = 'End date conflicts with an existing booking'
                }
                if (Object.keys(errors).length) {
                    err = new Error()
                    err.status = 403,
                    err.message = 'Sorry, this spot is already booked for the specified dates'
                    err.errors = errors
                    conflict = true
                }}
            })
            if (conflict) {
                return next(err);
            }
        }

        foundBooking.startDate = startDate
        foundBooking.endDate = endDate

        await foundBooking.save()

        res.json(foundBooking)
    }
    else {
        const err = new Error()
        err.status = 403
        err.message = 'Forbidden'
        next(err)
    }

})



module.exports = router;
