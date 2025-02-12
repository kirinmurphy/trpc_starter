import { TRPCLink } from '@trpc/react-query';
import { observable } from '@trpc/server/observable';
import { AppRouter } from '../../server/server';
import { createHttpLink } from './createHttpLink';
import { handleAuthLinkErrors } from './handleAuthLinkErrors';

export function getAuthLink(): TRPCLink<AppRouter> {
  return (runtime) => {
    const forward = createHttpLink()(runtime);

    return (req) => {
      return observable((observer) => {
        const subscription = forward(req).subscribe({
          next(value) {
            observer.next(value);
          },

          error(err: unknown) {
            void handleAuthLinkErrors({ err, req, observer, forward });
          },

          complete() {
            observer.complete();
          },
        });

        return () => {
          subscription.unsubscribe();
        };
      });
    };
  };
}
