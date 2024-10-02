import { z } from "zod";

const url = `http://api.open-notify.org/astros.json`;

const schema = z.object({
  message: z.string(),
  number: z.number(),
  people: z.array(
    z.object({
      name: z.string(),
      craft: z.string()
    })
  )
});

export const issAstronautsEndpoint = { url, schema };

export type ISSAstronautsSchemaType = z.infer<typeof schema>;
