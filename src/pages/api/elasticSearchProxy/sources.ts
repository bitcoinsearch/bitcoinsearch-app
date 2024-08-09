import type { NextApiRequest, NextApiResponse } from "next";
import { client } from "@/config/elasticsearch";

interface DomainAggregationBucket {
  key: string;
  doc_count: number;
  last_indexed: {
    value: number;
  };
}

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

  try {
    const result = await client.search({
      index: process.env.INDEX,
      body: {
        size: 0,
        aggs: {
          domains: {
            terms: {
              field: "domain.keyword",
              size: 1000, // Adjust based on the expected number of unique domains
            },
            aggs: {
              last_indexed: {
                max: {
                  field: "indexed_at",
                },
              },
            },
          },
        },
      },
    });

    const domainBuckets = (
      result.aggregations?.domains as {
        buckets: DomainAggregationBucket[];
      }
    ).buckets;

    const sources = domainBuckets.map((bucket) => ({
      domain: bucket.key,
      documentCount: bucket.doc_count,
      lastScraped: bucket.last_indexed.value || null,
    }));

    return res.status(200).json({
      success: true,
      data: {
        result: sources,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(400).json({
      success: false,
      message: error.message || "An error occurred while fetching sources data",
    });
  }
}
