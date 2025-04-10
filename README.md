![bitcoin-search-home](https://github.com/bitcoinsearch/bitcoinsearch-app/assets/18506343/65833946-63a2-400e-9e91-023f96cac9b2)

# Welcome to Bitcoin Search

## Features

- **Elasticsearch Integration**: Directly interfaces with Elasticsearch, leveraging the dataset curated and indexed by the [scraper](https://github.com/bitcoinsearch/scraper). This integration facilitates robust full-text search capabilities, supporting complex queries, filters (authors, domains), and sorting options.
- **URL-Driven Search State**: Manages the search state through URL parameters using NextJS's router, enabling shareable search URLs and intuitive user navigation.
- **Proxy Server for Security**: Implements a [server-side proxy layer](src/pages/api/elasticSearchProxy/search.ts) for Elasticsearch queries, abstracting away direct access to the Elasticsearch cluster and enriching queries with necessary filters and parameters.

## Getting started

The search engine is built using NextJS and connects to elasticsearch

The `.env` looks like:

```bash
API_KEY="0000000000000000000164dbb81fbea0a98f09eae1ff2a51493cb3a633523891=="
CLOUD_ID="Deployment_name:0000000000000000000365ff7535528e43b5c6793e840c2b2a0a38e1648c930f"
```

### Indexes Configuration

The application supports multiple Elasticsearch indexes. The configuration for these indexes can be found in [`src/config/config.ts`](/src/config/config.ts). To add or modify indexes, update the `INDEXES` object.

## Installation

```bash
npm install
npm run dev
```

## Contribute 🚀

We welcome contributors to the project. Open an issue or PR to help us out.

## License 📗

This is MIT licensed.
