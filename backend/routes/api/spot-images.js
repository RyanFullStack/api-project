const express = require('express');

const { requireAuth } = require('../../utils/auth')

const { Spot, SpotImage} = require('../../db/models');

const router = express.Router();

router.delete('/:imageId', requireAuth, async(req, res, next) => {
    const image = await SpotImage.findByPk(req.params.imageId)
    if (!image) {
        const err = new Error()
        err.status = 404
        err.message = `Spot Image couldn't be found`
        return next(err)
    }
    const spot = await Spot.findByPk(image.spotId)
    if (spot.ownerId === req.user.id) {
        await image.destroy()
        return res.json({message: 'Successfully deleted'})
    } else {
        const err = new Error()
        err.status = 403
        err.message = 'Forbidden'
        return next(err)
    }
})



module.exports = router;
