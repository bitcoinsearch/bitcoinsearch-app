import type { NextApiRequest, NextApiResponse } from "next";
import { client } from "@/config/elasticsearch";
import { ViewMode } from "@/types";

interface ThreadBucket {
  key: string;
  doc_count: number;
  latest_doc: {
    value: number;
  };
  docs: {
    hits: {
      hits: Array<{
        _source: {
          thread_url: string;
        };
      }>;
    };
  };
}

interface ThreadAggregationResponse {
  aggregations: {
    threads: {
      buckets: ThreadBucket[];
    };
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

  const {
    domain,
    page = 1,
    viewMode = ViewMode.FLAT,
    threadsPage = 1,
  } = req.body;

  if (!domain) {
    return res.status(400).json({
      error: "Domain is required",
    });
  }

  const size = 10;
  const from = (page - 1) * size;

  // Create query based on view mode
  const createQuery = (additionalTerms = {}) => {
    if (viewMode === ViewMode.SUMMARIES) {
      return {
        bool: {
          must: [
            { term: { "domain.keyword": domain } },
            { term: { "type.keyword": "combined-summary" } },
          ],
        },
      };
    }

    return {
      bool: {
        must: [
          { term: { "domain.keyword": domain } },
          ...(Object.keys(additionalTerms).length > 0 ? [additionalTerms] : []),
        ],
        must_not: [{ term: { "type.keyword": "combined-summary" } }],
      },
    };
  };

  try {
    if (viewMode === ViewMode.THREADED) {
      // Thread view
      const threadAggregation = (await client.search({
        index: process.env.INDEX,
        body: {
          query: createQuery(),
          size: 0,
          aggs: {
            threads: {
              terms: {
                field: "thread_url.keyword",
                size: 10000,
                order: { "latest_doc.value": "desc" },
              },
              aggs: {
                latest_doc: {
                  max: { field: "indexed_at" },
                },
                docs: {
                  top_hits: {
                    size: 1,
                    sort: [{ indexed_at: "desc" }],
                    _source: ["thread_url"],
                  },
                },
              },
            },
          },
        },
      })) as unknown as ThreadAggregationResponse;

      const threadBuckets = threadAggregation.aggregations.threads.buckets;
      const totalThreads = threadBuckets.length;
      const threadsPerPage = 10;
      const startThread = (threadsPage - 1) * threadsPerPage;
      const endThread = startThread + threadsPerPage;
      const paginatedThreads = threadBuckets.slice(startThread, endThread);

      const threadUrls = paginatedThreads.map((bucket) => bucket.key);
      const documentsResult = await client.search({
        index: process.env.INDEX,
        body: {
          query: createQuery({
            terms: {
              "thread_url.keyword": threadUrls,
            },
          }),
          size: 1000,
          sort: [{ indexed_at: "desc" }],
          _source: ["title", "url", "indexed_at", "thread_url", "type"],
        },
      });

      const documents = documentsResult.hits.hits.map((hit) => hit._source);

      return res.status(200).json({
        success: true,
        data: {
          documents,
          total: totalThreads,
          viewMode: ViewMode.THREADED,
        },
      });
    } else {
      // Flat or summaries view
      const result = await client.search({
        index: process.env.INDEX,
        body: {
          from,
          size,
          query: createQuery(),
          _source: ["title", "url", "indexed_at", "thread_url", "type"],
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
          viewMode,
        },
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(400).json({
      success: false,
      message:
        error.message || "An error occurred while fetching document details",
    });
  }
}
