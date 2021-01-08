const Genre = require('../models/Genre');
const GenreRecommend = require('../models/GenreRecommend');
const Recommendation = require('../models/Recommendation');

Recommendation.belongsToMany(Genre, { through: GenreRecommend });
Genre.belongsToMany(Recommendation, { through: GenreRecommend });