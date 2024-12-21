const router = require('express').Router();

router.use('/mpox', require('./mpox'));

module.exports = router;