import { Client } from "@elastic/elasticsearch";

export const client = new Client({
  cloud: {
    id: process.env.CLOUD_ID, // cloud id found under your cloud deployment overview page
  },
  auth: { apiKey: process.env.API_KEY },
});
