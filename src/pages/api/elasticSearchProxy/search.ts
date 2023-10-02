
import type { NextApiRequest, NextApiResponse } from "next";
import { client } from "@/config/elasticsearch";
import { buildQuery } from "@/utils/server/apiFunctions";
// import ElasticsearchAPIConnector from "@elastic/search-ui-elasticsearch-connector";
import fs from 'fs';
import { Facet } from "@/types";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  if (req.method !== "POST") {
    return res.status(405).json({ error: 'Invalid request method. The endpoint only supports POST requests.' });
  }

  let queryString = req.body.queryString as string;
  let size = req.body.size;
  let page = req.body.page;
  let filterFields = req.body.filterFields;
  let sortFields = req.body.sortFields;

  const from = page * size;
  let searchQuery = buildQuery({queryString, filterFields, sortFields, from, size });

  try {
    // Call the search method
    const result = await client.search({
      index: process.env.INDEX,
      ...searchQuery,
    });
    
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
