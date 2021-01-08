const router = require('express').Router();

const recommendationsController = require('../controllers/recommendationsController');
const genresController = require('../controllers/genresController');
const recommendationSchemas = require('../schemas/recommendationSchemas');
const sanitiseObjStrings = require('../utils/stringStrip');
const NotFound = require('../errors/NotFound');

router.post("/", async (req, res) => { 
    const sanitisedBody = sanitiseObjStrings(req.body);

    const { error } = recommendationSchemas.newRecommend.validate(sanitisedBody);
    if(error) return res.status(422).json({ error: error.details[0].message });

    const { name, youtubeLink, genresIds } = sanitisedBody;
    try {
        const checkedIds = await genresController.verifyGenres(genresIds);
        if(checkedIds.length === 0) return res.sendStatus(406);

        const { result, created } = await recommendationsController.create(name, youtubeLink, checkedIds);
        
        if(!created) return res.status(200).send(result);

        res.status(201).send(result);
    } catch(err) {
        console.log(err);
        return res.sendStatus(500);
    }
});

router.post("/:id/upvote", async (req, res) => { 
    const id = req.params.id;
    try {
        const result = await recommendationsController.upScore(id)
        res.status(201).send(result);
    }catch(err) {
        if(err instanceof NotFound) {
            return res.sendStatus(404);
        } else {
            return res.sendStatus(500);
        }
    }
});

router.post("/:id/downvote", async (req, res) => { 
    const id = req.params.id;
    try {
        const result = await recommendationsController.downScore(id);
        if(!result) return res.sendStatus(200);

        res.status(201).send(result);
    }catch(err) {
        if(err instanceof NotFound) {
            return res.sendStatus(404);
        } else {
            return res.sendStatus(500);
        }
    }
});

router.get("/random", async (req, res) => {
    try {
        const result = await recommendationsController.random();
        res.send(result)
    } catch(err) {
        if(err instanceof NotFound) {
            return res.sendStatus(404);
        } else {
            console.log(err)
            return res.sendStatus(500);
        }
    }
});

router.get("/genres/:id/random", async (req, res) => {
    const id = req.params.id;
    try {
        const result = await recommendationsController.randomInGenre(id);
        res.status(200).send(result)
    } catch(err) {
        if(err instanceof NotFound) {
            return res.sendStatus(404);
        } else {
            console.log(err)
            return res.sendStatus(500);
        }
    }
});

router.get("/top/:amount", async (req, res) => {
    const amount = req.params.amount;
    try {
        const result = await recommendationsController.topScores(amount);
        res.status(200).send(result)
    } catch(err) {
        if(err instanceof NotFound) {
            return res.sendStatus(404);
        } else {
            return res.sendStatus(500);
        }
    }
});

module.exports = router;