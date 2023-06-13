const express = require('express');

const { setTokenCookie, restoreUser } = require('../../utils/auth');
const { handleValidationErrors } = require('../../utils/validation');
const { requireAuth } = require('../../utils/auth')

const { Spot , SpotImage, Review, User, ReviewImage, Booking } = require('../../db/models');

const router = express.Router();

router.get('/', async (req, res) => {
    const spotsData = await Spot.findAll({
        include: [{model: SpotImage, attributes: ['url']}, {model: Review, attributes: ['stars']}]
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


    res.json(newData)
})


router.get('/current', requireAuth, async (req, res, next) => {
    const spotsData = await Spot.findAll({
        where: {ownerId: req.user.id},
        include: [{model: SpotImage, attributes: ['url']}, {model: Review, attributes: ['stars']}]
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

    res.json({Spots: newData})
})


router.get('/:spotId/reviews', async (req, res, next) => {
    const spot = await Spot.findByPk(req.params.spotId)
    if (!spot) {
        const err = new Error(`Spot couldn't be found`)
        err.status = 404
        next(err)
    }
    const reviews = await Review.findAll(
        {where: {spotId: req.params.spotId},
        include: [{model: User, attributes: ['id', 'firstName', 'lastName']}, {model: ReviewImage, attributes: ['id', 'url']}]
        })

    res.json({Reviews: reviews})
})


router.get('/:spotId/bookings', requireAuth, async(req, res, next) => {
    const spot = await Spot.findByPk(req.params.spotId)
    if (!spot) {
        const err = new Error(`Spot couldn't be found`)
        err.status = 404
        next(err)
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
        res.json({Bookings: bookings})
    } else {

    const bookings = await Booking.findAll({
        where: {
            spotId: req.params.spotId
        },
        attributes: ['spotId', 'startDate', 'endDate']
    })

    res.json({Bookings: bookings})
}

})



router.get('/:spotId', async (req, res, next) => {

    const spotData = await Spot.findByPk(req.params.spotId, {
        include: [{model: SpotImage, attributes: ['id', 'url', 'preview']},{model:User}, {model:Review}]
    })

    if (!spotData) {
        const err = new Error(`Spot couldn't be found`)
        err.status = 404
        next(err)
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

    res.json(spotObj)
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
        next(err)
    }

    next()
}


router.post('/', requireAuth, spotChecker, async(req, res) => {
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
    res.json(newSpot)

})


router.post('/:spotId/images', requireAuth, async(req, res, next) => {
    const spot = await Spot.findByPk(req.params.spotId)

    if (!spot) {
        const err = new Error(`Spot couldn't be found`)
        err.status = 404
        next(err)
    }

    const {url, preview} = req.body

    if (spot.ownerId === req.user.id) {
    const newSpotImage = await SpotImage.create({
        spotId: req.params.spotId,
        url,
        preview
    })

    const id = newSpotImage.id

    res.json({id, url, preview})

    } else {
        const err = new Error()
        err.status = 403
        err.message = 'Forbidden'
        next(err)
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
        next(err)
    }

    if (!spot) {
        const err = new Error(`Spot couldn't be found`)
        err.status = 404
        next(err)
    }

    const { review, stars } = req.body

    const errors = {}
    if (!review) errors.review = 'Review text is required'
    if (stars < 1 || stars > 5) errors.stars = 'Stars must be an integer from 1 to 5'
    if (Object.keys(errors).length) {
        const err = new Error()
        err.status = 400,
        err.message = 'Bad Request'
        err.errors = errors
        next(err)
    }

    const newReview = await Review.create({
        spotId: req.params.spotId,
        userId: req.user.id,
        review,
        stars
    })
    res.status(201)
    res.json(newReview)

})


router.post('/:spotId/bookings', requireAuth, async (req, res, next) => {
    const spot = await Spot.findByPk(req.params.spotId)

    if (!spot) {
        const err = new Error(`Spot couldn't be found`)
        err.status = 404
        next(err)
    }

    if (spot.ownerId != req.user.id) {
    const { startDate, endDate } = req.body
    const errors = {}
    if (!startDate) errors.startDate = 'Start Date must be provided'
    if (!endDate) errors.endDate = 'End Date must be provided'
    if (startDate && endDate && startDate > endDate) errors.endData = 'endDate cannot be on or before startDate'
    if (Object.keys(errors).length) {
        const err = new Error()
        err.status = 400,
        err.message = 'Bad Request'
        err.errors = errors
        next(err)
    }

    const bookings = await Booking.findAll({
        where: {
            spotId: req.params.spotId
        }
    })
    if (bookings.length) {
        bookings.forEach(booking => {
            const bookingObj = booking.toJSON()
            const errors = {}
            console.log(bookingObj.startDate, bookingObj.endDate)
            if (startDate >= bookingObj.startDate && startDate <= bookingObj.endDate) {
                errors.startDate = 'Start date conflicts with an existing booking'
            }
            if (endDate <= bookingObj.endDate && endDate >= bookingObj.startDate) {
                errors.endDate = 'End date conflicts with an existing booking'
            }
            if (Object.keys(errors).length) {
                const err = new Error()
                err.status = 403,
                err.message = 'Sorry, this spot is already booked for the specified dates'
                err.errors = errors
                next(err)
            }
        })
    }

    const newBooking = await Booking.create({
        spotId: req.params.spotId,
        userId: req.user.id,
        startDate,
        endDate
    })

    res.json(newBooking)

    } else {
        const err = new Error('Spot must not belong to you')
        err.status = 403
        err.message = 'Spot belongs to you'
        next(err)
    }

})


router.put('/:spotId', requireAuth, spotChecker, async(req, res, next) => {
    const spot = await Spot.findByPk(req.params.spotId)

    if (!spot) {
        const err = new Error(`Spot couldn't be found`)
        err.status = 404
        next(err)
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
    res.json(spot)

    } else {
        const err = new Error()
        err.status = 403
        err.message = 'Forbidden'
        next(err)
    }
})

router.delete('/:spotId', requireAuth, async (req, res, next) => {
    const spot = await Spot.findByPk(req.params.spotId)

    if (!spot) {
        const err = new Error(`Spot couldn't be found`)
        err.status = 404
        next(err)
    }

    if (spot.ownerId === req.user.id) {
    await spot.destroy()

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
