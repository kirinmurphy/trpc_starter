import { z } from "zod";

const nasaApiKey = process.env.NASA_API_KEY;

const url = `https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?sol=1000&api_key=${nasaApiKey}&page=1`;

const schema = z.object({
  photos: z.array(
    z.object({
      id: z.number(),
      sol: z.number(),
      camera: z.any(),
      img_src: z.string()
    })
  )
});

export const marsRovePicsEndpoint = { url, schema };

export type MarsRoverPicsSchemaType = z.infer<typeof schema>;
