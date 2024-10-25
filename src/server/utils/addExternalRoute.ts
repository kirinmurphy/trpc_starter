import { z } from "zod";
import { publicProcedure } from "../trpcRouter";

type EndpointType<T> = {
  url: string; 
  schema: T
}

export async function addExternalRoute<T extends z.ZodType> (
  { endpoint }: { endpoint: EndpointType<T> }
) {
  const { url, schema } = endpoint;
  return publicProcedure
    .output(schema)
    .query(async (): Promise<T> => {
      const response = await fetch(url);
      const data = await response.json();
      return schema.parse(data);
    });
}
