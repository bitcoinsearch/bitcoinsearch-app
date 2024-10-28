import { Client } from "@elastic/elasticsearch";

let client: Client;

if (process.env.CLOUD_ID && process.env.API_KEY) {
  client = new Client({
    cloud: {
      id: process.env.CLOUD_ID, // cloud id found under your cloud deployment overview page
    },
    auth: { apiKey: process.env.API_KEY },
  });
} else {
  client = new Client({
    node: process.env.ES_LOCAL_URL,
  });
}

export { client };
