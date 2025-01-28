import type { NextApiRequest, NextApiResponse } from "next";
import { client } from "@/config/elasticsearch";
import { buildQuery } from "@/utils/server/apiFunctions";

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

  // Select index based on parameter
  const selectedIndex =
    index === "coredev" ? process.env.COREDEV_INDEX : process.env.INDEX;

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
    // Call the search method
    const result = await client.search({
      index: selectedIndex,
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
