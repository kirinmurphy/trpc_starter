import { z } from "zod";

const nasaApiKey = process.env.NASA_API_KEY;

const url = `https://api.nasa.gov/planetary/apod?api_key=${nasaApiKey}`;

// const schema = z.object({
//   message: z.string(),
//   timestamp: z.number(),
//   iss_position: z.object({
//     latitude: z.string(),
//     longitude: z.string()
//   })
// });

const schema = z.object({
  date: z.string(),
  explanation: z.string(),
  media_type: z.string(),
  service_version: z.string(),
  title: z.string(),
  url: z.string()
});

export const nasaDailySpaceEndpoint = { url, schema };

export type NasaDailySpaceSchemaType = z.infer<typeof schema>;
