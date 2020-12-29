const express = require('express');

const router = express.Router();
const likesController = require('../controller/likes_controller');

router.post('/toggle', likesController.toogleLike);

module.exports = router;