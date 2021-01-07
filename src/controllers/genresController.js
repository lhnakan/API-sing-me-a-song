const Genre = require('../models/Genre');

const sanitiseObjStrings  = require('../utils/stringStrip');
const genreSchemas = require('../schemas/genreSchemas');

async function create(req, res) {
    const sanitisedBody = sanitiseObjStrings(req.body);
    
    const { error } = genreSchemas.validate(sanitisedBody);
    if(error) return res.status(422).json({ error: error.details[0].message });

    const { name } = sanitisedBody;

    try {
        const checkGenre = await Genre.findOne({ where: { name } })
        if(checkGenre) return res.sendStatus(409);

        const result = await Genre.create({ name });
        return res.status(201).send(result);
    } catch(err) {
        console.log(err);
        return res.sendStatus(500);
    }
}

async function getAll(req, res) {
    try {
        const genres = await Genre.findAll({ order: ['name'] });
        return res.status(200).send(genres);
    } catch(err) {
        console.log(err);
        return res.sendStatus(500);
    }
}

module.exports = { create, getAll };