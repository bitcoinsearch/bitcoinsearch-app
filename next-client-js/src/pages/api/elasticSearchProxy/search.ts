
import type { NextApiRequest, NextApiResponse } from "next";
import { client } from "@/config/elasticsearch";
import { buildQuery } from "@/utils/server/apiFunctions";
// import ElasticsearchAPIConnector from "@elastic/search-ui-elasticsearch-connector";


export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  let searchString = req.body.searchString;
  let size = req.body.size;
  let from = req.body.from;
  let facets = req.body.facets;

  let searchQuery = buildQuery(searchString, facets);
  
  if (req.method !== "POST") {
    return res.status(405).json({ error: 'Invalid request method. The endpoint only supports POST requests.' });
  }

  try {
    // Call the search method
    const result = await client.search({
      index: process.env.INDEX,
      body: searchQuery,
      size,
      from,
    });
    console.log({result})
    return res.status(200).json({
      success: true,
      data: {
        result,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(400).json({
      success: false,
      message: error.errmsg || error.errors || error.message,
    });
  }
}
