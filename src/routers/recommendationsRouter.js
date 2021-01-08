const router = require('express').Router();

const recommendationsController = require('../controllers/recommendationsController');
const genresController = require('../controllers/genresController');
const recommendationSchemas = require('../schemas/recommendationSchemas');
const sanitiseObjStrings = require('../utils/stringStrip');

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

module.exports = router;