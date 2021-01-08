function sumTotalScore(list) {
    let total = 0;
    list.forEach(l => {
        total += l.score;
    })

    return total;
}

module.exports = { sumTotalScore };