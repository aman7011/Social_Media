const express = require('express');

const router = express.Router();
const homeController = require('../controller/home_controller');
console.log("Router Loaded");

router.get('/', homeController.home);
router.use('/users', require('./users'));
router.use('/posts', require('./posts'));
router.use('/comments', require('./comments'));
router.use('/likes', require('./likes'));

router.use('/api', require('./api'));
//for any further routes, access from here
//router.use('/routerName', require('./fileName'));


module.exports = router;