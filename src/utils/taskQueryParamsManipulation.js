const mapTaskQueryParamsForPopulateMethod = (queryParam) => {
    const mappedQueryParams = {};
    const mappedSortingParams= {};
    if (queryParam.completed) {
        mappedQueryParams.completed = queryParam.completed === 'true' ? true : false
    }
    if (queryParam.description) {
        mappedQueryParams.description = queryParam.description.replace('-', ' ')
    }
    if (queryParam.sortBy) {
        mappedSortingParams[queryParam.sortBy] = queryParam.order === 'asc' ? 1 : -1
    }

    return {
        mappedQueryParams,
        mappedSortingParams
    }
}

module.exports = mapTaskQueryParamsForPopulateMethod;