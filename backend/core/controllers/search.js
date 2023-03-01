async function _search(request, response){
    try {
        let documents = await search({
            search: request.body
        })

        logger.info({
            description: 'Search request completed successfullly'
          });
        
        
    } catch (error) {

        logger.error({ description: 'Search request failed', error });
    
        return response.status(400).json({
          success: false,
          message: error.errmsg || error.errors || error.message
        });
      }
}