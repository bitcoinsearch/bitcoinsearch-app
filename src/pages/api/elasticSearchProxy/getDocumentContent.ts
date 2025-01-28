import type { NextApiRequest, NextApiResponse } from "next";
import { client } from "@/config/elasticsearch";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error:
        "Invalid request method. This endpoint only supports POST requests.",
    });
  }

  const { id, index = "main" } = req.body;

  if (!id) {
    return res.status(400).json({
      error: "Document ID is required",
    });
  }

  // Select index based on parameter
  const selectedIndex =
    index === "coredev" ? process.env.COREDEV_INDEX : process.env.INDEX;

  try {
    const result = await client.search({
      index: selectedIndex,
      body: {
        // This query handles two different indexing patterns across our ES indexes:
        // - In index A: document's _id matches its content 'id' field
        // - In index B: document's _id is auto-generated, separate from content 'id'
        // TODO: Standardize indexing approach across indexes to simplify this query.
        // When re-indexing, ensure _id consistently matches document's id field.
        query: {
          bool: {
            should: [{ term: { "id.keyword": id } }, { ids: { values: [id] } }],
          },
        },
        size: 1,
      },
    });

    if (result.hits.hits.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Document not found",
      });
    }

    const document = result.hits.hits[0]._source;

    return res.status(200).json({
      success: true,
      data: document,
    });
  } catch (error) {
    console.error(error);
    return res.status(400).json({
      success: false,
      message:
        error.message || "An error occurred while fetching document content",
    });
  }
}
