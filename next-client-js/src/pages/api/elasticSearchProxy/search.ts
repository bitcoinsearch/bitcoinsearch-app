
import type { NextApiRequest, NextApiResponse } from "next";
import connector from "./connector";
// import ElasticsearchAPIConnector from "@elastic/search-ui-elasticsearch-connector";



export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // const connector = new ElasticsearchAPIConnector({
  //   // Either specify the cloud id or host to connect to elasticsearch
  //   cloud: {
  //     id: process.env.CLOUD_ID, // cloud id found under your cloud deployment overview page
  //   },
  //   // host: "http://localhost:9200", // host url for the Elasticsearch instance
  //   index: process.env.INDEX, // index name where the search documents are contained
  //   apiKey: process.env.API_KEY, // Optional. apiKey used to authorize a connection to Elasticsearch instance.
  //   // This key will be visible to everyone so ensure its setup with restricted privileges.
  //   // See Authentication section for more details.
  // });
  const { query, options } = req.body;
  console.log({query, options})
  
  if (req.method !== "POST") {
    return res.status(405).json({ error: 'Invalid request method. The endpoint only supports POST requests.' });
  }

  try {
    // Call the onSearch method function
    const response = await connector.onSearch(query, options);
    console.log("try block went")
    console.log(response)
    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error occurred while creating fork" });
  }
}
