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

  const { domain, page = 1 } = req.body;

  if (!domain) {
    return res.status(400).json({
      error: "Domain is required",
    });
  }

  const size = 10;
  const from = (page - 1) * size;

  try {
    const result = await client.search({
      index: process.env.INDEX,
      body: {
        from,
        size,
        query: {
          term: { "domain.keyword": domain },
        },
        _source: ["title", "url", "indexed_at"],
        sort: [{ indexed_at: "desc" }],
      },
    });

    const documents = result.hits.hits.map((hit) => hit._source);

    // Handle both possible types of total
    const total =
      typeof result.hits.total === "number"
        ? result.hits.total
        : result.hits.total.value;

    return res.status(200).json({
      success: true,
      data: {
        documents,
        total,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(400).json({
      success: false,
      message:
        error.message || "An error occurred while fetching document details",
    });
  }
}
