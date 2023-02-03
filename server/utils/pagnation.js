function createPage(total, start, count, data) {
    return {
        total,
        start,
        count,
        data
    }
}

module.exports = {
    createPage,
}