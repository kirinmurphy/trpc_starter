import { publicProcedure, router } from "./router";
import { createHTTPServer } from "@trpc/server/adapters/standalone";
import cors from 'cors';
import { z } from "zod";

const MarsRoverPicsSchema = z.object({
  photos: z.array(
    z.object({
      id: z.number(),
      sol: z.number(),
      camaera: z.any(),
      img_src: z.string()
    })
  )
});

type MarsRoverPicsSchemaResponse = z.infer<typeof MarsRoverPicsSchema>;

const ISSLocationSchema = z.object({
  message: z.string(),
  timestamp: z.number(),
  iss_position: z.object({
    latitude: z.string(),
    longitude: z.string()
  })
});

type ISSLocationSchemaResponse = z.infer<typeof ISSLocationSchema>;

const AstroResponseSchema = z.object({
  message: z.string(),
  number: z.number(),
  people: z.array(
    z.object({
      name: z.string(),
      craft: z.string()
    })
  )
});

type AstroResponse = z.infer<typeof AstroResponseSchema>;

const nasaApiKey = process.env.NASA_API_KEY;
console.log('nasaApiKey', nasaApiKey);

export const appRouter = router({
  getMarsRoverPics: publicProcedure
    .query(async (): Promise<MarsRoverPicsSchemaResponse> => {
      const url  = `https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?sol=1000&api_key=${nasaApiKey}&page=1`;
      const response = await fetch(url);
      const data = await response.json();
      return MarsRoverPicsSchema.parse(data);
    }),
  getNasaPicOfTheDay: publicProcedure
    .query(async (): Promise<unknown> => {
      const url = `https://api.nasa.gov/planetary/apod?api_key=${nasaApiKey}`;
      const response = await fetch(url);
      const data = await response.json();
      return data;
    }),
  getAstronautsOnISS: publicProcedure
    .output(AstroResponseSchema)
    .query(async (): Promise<AstroResponse> => {   
      const response = await fetch(`http://api.open-notify.org/astros.json`);
      const data = await response.json();
      return AstroResponseSchema.parse(data);
    }),
  getISSLocation: publicProcedure
    .output(ISSLocationSchema)
    .query(async (): Promise<ISSLocationSchemaResponse> => {
      const response = await fetch(`http://api.open-notify.org/iss-now.json`);
      const data = await response.json();
      console.log('((((((((((((((((())))))))))))))))))))) DATA', data);
      return data;
    })
});

const server = createHTTPServer({
  router: appRouter,
  middleware: cors()
});

server.listen(3000);
console.log('Server running on port 3000');

export type AppRouter = typeof appRouter;
