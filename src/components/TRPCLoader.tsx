import { UseTRPCQueryResult } from '@trpc/react-query/shared';
import { TRPCClientErrorLike } from '@trpc/client';
import { AnyRouter } from '@trpc/server';

type TRPCLoaderProps<TData, TError> = {
  query: UseTRPCQueryResult<TData, TError>;
  children: (data: TData) => React.ReactNode;
}

export function TRPCLoader<TData, TError extends TRPCClientErrorLike<AnyRouter>> (
  props: TRPCLoaderProps<TData, TError>
) {

  const { 
    query: { data, isLoading, error }, 
    children 
  } = props;

  if ( isLoading ) { return <div>Loading...</div> }

  if ( error || !data ) {
    console.error('trpc error: ', error || 'data failed to load');
    return <></>;
  }

  return children(data);
}