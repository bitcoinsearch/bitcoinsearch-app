import type { NextApiRequest, NextApiResponse } from "next";
import { client } from "@/config/elasticsearch";
import { buildQuery } from "@/utils/server/apiFunctions";
import { getIndexConfig, IndexType } from "@/config/config";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error:
        "Invalid request method. The endpoint only supports POST requests.",
    });
  }

  const {
    queryString,
    size,
    page,
    filterFields,
    sortFields,
    aggregationFields,
    index = "main",
  } = req.body;

  // Get the actual index name from our config
  const indexConfig = getIndexConfig(index as IndexType);

  const from = page * size;
  let searchQuery = buildQuery({
    queryString,
    filterFields,
    sortFields,
    from,
    size,
    aggregationFields,
  });

  try {
    const result = await client.search({
      index: indexConfig.indexName,
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
