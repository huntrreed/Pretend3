const router = require('express').Router();
const userRoutes = require('./userRoutes');
const dogInfo = require('./dogInfoRoutes');

router.use('/users', userRoutes);
router.use('/dogInfo', dogInfo);

module.exports = router;
