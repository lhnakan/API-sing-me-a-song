const router = require('express').Router();

const genresController = require('../controllers/genresController');
const sanitiseObjStrings  = require('../utils/stringStrip');
const genreSchemas = require('../schemas/genreSchemas');
const NotFound = require('../errors/NotFound');

router.post("/", async (req, res) => {
    const sanitisedBody = sanitiseObjStrings(req.body);
        
    const { error } = genreSchemas.validate(sanitisedBody);
    if(error) return res.status(422).json({ error: error.details[0].message });

    const { name } = sanitisedBody;
    try {
        const result = await genresController.create(name);
        
        if(!result[1]) return res.status(200).send(result[0]);

        res.status(201).send(result[0]);
    } catch(err) {
        console.log(err);
        res.sendStatus(500);
    }
});


router.get("/", async (req, res) => {
    try {
        const result = await genresController.getAll();
        return res.status(200).send(result);
    }  catch(err) {
        console.log(err);
        return res.sendStatus(500);
    }
});

router.get("/:id", async (req, res) => {
    const id = req.params.id;
    try {
        const result = await genresController.getGenreRecommendations(id);
        return res.status(200).send(result);
    }  catch(err) {
        if(err instanceof NotFound) {
            return res.sendStatus(404);
        } else {
            return res.sendStatus(500);
        }
    }
});

module.exports = router;