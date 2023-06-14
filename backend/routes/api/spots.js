const express = require('express');

const { requireAuth } = require('../../utils/auth')

const { Spot, SpotImage, Review, User, ReviewImage, Booking } = require('../../db/models');

const router = express.Router();

router.get('/', async (req, res) => {
    const spotsData = await Spot.findAll({
        include: [{ model: SpotImage, attributes: ['url'] }, { model: Review, attributes: ['stars'] }]
    })

    const newData = spotsData.map(spot => {
        let sum = 0;
        let count = 0;

        const spotobj = spot.toJSON()

        spotobj.previewImage = 'No Images'

        spotobj.SpotImages.forEach(img => {
            spotobj.previewImage = img.url
        })
        spotobj.Reviews.forEach(review => {
            sum += review.stars
            count++
        })
        spotobj.avgRating = sum / count
        delete spotobj.SpotImages
        delete spotobj.Reviews
        return spotobj
    })


    return res.json({Spots: newData})
})


router.get('/current', requireAuth, async (req, res, next) => {
    const spotsData = await Spot.findAll({
        where: { ownerId: req.user.id },
        include: [{ model: SpotImage, attributes: ['url'] }, { model: Review, attributes: ['stars'] }]
    })

    const newData = spotsData.map(spot => {
        let sum = 0;
        let count = 0;

        const spotobj = spot.toJSON()

        spotobj.previewImage = 'No Images'

        spotobj.SpotImages.forEach(img => {
            spotobj.previewImage = img.url
        })
        spotobj.Reviews.forEach(review => {
            sum += review.stars
            count++
        })
        spotobj.avgRating = sum / count
        delete spotobj.SpotImages
        delete spotobj.Reviews
        return spotobj
    })

    return res.json({ Spots: newData })
})


router.get('/:spotId/reviews', async (req, res, next) => {
    const spot = await Spot.findByPk(req.params.spotId)
    if (!spot) {
        const err = new Error(`Spot couldn't be found`)
        err.status = 404
        return next(err)
    }
    const reviews = await Review.findAll(
        {
            where: { spotId: req.params.spotId },
            include: [{ model: User, attributes: ['id', 'firstName', 'lastName'] }, { model: ReviewImage, attributes: ['id', 'url'] }]
        })

        return res.json({ Reviews: reviews })
})


router.get('/:spotId/bookings', requireAuth, async (req, res, next) => {
    const spot = await Spot.findByPk(req.params.spotId)
    if (!spot) {
        const err = new Error(`Spot couldn't be found`)
        err.status = 404
        return next(err)
    }

    if (spot.ownerId === req.user.id) {
        const bookings = await Booking.findAll({
            where: {
                spotId: req.params.spotId
            },
            include: {
                model: User,
                attributes: ['id', 'firstName', 'lastName']
            }
        })
        return res.json({ Bookings: bookings })
    } else {

        const bookings = await Booking.findAll({
            where: {
                spotId: req.params.spotId
            },
            attributes: ['spotId', 'startDate', 'endDate']
        })

        return res.json({ Bookings: bookings })
    }

})



router.get('/:spotId', async (req, res, next) => {

    const spotData = await Spot.findByPk(req.params.spotId, {
        include: [{ model: SpotImage, attributes: ['id', 'url', 'preview'] }, { model: User }, { model: Review }]
    })

    if (!spotData) {
        const err = new Error(`Spot couldn't be found`)
        err.status = 404
        return next(err)
    }

    let sum = 0;
    let count = 0;

    const spotObj = spotData.toJSON()

    spotObj.Reviews.forEach(review => {
        sum += review.stars
        count++
    })

    spotObj.Owner = {
        id: spotObj.User.id,
        firstName: spotObj.User.firstName,
        lastName: spotObj.User.lastName
    }

    delete spotObj.User
    delete spotObj.Reviews

    spotObj.numReviews = count
    spotObj.avgStarRating = sum / count

    return res.json(spotObj)
})


const spotChecker = (req, res, next) => {
    const { address, city, state, country, lat, lng, name, description, price } = req.body

    const errors = {}

    if (!address) errors.address = 'Street address is required'
    if (!city) errors.city = 'City address is required'
    if (!state) errors.state = 'State address is required'
    if (!country) errors.country = 'Country address is required'
    if (lat < -90 || lat > 90) errors.lat = 'Latitude is not valid'
    if (lng < -180 || lng > 180) errors.lng = 'Longitude is not valid'
    if (!name) errors.name = 'Name is required'
    if (name.length > 50) errors.name = 'Name must be less than 50 characters'
    if (!description) errors.description = 'Description is required'
    if (!price) errors.price = 'Price per day is required'

    if (Object.keys(errors).length) {
        const err = new Error()
        err.status = 400
        err.message = 'Bad Request'
        err.errors = errors
        return next(err)
    }

    return next()
}


router.post('/', requireAuth, spotChecker, async (req, res) => {
    const { address, city, state, country, lat, lng, name, description, price } = req.body

    const newSpot = await Spot.create({
        ownerId: req.user.id,
        address,
        city,
        state,
        country,
        lat,
        lng,
        name,
        description,
        price
    })
    res.status(201)
    return res.json(newSpot)

})


router.post('/:spotId/images', requireAuth, async (req, res, next) => {
    const spot = await Spot.findByPk(req.params.spotId)

    if (!spot) {
        const err = new Error(`Spot couldn't be found`)
        err.status = 404
        return next(err)
    }

    const { url, preview } = req.body

    if (spot.ownerId === req.user.id) {
        const newSpotImage = await SpotImage.create({
            spotId: req.params.spotId,
            url,
            preview
        })

        const id = newSpotImage.id

        return res.json({ id, url, preview })

    } else {
        const err = new Error()
        err.status = 403
        err.message = 'Forbidden'
        return next(err)
    }

})


router.post('/:spotId/reviews', requireAuth, async (req, res, next) => {
    const spot = await Spot.findByPk(req.params.spotId)

    const checkForReview = await Review.findOne({
        where: {
            spotId: req.params.spotId,
            userId: req.user.id
        }
    })

    if (checkForReview) {
        const err = new Error(`User already has a review for this spot`)
        err.status = 500
        return next(err)
    }

    if (!spot) {
        const err = new Error(`Spot couldn't be found`)
        err.status = 404
        return next(err)
    }

    if (spot.ownerId != req.user.id) {
    const { review, stars } = req.body
    const errors = {}
    if (!review) errors.review = 'Review text is required'
    if (stars < 1 || stars > 5) errors.stars = 'Stars must be an integer from 1 to 5'
    if (Object.keys(errors).length) {
        const err = new Error()
        err.status = 400,
            err.message = 'Bad Request'
        err.errors = errors
        return next(err)
    }

    const newReview = await Review.create({
        spotId: req.params.spotId,
        userId: req.user.id,
        review,
        stars
    })
    res.status(201)
    return res.json(newReview)
    } else {
        const err = new Error()
        err.title = `Can't review your own spot`
        err.status = 403
        err.message = 'Spot belongs to you'
        return next(err)
    }

})


router.post('/:spotId/bookings', requireAuth, async (req, res, next) => {
    const spot = await Spot.findByPk(req.params.spotId)

    if (!spot) {
        const err = new Error(`Spot couldn't be found`)
        err.status = 404
        return next(err)
    }

    if (spot.ownerId != req.user.id) {
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
                spotId: req.params.spotId
            }
        })
        let conflict = false;
        if (bookings.length) {
            bookings.forEach(booking => {
                const bookingObj = booking.toJSON()
                const errors = {}

                if (startDate >= bookingObj.startDate && startDate <= bookingObj.endDate) {
                    errors.startDate = 'Start date conflicts with an existing booking'
                    conflict = true
                }
                if (endDate <= bookingObj.endDate && endDate >= bookingObj.startDate) {
                    errors.endDate = 'End date conflicts with an existing booking'
                    conflict = true
                }
                if (conflict) {
                    const err = new Error()
                    err.status = 403,
                    err.message = 'Sorry, this spot is already booked for the specified dates'
                    err.errors = errors
                    return next(err)
                }
            })
        }
        if (!conflict) {
        const newBooking = await Booking.create({
            spotId: req.params.spotId,
            userId: req.user.id,
            startDate,
            endDate
        })

        return res.json(newBooking)
    }

    } else {
        const err = new Error('Spot must not belong to you')
        err.status = 403
        err.message = 'Spot belongs to you'
        return next(err)
    }

})


router.put('/:spotId', requireAuth, spotChecker, async (req, res, next) => {
    const spot = await Spot.findByPk(req.params.spotId)

    if (!spot) {
        const err = new Error(`Spot couldn't be found`)
        err.status = 404
        return next(err)
    }

    if (req.user.id === spot.ownerId) {
        const { address, city, state, country, lat, lng, name, description, price } = req.body

        if (address) spot.address = address
        if (city) spot.city = city
        if (state) spot.state = state
        if (country) spot.country = country
        if (lat) spot.lat = lat
        if (lng) spot.lng = lng
        if (name) spot.name = name
        if (description) spot.description = description
        if (price) spot.price = price

        await spot.save()
        return res.json(spot)

    } else {
        const err = new Error()
        err.status = 403
        err.message = 'Forbidden'
        return next(err)
    }
})

router.delete('/:spotId', requireAuth, async (req, res, next) => {
    const spot = await Spot.findByPk(req.params.spotId)

    if (!spot) {
        const err = new Error(`Spot couldn't be found`)
        err.status = 404
        return next(err)
    }

    if (spot.ownerId === req.user.id) {
        await spot.destroy()

        return res.json({ message: 'Successfully deleted' })
    }
    else {
        const err = new Error()
        err.status = 403
        err.message = 'Forbidden'
        return next(err)
    }
})




module.exports = router;
