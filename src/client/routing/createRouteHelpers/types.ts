import { LoaderFnContext, RouteOptions } from '@tanstack/react-router';

export type RouteWrapperProps<TLoaderData = Record<string, unknown>> = Omit<
  Partial<RouteOptions>,
  'loader' | 'beforeLoad' | 'getParentRoute' | 'component' | 'path'
> & {
  path: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component: React.ComponentType<any>;
  routeLoader?: (
    context: LoaderFnContext
  ) => Promise<TLoaderData> | TLoaderData;
};
