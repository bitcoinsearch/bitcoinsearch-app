const elasticsearch = require("@utils/elasticsearch");
const client = elasticsearch.get()
const logger = require("@utils/logger");

async function search(request, response){
    try {
        const result = await client.search({
            index: 'bitcoin-search-index-revamped',
            query: {
              match: { authors: 'maxwell' }
            }
        });
        
        return response.status(200).json({
            success: true,
            data: {
              result
            }
        });
        // let documents = await ({
        //     search: request.body
        // })

    } catch (error) {

        logger.error({ description: 'Search request failed', error });
    
        return response.status(400).json({
          success: false,
          message: error.errmsg || error.errors || error.message
        });
    }
}

module.exports.search = search;