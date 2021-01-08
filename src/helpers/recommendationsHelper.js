function formatToAddInTable(genres, recommendationId) {
    const result = []
    genres.forEach(g => {
        result.push({ genreId: g.id, recommendationId })
    })

    return result;
}

function draw(n1, n2) {
    return Math.floor(Math.random() * n1 + n2);
}

module.exports = { formatToAddInTable, draw };