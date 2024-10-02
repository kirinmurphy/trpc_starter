import { z } from "zod";

const url = `http://api.open-notify.org/iss-now.json`;

const schema = z.object({
  message: z.string(),
  timestamp: z.number(),
  iss_position: z.object({
    latitude: z.string(),
    longitude: z.string()
  })
});

export const issLocationEndpoint = { url, schema };

export type ISSLocationSchemaType = z.infer<typeof schema>;
