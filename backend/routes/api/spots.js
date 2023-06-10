const express = require('express');

const { setTokenCookie, restoreUser } = require('../../utils/auth');
const { handleValidationErrors } = require('../../utils/validation');

const { Spot , SpotImage, Review } = require('../../db/models');

const router = express.Router();

router.get('/', async (req, res) => {
    const spotsData = await Spot.findAll({
        include: [{model: SpotImage, attributes: ['url']}, {model: Review, attributes: ['stars']}]
    })

    const newData = spotsData.map(spot => {
        let sum = 0;
        let count = 0;

        const spotobj = spot.toJSON()

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



module.exports = router;
