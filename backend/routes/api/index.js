const router = require('express').Router();

//Test router
router.post('/test', function(req, res) {
    res.json({ requestBody: req.body });
  });

module.exports = router;
