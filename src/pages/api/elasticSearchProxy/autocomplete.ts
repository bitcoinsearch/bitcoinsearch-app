
// import { client } from "@/config/elasticsearch";
// import type { NextApiRequest, NextApiResponse } from "next";


// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   const { query, options } = req.body;
  
//   if (req.method !== "POST") {
//     return res.status(405).json({ error: 'Invalid request method. The endpoint only supports POST requests.' });
//   }

//   try {
//     // Call the autocomplete method
//     // const response = await connector.onAutocomplete(query, options);
//     const result = await client.se
//     res.json(response);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Error occurred while creating fork" });
//   }
// }
