function formatToAddInTable(genres, recommendationId) {
    const result = []
    genres.forEach(g => {
        result.push({ genreId: g.id, recommendationId })
    })

    return result;
}

module.exports = { formatToAddInTable };