const advancedResults = (model, populate) => async (req, res, next) => {
    let query;
    let queryString = JSON.stringify(reqQuery);
    
    queryString = queryString.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `${match}`);
    query = model.find(JSON.parse(queryString));

    if (req.query.select) {
        const fields = req.query.select.split(',').join(' ');
        query = query.select(fields);
    }
    if (req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ');
        query = query.sort(sortBy);
    } else {
        query = query.sort('-createdAt')
    }

    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit,10) || 25;
    const skip = (page - 1) * limit;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Bootcamp.countDocuments();
    query = query.skip(skip).limit(limit);

    if (populate){query = query.populate(populate)}
    const results = await query;
    const pagination = {};

    if (endIndex < total) {
        pagination.next = {
            page: page+1,
            limit
        }
    }
    if (startIndex > 0) {
        pagination.prev = {
            page: page - 1,
            limit
        }
    }
    res.advancedResults = {success: true, count: results.length, pagination, data: results}
};

module.exports = advancedResults;