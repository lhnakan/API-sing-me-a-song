const router = require('express').Router();

const genresController = require('../controllers/genresController');

router.post("/", genresController.create);

module.exports = router;