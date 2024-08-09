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

  const { url } = req.body;

  if (!url) {
    return res.status(400).json({
      error: "URL is required",
    });
  }

  try {
    const result = await client.search({
      index: process.env.INDEX,
      body: {
        query: {
          term: { "url.keyword": url },
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
