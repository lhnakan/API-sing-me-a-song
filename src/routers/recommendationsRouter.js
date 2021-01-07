const router = require('express').Router();

const recommendationsController = require('../controllers/recommendationsController');

router.post("/", recommendationsController.create);

module.exports = router;